# SA25-26_ClassN01_Group05

This repository contains all source code and project-related documents for the course project.

## Repository Structure

- **Documents/**  
  Contains all project documentation, including the project plan, Software Requirements Specification (SRS), and weekly lab reports. This folder serves as a central reference for tracking project progress and maintaining organized documentation for the team and instructors.

- **Design/**  
  Contains all design-related documents, covering system architecture, functional design, and database/data design. These files help visualize the system's structure and workflow, ensuring consistency during development.

- **SRC/**  
  Contains the source code of the project.

- **README.md**  
  Provides an overview of the project, instructions, and other essential information for understanding and using the repository.

- **CHANGELOG.md**  
  Tracks all changes and updates made to the project, including new features, bug fixes, and improvements.


```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'fontSize': '18px',
    'fontFamily': 'Arial, sans-serif'
  },
  'flowchart': {
    'nodeSpacing': 30,
    'rankSpacing': 40,
    'padding': 25,
    'htmlLabels': true,
    'curve': 'basis'
  }
}}%%
flowchart TB
    %% ==================== ACTORS ====================
    subgraph Actors["External Actors"]
        Customer["Customer<br/>End user ordering food"]
    end

    %% ==================== EXTERNAL SYSTEMS ====================
    subgraph ExternalSystems["External Systems"]
        PaymentGateway["Payment Providers<br/> VNPay<br/>HTTPS/API"]
    end

    %% ==================== CLIENT LAYER ====================
    subgraph ClientLayer["Client Layer"]
        MobileApp["Mobile App<br/>Flutter / Dart"]
    end

    %% ==================== GATEWAY LAYER ====================
    subgraph GatewayLayer["API Gateway Layer"]
        Gateway["API Gateway<br/>Node.js, Express<br/>Port: 3000"]
    end

    %% ==================== SERVICES LAYER ====================
    subgraph ServicesLayer["Microservices Layer"]
        direction LR
        
        subgraph CoreServices["Core Business Services"]
            UserSvc["User Service<br/>Node.js, Sequelize, JWT<br/>Port: 3007"]
            CartSvc["Cart Service<br/>Node.js, mysql2<br/>Port: 3002"]
            OrderSvc["Order Service<br/>Node.js, axios<br/>Port: 3003"]
            RestaurantSvc["Restaurant Service<br/>Node.js, Sequelize<br/>Port: 3004"]
            PaymentSvc["Payment Service<br/>Node.js, mysql2<br/>Port: 3008"]
        end
        
        subgraph SupportServices["Support Services"]
            DiscoverySvc["Discovery Service<br/>Node.js, axios<br/>Port: 3006"]
            NotificationSvc["Notification Service<br/>Node.js, amqplib<br/>Port: 3005"]
            PromotionSvc["Promotion Service<br/>Node.js, mysql2"]
            ReviewSvc["Review Service<br/>Node.js, mysql2"]
        end
    end

    %% ==================== MESSAGE BROKER ====================
    subgraph MessageBroker["Message Broker"]
        RabbitMQ["RabbitMQ<br/>AMQP Protocol<br/>Port: 5672"]
    end

    %% ==================== DATABASE LAYER ====================
    subgraph DatabaseLayer["Database Layer (MySQL 8.x)"]
        direction LR
        UserDB[("User DB")]
        CartDB[("Cart DB")]
        OrderDB[("Order DB")]
        RestaurantDB[("Restaurant DB")]
        PaymentDB[("Payment DB")]
        NotificationDB[("Notification DB")]
        PromotionDB[("Promotion DB")]
        ReviewDB[("Review DB")]
    end

    %% ==================== RELATIONSHIPS ====================
    
    %% Actor to Client
    Customer -->|"HTTPS"| MobileApp
    
    %% Client to Gateway
    MobileApp -->|"HTTPS/REST"| Gateway
    
    %% Gateway to Services
    Gateway -->|"/api/auth/*"| UserSvc
    Gateway -->|"/api/carts/*"| CartSvc
    Gateway -->|"/api/orders/*"| OrderSvc
    Gateway -->|"/restaurants/*"| RestaurantSvc
    Gateway -->|"/search/*"| DiscoverySvc
    Gateway -->|"/notifications/*"| NotificationSvc
    Gateway -->|"/api/payments/*"| PaymentSvc
    
    %% Services to Databases (TCP/MySQL)
    UserSvc -->|"TCP"| UserDB
    CartSvc -->|"TCP"| CartDB
    OrderSvc -->|"TCP"| OrderDB
    RestaurantSvc -->|"TCP"| RestaurantDB
    NotificationSvc -->|"TCP"| NotificationDB
    PaymentSvc -->|"TCP"| PaymentDB
    PromotionSvc -->|"TCP"| PromotionDB
    ReviewSvc -->|"TCP"| ReviewDB
    
    %% Inter-Service Communication (HTTP/REST)
    OrderSvc -.->|"HTTP/REST<br/>Get cart, checkout"| CartSvc
    DiscoverySvc -.->|"HTTP/REST<br/>Search restaurants"| RestaurantSvc
    OrderSvc -.->|"HTTP/REST<br/>Process payment"| PaymentSvc
    
    %% Event-Driven (AMQP)
    OrderSvc ==>|"Publish<br/>order.confirmed<br/>order.delivered"| RabbitMQ
    UserSvc ==>|"Publish<br/>user.registered"| RabbitMQ
    PaymentSvc ==>|"Publish<br/>payment.success"| RabbitMQ
    RabbitMQ ==>|"Consume<br/>events"| NotificationSvc

    %% ==================== STYLING ====================
    %% Subgraph styling - transparent background with dashed border
    style Actors fill:transparent,stroke:#1565c0,stroke-width:2px,stroke-dasharray:5 5
    style ClientLayer fill:transparent,stroke:#1976d2,stroke-width:2px,stroke-dasharray:5 5
    style GatewayLayer fill:transparent,stroke:#1e88e5,stroke-width:2px,stroke-dasharray:5 5
    style ServicesLayer fill:transparent,stroke:#1976d2,stroke-width:2px,stroke-dasharray:5 5
    style CoreServices fill:transparent,stroke:#42a5f5,stroke-width:1px,stroke-dasharray:3 3
    style SupportServices fill:transparent,stroke:#42a5f5,stroke-width:1px,stroke-dasharray:3 3
    style MessageBroker fill:transparent,stroke:#0d47a1,stroke-width:2px,stroke-dasharray:5 5
    style DatabaseLayer fill:transparent,stroke:#0d47a1,stroke-width:2px,stroke-dasharray:5 5
    
    %% Node styling
    classDef actorStyle fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    classDef clientStyle fill:#bbdefb,stroke:#1976d2,stroke-width:2px
    classDef gatewayStyle fill:#90caf9,stroke:#1e88e5,stroke-width:2px
    classDef serviceStyle fill:#64b5f6,stroke:#1976d2,stroke-width:2px
    classDef dbStyle fill:#42a5f5,stroke:#0d47a1,stroke-width:2px
    classDef mqStyle fill:#2196f3,stroke:#0d47a1,stroke-width:2px
    
    class MobileApp clientStyle
    class Gateway gatewayStyle
    class UserSvc,CartSvc,OrderSvc,RestaurantSvc,PaymentSvc,DiscoverySvc,NotificationSvc,PromotionSvc,ReviewSvc serviceStyle
    class UserDB,CartDB,OrderDB,RestaurantDB,PaymentDB,NotificationDB,PromotionDB,ReviewDB dbStyle
    class RabbitMQ mqStyle
    class PaymentGateway externalStyle
```
