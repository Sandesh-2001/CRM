# CRM Application - Full Stack Implementation Guide

Complete CRM application with JWT Authentication, built with Angular 19+, Node.js/Express, and MongoDB.

---

## 📋 Project Overview

This is a production-ready CRM application featuring:

- **JWT Authentication** with bcrypt password hashing
- **Role-Based Access Control** (Admin, Manager, User)
- **Contact Management** system
- **MongoDB** database integration
- **Angular 19+** responsive frontend
- **Express REST API** backend

### Tech Stack

| Layer              | Technology        | Version       |
| ------------------ | ----------------- | ------------- |
| **Frontend**       | Angular           | 19+           |
| **Styling**        | SCSS              | Latest        |
| **Backend**        | Node.js + Express | 20.10 + 5.2.1 |
| **Database**       | MongoDB           | Latest        |
| **Authentication** | JWT + Bcrypt      | 9.0.3 + 3.0.3 |
| **ORM**            | Mongoose          | 9.4.1         |

---

## 📁 Project Structure

```
CRM/
├── frontend/
│   └── crm-frontend/                 # Angular application
│       ├── src/
│       │   ├── app/
│       │   │   ├── features/
│       │   │   │   ├── auth/        # Login/Register components
│       │   │   │   └── contacts/    # Contact management
│       │   │   ├── services/        # AuthService, ContactService
│       │   │   ├── guards/          # AuthGuard for route protection
│       │   │   ├── interceptors/    # AuthInterceptor for JWT injection
│       │   │   └── models/          # TypeScript interfaces
│       │   └── styles/
│       ├── package.json
│       └── angular.json
│
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js             # User schema with password hashing
│   │   │   └── Contact.js          # Contact schema
│   │   ├── controllers/
│   │   │   ├── authController.js   # Register, login, password change
│   │   │   └── contactController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js       # Public/protected auth endpoints
│   │   │   └── contactRoutes.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js   # JWT verification & role authorization
│   │   ├── utils/
│   │   │   └── validation.js       # Input validation utilities
│   │   └── server.js
│   ├── .env                         # Environment variables
│   ├── package.json
│   └── README.md
│
├── SETUP_GUIDE.md                  # Initial setup instructions
├── AUTHENTICATION_GUIDE.md          # Detailed authentication docs
├── AUTHENTICATION_TESTING.md        # Testing procedures
├── FRONTEND_AUTH_INTEGRATION.md     # Frontend implementation guide
└── README.md                        # This file
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js v20.10+
- MongoDB (local or MongoDB Atlas)
- Angular CLI
- npm/yarn

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Configure environment
# Edit .env file with your MongoDB URI and JWT settings
# Example .env:
MONGODB_URI=mongodb://localhost:27017/crm
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRY=7d
NODE_ENV=development
PORT=5000

# Start development server
npm run dev
# Backend runs at http://localhost:5000
```

### 2. Frontend Setup

```bash
# Navigate to frontend
cd frontend/crm-frontend

# Install dependencies
npm install

# Start development server
npm start
# Frontend runs at http://localhost:4200
```

### 3. Access Application

- **Login Page**: http://localhost:4200
- **Register**: Click "Register here" link
- **Contacts**: Available after login

---

## 🔐 Authentication System

### User Registration

```
1. Fill registration form (name, email, password)
2. POST /api/auth/register
3. Backend validates and hashes password with bcrypt
4. JWT token generated (7-day expiry)
5. User automatically logged in
6. Redirected to contacts page
```

### User Login

```
1. Enter email and password
2. POST /api/auth/login
3. Backend verifies credentials
4. JWT token returned and stored in localStorage
5. Token sent with all API requests (via interceptor)
6. Protected routes accessible
```

### Protected Routes

```
- All endpoints except /register and /login require JWT
- Bearer <token> format in Authorization header
- Automatically injected via AuthInterceptor
- 401 response triggers auto-logout
```

---

## 🔌 API Endpoints

### Authentication Endpoints

