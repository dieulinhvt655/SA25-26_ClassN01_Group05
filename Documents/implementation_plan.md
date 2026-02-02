# Yummy Microservices - User Service & Discovery Service

Setup folder structure and core authentication logic for User Service, plus a Discovery Service with search capability.

## Proposed Changes

### User Service (`src/backend/services/user-service`)

Following the existing `food-service` architecture pattern with layered structure.

---

#### [NEW] [user-service/](file:///c:/KTPM/SA25-26_ClassN01_Group05/src/backend/services/user-service)

Folder structure:
```
user-service/
├── index.js                 # Entry point (port 3002)
├── package.json             # Dependencies
├── .env                     # Environment variables
├── config/
│   └── database.js          # Sequelize DB config
├── models/
│   └── user.model.js        # Sequelize User model
├── controllers/
│   └── user.controller.js   # HTTP request handlers
├── services/
│   └── auth.service.js      # Business logic (register/login/JWT)
├── middlewares/
│   └── verifyToken.js       # JWT verification middleware (shareable)
└── routes/
    └── user.routes.js       # Route definitions
```

---

#### [NEW] [user.model.js](file:///c:/KTPM/SA25-26_ClassN01_Group05/src/backend/services/user-service/models/user.model.js)

Sequelize model with fields:
- `id` - Primary key (auto-increment)
- `email` - Unique, required
- `password_hash` - Required (bcrypt hashed)
- `role` - ENUM ('customer', 'admin', 'restaurant_owner')
- `full_name` - Required

---

#### [NEW] [auth.service.js](file:///c:/KTPM/SA25-26_ClassN01_Group05/src/backend/services/user-service/services/auth.service.js)

Contains:
- `register(email, password, role, fullName)` - Hash password, create user
- `login(email, password)` - Verify credentials, return JWT with `{userId, role}`
- Uses `bcrypt` for password hashing, `jsonwebtoken` for JWT

---

#### [NEW] [user.controller.js](file:///c:/KTPM/SA25-26_ClassN01_Group05/src/backend/services/user-service/controllers/user.controller.js)

Endpoints:
- `POST /register` - Create new user
- `POST /login` - Authenticate and return JWT

---

#### [NEW] [verifyToken.js](file:///c:/KTPM/SA25-26_ClassN01_Group05/src/backend/services/user-service/middlewares/verifyToken.js)

Shareable middleware for team members (Linh, Ngoc, Quynh):
- Extracts Bearer token from `Authorization` header
- Verifies JWT signature
- Attaches `req.user = { userId, role }` for downstream use

---

### Discovery Service (`src/backend/services/discovery-service`)

---

#### [NEW] [discovery-service/](file:///c:/KTPM/SA25-26_ClassN01_Group05/src/backend/services/discovery-service)

Folder structure:
```
discovery-service/
├── index.js                 # Entry point (port 3003)
├── package.json             # Dependencies
├── .env                     # Environment variables
├── controllers/
│   └── search.controller.js # Search handler
├── services/
│   └── search.service.js    # Business logic + HTTP to Food Service
└── routes/
    └── search.routes.js     # Route definitions
```

---

#### [NEW] [search endpoint](file:///c:/KTPM/SA25-26_ClassN01_Group05/src/backend/services/discovery-service/controllers/search.controller.js)

- `GET /search?keyword=&category=&minPrice=`
- Uses `axios` to fetch data from Food Service (port 3001)
- Filters results based on query parameters

---

## Verification Plan

### Manual Verification

**Prerequisites:**
1. Install MySQL and create database `yummy_db`
2. Run `npm install` in each service folder
3. Configure `.env` files with DB credentials and JWT secret

**Test User Service:**
```bash
# Start the service
cd src/backend/services/user-service
npm run dev

# Test Register
curl -X POST http://localhost:3002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","role":"customer","fullName":"Test User"}'

# Test Login (should return JWT token)
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

**Test Discovery Service:**
```bash
# Start Food Service first (port 3001)
cd src/backend/services/food-service
npm run dev

# Start Discovery Service (port 3003)
cd src/backend/services/discovery-service
npm run dev

# Test Search
curl "http://localhost:3003/search?keyword=pizza&minPrice=10"
```

> [!IMPORTANT]
> The `verifyToken` middleware will be created as a standalone module that team members can copy to their services or import directly.
