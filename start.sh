#!/bin/bash

# ==========================================================
#  Yummy Food Delivery - Service Management Script
# ==========================================================
# Usage: 
#   ./start.sh start   - Start all backend services
#   ./start.sh stop    - Stop all backend services
#   ./start.sh restart - Restart all services
#   ./start.sh status  - Check status of services
# ==========================================================

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

BASE_DIR=$(pwd)/src/backend/services
LOG_DIR=$(pwd)/logs
mkdir -p "$LOG_DIR"

# format: "service_name:port"
SERVICES=(
    "api-gateway:3000"
    "cart-service:3002"
    "order-service:3003"
    "restaurant-service:3004"
    "notification-service:3005"
    "discovery-service:3006"
    "user-service:3007"
    "promotion-service:3008"
    "review-service:3009"
)

# Function to stop all services
stop_services() {
    echo -e "${YELLOW}Stopping all services on ports 3000-3009...${NC}"
    PIDS=$(lsof -ti:3000,3001,3002,3003,3004,3005,3006,3007,3008,3009 2>/dev/null)
    if [ -n "$PIDS" ]; then
        echo "$PIDS" | xargs kill -9
        echo -e "${GREEN}✅ All services have been stopped.${NC}"
    else
        echo -e "${YELLOW}No services were found running.${NC}"
    fi
}

# Function to start all services
start_services() {
    echo -e "${YELLOW}Checking MySQL connection...${NC}"
    if ! mysql -u root -e "SELECT 1" > /dev/null 2>&1; then
        echo -e "${RED}❌ MySQL is not running or accessible. Please start MySQL.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ MySQL is running.${NC}"

    # Create databases if they don't exist
    echo -e "${YELLOW}Ensuring databases exist...${NC}"
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS api_gateway_db; CREATE DATABASE IF NOT EXISTS cart_service_db; CREATE DATABASE IF NOT EXISTS order_service_db; CREATE DATABASE IF NOT EXISTS restaurant_service_db; CREATE DATABASE IF NOT EXISTS notification_service_db; CREATE DATABASE IF NOT EXISTS discovery_service_db; CREATE DATABASE IF NOT EXISTS user_service_db; CREATE DATABASE IF NOT EXISTS promotion_service_db; CREATE DATABASE IF NOT EXISTS review_service_db;"

    echo -e "${YELLOW}Starting all services...${NC}"

    for item in "${SERVICES[@]}"; do
        SERVICE="${item%%:*}"
        PORT="${item##*:}"
        DIR="$BASE_DIR/$SERVICE"
        
        if [ ! -d "$DIR" ]; then
            echo -e "${RED}Directory $DIR not found, skipping $SERVICE${NC}"
            continue
        fi

        echo -e "${YELLOW}Setting up $SERVICE (Port $PORT)...${NC}"
        
        # Create .env if it doesn't exist
        if [ ! -f "$DIR/.env" ]; then
            DB_NAME="${SERVICE//-/_}_db"
            cat > "$DIR/.env" << EOF
PORT=$PORT
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=$DB_NAME
DB_USER=root
DB_PASSWORD=
CART_SERVICE_URL=http://localhost:3002
RESTAURANT_SERVICE_URL=http://localhost:3004
ORDER_SERVICE_URL=http://localhost:3003
USER_SERVICE_URL=http://localhost:3007
EOF
            echo -e "${GREEN}  - Created .env for $SERVICE${NC}"
        fi

        # Install dependencies if node_modules missing
        if [ ! -d "$DIR/node_modules" ]; then
            echo -e "${YELLOW}  - Installing dependencies for $SERVICE...${NC}"
            (cd "$DIR" && npm install) > /dev/null 2>&1
        fi

        # Stop if port is in use
        if lsof -ti:"$PORT" > /dev/null 2>&1; then
            lsof -ti:"$PORT" | xargs kill -9
        fi

        # Start service
        echo -e "${GREEN}  - Starting $SERVICE...${NC}"
        (cd "$DIR" && npm start) > "$LOG_DIR/$SERVICE.log" 2>&1 &
    done

    echo -e "\n${GREEN}==========================================${NC}"
    echo -e "${GREEN}✅ All services have been started!${NC}"
    echo -e "${GREEN}==========================================${NC}"
    echo -e "📡 API Gateway: http://localhost:3000"
    echo -e "📝 Logs folder: $LOG_DIR"
}

# Function to check status
check_status() {
    echo -e "${YELLOW}Service Status Check:${NC}"
    printf "%-25s %-10s %-10s\n" "Service Name" "Port" "Status"
    printf "%s\n" "----------------------------------------------------"
    for item in "${SERVICES[@]}"; do
        SERVICE="${item%%:*}"
        PORT="${item##*:}"
        if lsof -ti:"$PORT" > /dev/null 2>&1; then
            echo -e printf "%-25s %-10s ${GREEN}%-10s${NC}\n" "$SERVICE" "$PORT" "RUNNING"
        else
            echo -e printf "%-25s %-10s ${RED}%-10s${NC}\n" "$SERVICE" "$PORT" "STOPPED"
        fi
    done
}

# Main logic based on arguments
case "$1" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        stop_services
        sleep 2
        start_services
        ;;
    status)
        check_status
        ;;
    *)
        # Default behavior: if no arg, start services
        if [ -z "$1" ]; then
            start_services
        else
            echo "Usage: $0 {start|stop|restart|status}"
            exit 1
        fi
        ;;
esac