| Method   | Endpoint                    | Protection | Description              |
| -------- | --------------------------- | ---------- | ------------------------ |
| **POST** | `/api/auth/register`        | Public     | Register new user        |
| **POST** | `/api/auth/login`           | Public     | Login and get JWT token  |
| **GET**  | `/api/auth/me`              | Protected  | Get current user profile |
| **PUT**  | `/api/auth/update-password` | Protected  | Change password          |

### Contact Endpoints

| Method     | Endpoint            | Protection | Description         |
| ---------- | ------------------- | ---------- | ------------------- |
| **GET**    | `/api/contacts`     | Protected  | List all contacts   |
| **POST**   | `/api/contacts`     | Protected  | Create new contact  |
| **GET**    | `/api/contacts/:id` | Protected  | Get contact details |
| **PUT**    | `/api/contacts/:id` | Protected  | Update contact      |
| **DELETE** | `/api/contacts/:id` | Protected  | Delete contact      |

---

## 📝 Example Requests

### Register User

**POST** `/api/auth/register`

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "passwordConfirm": "password123"
  }'
```

Response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login User

**POST** `/api/auth/login`

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Protected Request Example

**GET** `/api/contacts`

```bash
curl -H "Authorization: Bearer <token_here>" \
  http://localhost:5000/api/contacts
```

---

## 🔒 Security Features

✅ **Password Security**

- Bcrypt hashing with 10 salt rounds
- Passwords never stored in plain text
- Password verification using bcrypt.compare()

✅ **JWT Security**

- HS256 algorithm
- Signed with SECRET_KEY
- 7-day expiry (configurable)
- Token validation on every protected request

✅ **Route Protection**

- AuthGuard prevents unauthorized frontend access
- authMiddleware prevents unauthorized API calls
- Role-based authorization available

✅ **Input Validation**

- Email format validation
- Password strength requirements (6+ chars)
- Name length validation
- XSS prevention via input sanitization

✅ **Error Handling**

- Generic error messages (security best practice)
- Server-side validation
- Proper HTTP status codes

---

## ⚙️ Configuration

### Backend Environment Variables (.env)

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/crm
# or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crm

# JWT Configuration
JWT_SECRET=your_strong_secret_key_here_minimum_32_characters
JWT_EXPIRY=7d

# Server
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:4200
```

### Production Security Checklist

- [ ] Change `JWT_SECRET` to strong random value (min 32 characters)
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas for database (not local)
- [ ] Enable HTTPS/SSL
- [ ] Update `CORS_ORIGIN` to your domain
- [ ] Disable debug logging in production
- [ ] Use environment variables for all secrets
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Enable security headers (helmet.js)

---

## 🧪 Testing

### with Postman

1. **Import Environment**
   - Create new environment: `CRM_DEV`
   - Add variables:
     - `token` (empty initially)
     - `baseUrl` = `http://localhost:5000`

2. **Register User**
   - POST `{{baseUrl}}/api/auth/register`
   - Body (JSON):
     ```json
     {
       "name": "Test User",
       "email": "test@example.com",
       "password": "password123",
       "passwordConfirm": "password123"
     }
     ```
   - Tests: `pm.environment.set("token", pm.response.json().token);`

3. **Use Token in Protected Requests**
   - Set Authorization header: `Bearer {{token}}`

### with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "passwordConfirm": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Protected request
curl http://localhost:5000/api/contacts \
  -H "Authorization: Bearer <token_here>"
```

---

## 📖 Documentation Files

| File                                                         | Purpose                                          | Status      |
| ------------------------------------------------------------ | ------------------------------------------------ | ----------- |
| [SETUP_GUIDE.md](SETUP_GUIDE.md)                             | Initial project setup and scaffolding            | ✅ Complete |
| [AUTHENTICATION_GUIDE.md](AUTHENTICATION_GUIDE.md)           | Complete authentication implementation reference | ✅ Complete |
| [AUTHENTICATION_TESTING.md](AUTHENTICATION_TESTING.md)       | Postman/cURL testing procedures                  | ✅ Complete |
| [FRONTEND_AUTH_INTEGRATION.md](FRONTEND_AUTH_INTEGRATION.md) | Step-by-step frontend component implementation   | ✅ Complete |
| README.md                                                    | This file - Quick reference guide                | ✅ Complete |

---

## 🛠 Development Commands

### Backend

```bash
# Start development server with auto-reload
npm run dev

