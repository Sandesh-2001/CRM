# Authentication Implementation Guide

This document describes the JWT-based authentication system implemented in the CRM backend.

---

## Overview

The authentication system includes:

- ✅ User registration with password hashing (bcrypt)
- ✅ User login with JWT token generation
- ✅ Protected routes using JWT middleware
- ✅ Password update functionality
- ✅ Role-based authentication (admin, manager, user)
- ✅ Comprehensive error handling and validation

---

## Installation

The following packages have been installed:

```bash
npm install jsonwebtoken bcryptjs
```

### Installed Packages

- **jsonwebtoken** (v9.0.3): JWT token generation and verification
- **bcryptjs** (v3.0.3): Password hashing and verification

---

## Environment Configuration

### Updated .env File

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/crm

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:4200

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_this_in_production_make_it_long_and_random_12345678901234567890
JWT_EXPIRY=7d
```

**Important**: Change `JWT_SECRET` to a strong, random string in production!

---

## Database Schema - User Model

### File: `src/models/User.js`

**Fields:**

```javascript
{
  name: String (required, 2+ chars),
  email: String (required, unique, validated),
  password: String (required, 6+ chars, hashed, not returned by default),
  role: String (admin, manager, user - default: user),
  isActive: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Features:**

- Password hashing with bcrypt before save
- Password comparison method
- Email uniqueness validation
- Role-based access control

---

## API Endpoints

### Base URL

```
http://localhost:5000/api/auth
```

---

### 1. Register User

**Endpoint:**

```
POST /api/auth/register
```

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

**Validation:**

- All fields required
- Password minimum 6 characters
- Passwords must match
- Email must be valid
- Email must be unique

**Response (201 - Success):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Response (400 - Bad Request):**

```json
{
  "success": false,
  "error": "Email is already in use"
}
```

---

### 2. Login User

**Endpoint:**

```
POST /api/auth/login
```

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation:**

- Email and password required
- Email must exist
- Password must match

**Response (200 - Success):**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Response (401 - Unauthorized):**

```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

---

### 3. Get Current User (Protected)

**Endpoint:**

```
GET /api/auth/me
```

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Response (200 - Success):**

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-10T12:30:00.000Z"
  }
}
```

**Response (401 - Unauthorized):**

```json
{
  "success": false,
  "error": "No token provided. Please provide authentication token"
}
```

---

### 4. Update Password (Protected)

**Endpoint:**

```
PUT /api/auth/update-password
```

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456",
  "passwordConfirm": "newpassword456"
}
```

**Validation:**

- All fields required
- New password minimum 6 characters
- New passwords must match
- Current password must be correct

**Response (200 - Success):**

```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Response (401 - Unauthorized):**

```json
{
  "success": false,
  "error": "Current password is incorrect"
}
```

---

## Protected Routes

### Contact Routes (All Protected)

All contact endpoints now require authentication:

```
GET    /api/contacts              (Protected)
GET    /api/contacts/:id          (Protected)
POST   /api/contacts              (Protected)
PUT    /api/contacts/:id          (Protected)
DELETE /api/contacts/:id          (Protected)
```

**Example - Get All Contacts with Auth:**

```bash
curl -X GET http://localhost:5000/api/contacts \
  -H "Authorization: Bearer <your-jwt-token>"
```

---

## Middleware

### File: `src/middleware/authMiddleware.js`

#### 1. verifyToken Middleware

Verifies JWT token and extracts user information.

**Usage:**

```javascript
const { verifyToken } = require("../middleware/authMiddleware");

app.use("/api/protected-route", verifyToken, controller);
```

**Adds to request:**

```javascript
req.user = {
  id: user._id,
  email: user.email,
  role: user.role,
};
```

#### 2. authorize Middleware

Checks if user has required role(s).

**Usage:**

```javascript
const { verifyToken, authorize } = require("../middleware/authMiddleware");

app.delete("/api/admin", verifyToken, authorize("admin"), controller);
```

**Example with multiple roles:**

```javascript
authorize("admin", "manager");
```

---

## Authentication Flow

```
1. User Registration
   ├─ POST /auth/register
   ├─ Validate input
   ├─ Hash password with bcrypt
   ├─ Save user to MongoDB
   └─ Return JWT token

2. User Login
   ├─ POST /auth/login
   ├─ Find user by email
   ├─ Compare password with bcrypt
   ├─ Generate JWT token (7 days expiry)
   └─ Return token

3. Access Protected Route
   ├─ Include token: Authorization: Bearer <token>
   ├─ verifyToken middleware decodes JWT
   ├─ Validates token expiry
   ├─ Attaches user info to req.user
   └─ Route handler executes

4. Update Password
   ├─ PUT /auth/update-password (requires token)
   ├─ Verify current password
   ├─ Hash new password
   ├─ Update user document
   └─ Return success
```

---

## cURL Examples

### Register User

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

### Login User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Current User

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### Create Contact (Protected)

```bash
curl -X POST http://localhost:5000/api/contacts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "status": "lead"
  }'
```

### Update Password

```bash
curl -X PUT http://localhost:5000/api/auth/update-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword456",
    "passwordConfirm": "newpassword456"
  }'
```

---

## Testing with Postman

### Setup Collection

1. **Create Environment Variables:**
   - Variable: `base_url` = `http://localhost:5000/api`
   - Variable: `token` = (will be set after login)

2. **Register Request:**
   - URL: `{{base_url}}/auth/register`
   - Method: POST
   - Body (JSON):

   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "test123456",
     "passwordConfirm": "test123456"
   }
   ```

   - Tests tab:

   ```javascript
   pm.environment.set("token", pm.response.json().token);
   ```

3. **Login Request:**
   - URL: `{{base_url}}/auth/login`
   - Method: POST
   - Body (JSON):

   ```json
   {
     "email": "test@example.com",
     "password": "test123456"
   }
   ```

   - Tests tab:

   ```javascript
   pm.environment.set("token", pm.response.json().token);
   ```

4. **Protected Route (Contacts):**
   - URL: `{{base_url}}/contacts`
   - Method: GET
   - Headers:
     - Key: `Authorization`
     - Value: `Bearer {{token}}`

---

## Security Best Practices

### 1. JWT Secret Management

```env
# ❌ DON'T use in production:
JWT_SECRET=secret

# ✅ DO use in production:
JWT_SECRET=a_very_long_random_string_with_number_and_special_chars_!@#$%^&*()_+
```

### 2. Password Security

- Minimum 6 characters (can be increased)
- Hashed with bcrypt (10 salt rounds)
- Never stored as plain text
- Always compare with bcrypt.compare()

### 3. Token Security

- 7-day expiry (configurable)
- Sent in Authorization header (Bearer scheme)
- Never stored in localStorage (use httpOnly cookies for frontend)
- Verified on server for every protected route

### 4. Error Messages

- Generic messages for login failures (don't reveal if email exists)
- Specific validation error messages for registration

### 5. Rate Limiting

Consider adding rate limiting for security:

```bash
npm install express-rate-limit
```

---

## Error Handling

### Common Errors

| Status | Error                      | Solution                                           |
| ------ | -------------------------- | -------------------------------------------------- |
| 400    | Missing required fields    | Ensure all required fields in request              |
| 400    | Email already in use       | Use different email or login with existing account |
| 400    | Passwords do not match     | Ensure password fields match exactly               |
| 401    | Invalid email or password  | Check credentials are correct                      |
| 401    | No token provided          | Include Authorization header with Bearer token     |
| 401    | Invalid or expired token   | Re-login to get new token                          |
| 403    | You do not have permission | User role doesn't have required access             |
| 500    | Server error               | Check server logs                                  |

---

## Frontend Integration (Angular)

### AuthService Example

```typescript
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "http://localhost:5000/api/auth";

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }

  updatePassword(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-password`, data);
  }

  setToken(token: string): void {
    localStorage.setItem("token", token);
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  removeToken(): void {
    localStorage.removeItem("token");
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
```

### HTTP Interceptor Example

```typescript
import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(req);
  }
}
```

---

## Advanced Features

### 1. Role-Based Access Control

```javascript
// Only admin can access
app.delete("/api/users/:id", verifyToken, authorize("admin"), deleteUser);

// Admin or manager can access
app.put(
  "/api/users/:id",
  verifyToken,
  authorize("admin", "manager"),
  updateUser,
);
```

### 2. Admin Functions (To Implement)

```javascript
// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  // Implementation here
};

// Deactivate user (admin only)
exports.deactivateUser = async (req, res) => {
  // Implementation here
};

// Change user role (admin only)
exports.changeUserRole = async (req, res) => {
  // Implementation here
};
```

---

## Production Checklist

- [ ] Change JWT_SECRET to strong random value
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Implement 2FA (two-factor authentication)
- [ ] Add email verification
- [ ] Implement password reset flow
- [ ] Add audit logging
- [ ] Use httpOnly cookies for tokens
- [ ] Add CSRF protection
- [ ] Regular security audits

---

## Testing the Implementation

### Step 1: Start Backend

```bash
cd backend
npm run dev
# Expected: Server running on port 5000
```

### Step 2: Test with Postman

**Register:**

```
POST http://localhost:5000/api/auth/register
Body:
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123456",
  "passwordConfirm": "test123456"
}
```

**Login:**

```
POST http://localhost:5000/api/auth/login
Body:
{
  "email": "test@example.com",
  "password": "test123456"
}
```

**Copy the token from response**, then:

**Get Current User:**

```
GET http://localhost:5000/api/auth/me
Headers:
Authorization: Bearer <paste-token-here>
```

**Get Contacts (Protected):**

```
GET http://localhost:5000/api/contacts
Headers:
Authorization: Bearer <paste-token-here>
```

---

## Troubleshooting

### Issue: "No token provided"

**Solution**: Ensure Authorization header is included with Bearer token

### Issue: "Invalid or expired token"

**Solution**: Re-login to get a new token, or check JWT_SECRET is correct

### Issue: "Email already in use"

**Solution**: Use a different email or login with existing account

### Issue: Password hash taking too long

**Solution**: This is normal - bcrypt with 10 rounds takes 100-200ms

### Issue: MongoDB Error

**Solution**: Ensure MongoDB is running and connection string is correct

---

## Next Steps

1. Implement password reset functionality
2. Add email verification on signup
3. Implement two-factor authentication (2FA)
4. Add user profile endpoints
5. Implement role-based dashboard features
6. Add audit logging for security events
7. Implement refresh token mechanism
8. Add social login (OAuth)

---

**Last Updated**: April 10, 2026  
**Status**: Complete and Tested ✅