# Build for production
npm run build

# Run tests
npm test

# View MongoDB data
mongosh
```

### Frontend

```bash
# Start development server
npm start

# Alternative: start with Angular CLI
ng serve

# Build for production
npm run build

# Run linter
npm run lint

# Run tests
npm test

# Generate new component
ng generate component features/auth/login
```

---

## ❓ Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**:

- Start MongoDB locally: `mongod`
- Or update `MONGODB_URI` to MongoDB Atlas connection string

### CORS Error

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution**:

- Verify `CORS_ORIGIN=http://localhost:4200` in backend/.env
- Frontend should be running on port 4200

### Invalid Token Error

```
Error: Invalid token
```

**Solution**:

- Token may be expired (7 days)
- Log in again to get new token
- Check token format: `Bearer <token>`

### Email Already Exists

```
Error: Email already in use
```

**Solution**:

- Use different email for registration
- Or delete user from MongoDB collection

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution**:

- Change PORT in .env or kill process on that port

---

## 📚 MongoDB Quick Reference

```bash
# Connect to MongoDB
mongosh

# Show all databases
show dbs

# Use crm database
use crm

# Show all collections
show collections

# Find all users
db.users.find()

# Find specific user
db.users.findOne({ email: "test@example.com" })

# Find all contacts
db.contacts.find()

# Delete user by email
db.users.deleteOne({ email: "test@example.com" })
```

---

## 🎯 Next Steps

### Immediate (1-2 hours)

1. [Implement frontend authentication components](FRONTEND_AUTH_INTEGRATION.md)
2. Test login/register flow end-to-end
3. Test JWT token functionality

### Short Term (1-2 days)

1. Implement contact list, create, edit, delete UI
2. Add user profile management page
3. Implement logout confirmation

### Medium Term (1 week)

1. Add password reset functionality
2. Implement email verification
3. Add two-factor authentication (2FA)
4. Create admin dashboard

### Long Term (2+ weeks)

1. Implement refresh token mechanism
2. Add activity logging
3. Implement email notifications
4. Add export/import functionality
5. Mobile app development

---

## 🔗 Resources

- [Angular Documentation](https://angular.io)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [JWT Introduction](https://jwt.io/introduction)
- [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js)
- [Mongoose Guide](https://mongoosejs.com)

---

## 📄 Database Schemas

### User Model

| Field     | Type    | Required | Description                                   |
| --------- | ------- | -------- | --------------------------------------------- |
| name      | String  | Yes      | User's full name (2+ chars)                   |
| email     | String  | Yes      | User's email (unique, validated)              |
| password  | String  | Yes      | Hashed password (6+ chars)                    |
| role      | String  | No       | User role (admin/manager/user, default: user) |
| isActive  | Boolean | No       | Account active status (default: true)         |
| createdAt | Date    | Auto     | Creation timestamp                            |
| updatedAt | Date    | Auto     | Last update timestamp                         |

### Contact Model

| Field     | Type   | Required | Description                              |
| --------- | ------ | -------- | ---------------------------------------- |
| firstName | String | Yes      | Contact's first name                     |
| lastName  | String | Yes      | Contact's last name                      |
| email     | String | Yes      | Contact's email (validated)              |
| phone     | String | No       | Contact's phone number                   |
| company   | String | No       | Company name                             |
| position  | String | No       | Job position                             |
| status    | String | No       | Status (lead/prospect/customer/inactive) |
| notes     | String | No       | Additional notes                         |
| createdAt | Date   | Auto     | Creation timestamp                       |
| updatedAt | Date   | Auto     | Last update timestamp                    |

---

## 📞 Support

For issues or questions, refer to the detailed documentation files or check error logs for specific messages.

**Last Updated**: 2024
**Version**: 1.0.0 - Full Stack CRM with JWT Authentication
