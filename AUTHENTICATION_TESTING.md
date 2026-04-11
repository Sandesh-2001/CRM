/\*\*

- Authentication API Testing Guide
-
- This file contains Postman-ready requests for testing the authentication system.
- Import this into Postman or use as reference for API testing.
  \*/

// ============================================
// 1. REGISTER USER
// ============================================

// Request
{
"name": "Register User",
"request": {
"method": "POST",
"header": [
{
"key": "Content-Type",
"value": "application/json"
}
],
"body": {
"mode": "raw",
"raw": "{\n \"name\": \"John Doe\",\n \"email\": \"john@example.com\",\n \"password\": \"SecurePass123\",\n \"passwordConfirm\": \"SecurePass123\"\n}"
},
"url": {
"raw": "http://localhost:5000/api/auth/register",
"protocol": "http",
"host": ["localhost"],
"port": "5000",
"path": ["api", "auth", "register"]
}
},
"response": []
}

// Response (Success - 201)
{
"success": true,
"message": "User registered successfully",
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTcwNDg2NDgwMCwiZXhwIjoxNzA1NDY5NjAwfQ.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ",
"data": {
"id": "507f1f77bcf86cd799439011",
"name": "John Doe",
"email": "john@example.com",
"role": "user"
}
}

// ============================================
// 2. LOGIN USER
// ============================================

// Request
{
"name": "Login User",
"request": {
"method": "POST",
"header": [
{
"key": "Content-Type",
"value": "application/json"
}
],
"body": {
"mode": "raw",
"raw": "{\n \"email\": \"john@example.com\",\n \"password\": \"SecurePass123\"\n}"
},
"url": {
"raw": "http://localhost:5000/api/auth/login",
"protocol": "http",
"host": ["localhost"],
"port": "5000",
"path": ["api", "auth", "login"]
}
},
"response": []
}

// Response (Success - 200)
{
"success": true,
"message": "Login successful",
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTcwNDg2NDgwMCwiZXhwIjoxNzA1NDY5NjAwfQ.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ",
"data": {
"id": "507f1f77bcf86cd799439011",
"name": "John Doe",
"email": "john@example.com",
"role": "user"
}
}

// ============================================
// 3. GET CURRENT USER (Protected)
// ============================================

// Request
{
"name": "Get Current User",
"request": {
"method": "GET",
"header": [
{
"key": "Authorization",
"value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTcwNDg2NDgwMCwiZXhwIjoxNzA1NDY5NjAwfQ.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ"
}
],
"url": {
"raw": "http://localhost:5000/api/auth/me",
"protocol": "http",
"host": ["localhost"],
"port": "5000",
"path": ["api", "auth", "me"]
}
},
"response": []
}

// Response (Success - 200)
{
"success": true,
"data": {
"id": "507f1f77bcf86cd799439011",
"name": "John Doe",
"email": "john@example.com",
"role": "user",
"isActive": true,
"createdAt": "2024-01-10T12:30:00.000Z",
"updatedAt": "2024-01-10T12:30:00.000Z"
}
}

// ============================================
// 4. UPDATE PASSWORD (Protected)
// ============================================

// Request
{
"name": "Update Password",
"request": {
"method": "PUT",
"header": [
{
"key": "Content-Type",
"value": "application/json"
},
{
"key": "Authorization",
"value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTcwNDg2NDgwMCwiZXhwIjoxNzA1NDY5NjAwfQ.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ"
}
],
"body": {
"mode": "raw",
"raw": "{\n \"currentPassword\": \"SecurePass123\",\n \"newPassword\": \"NewSecurePass456\",\n \"passwordConfirm\": \"NewSecurePass456\"\n}"
},
"url": {
"raw": "http://localhost:5000/api/auth/update-password",
"protocol": "http",
"host": ["localhost"],
"port": "5000",
"path": ["api", "auth", "update-password"]
}
},
"response": []
}

// Response (Success - 200)
{
"success": true,
"message": "Password updated successfully"
}

// ============================================
// 5. GET CONTACTS (Protected - Requires Auth)
// ============================================

// Request
{
"name": "Get All Contacts",
"request": {
"method": "GET",
"header": [
{
"key": "Authorization",
"value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTcwNDg2NDgwMCwiZXhwIjoxNzA1NDY5NjAwfQ.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ"
}
],
"url": {
"raw": "http://localhost:5000/api/contacts",
"protocol": "http",
"host": ["localhost"],
"port": "5000",
"path": ["api", "contacts"]
}
},
"response": []
}

// Response (Success - 200)
{
"success": true,
"count": 1,
"data": [
{
"_id": "507f1f77bcf86cd799439012",
"firstName": "Jane",
"lastName": "Smith",
"email": "jane@example.com",
"status": "customer",
"createdAt": "2024-01-10T13:00:00.000Z",
"updatedAt": "2024-01-10T13:00:00.000Z"
}
]
}

// ============================================
// 6. CREATE CONTACT (Protected - Requires Auth)
// ============================================

// Request
{
"name": "Create Contact",
"request": {
"method": "POST",
"header": [
{
"key": "Content-Type",
"value": "application/json"
},
{
"key": "Authorization",
"value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTcwNDg2NDgwMCwiZXhwIjoxNzA1NDY5NjAwfQ.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ"
}
],
"body": {
"mode": "raw",
"raw": "{\n \"firstName\": \"Jane\",\n \"lastName\": \"Smith\",\n \"email\": \"jane@example.com\",\n \"phone\": \"+1234567890\",\n \"company\": \"Tech Corp\",\n \"position\": \"Developer\",\n \"status\": \"prospect\",\n \"notes\": \"Interested in our services\"\n}"
},
"url": {
"raw": "http://localhost:5000/api/contacts",
"protocol": "http",
"host": ["localhost"],
"port": "5000",
"path": ["api", "contacts"]
}
},
"response": []
}

// Response (Success - 201)
{
"success": true,
"data": {
"\_id": "507f1f77bcf86cd799439012",
"firstName": "Jane",
"lastName": "Smith",
"email": "jane@example.com",
"phone": "+1234567890",
"company": "Tech Corp",
"position": "Developer",
"status": "prospect",
"notes": "Interested in our services",
"createdAt": "2024-01-10T13:00:00.000Z",
"updatedAt": "2024-01-10T13:00:00.000Z"
}
}

// ============================================
// ERROR RESPONSES EXAMPLES
// ============================================

// 400 - Missing Required Fields
{
"success": false,
"error": "Please provide all required fields"
}

// 400 - Email Already in Use
{
"success": false,
"error": "Email is already in use"
}

// 400 - Passwords Don't Match
{
"success": false,
"error": "Passwords do not match"
}

// 401 - Invalid Credentials
{
"success": false,
"error": "Invalid email or password"
}

// 401 - No Token Provided
{
"success": false,
"error": "No token provided. Please provide authentication token"
}

// 401 - Invalid Token
{
"success": false,
"error": "Invalid or expired token"
}

// 403 - Insufficient Permissions
{
"success": false,
"error": "You do not have permission to access this resource"
}

// ============================================
// POSTMAN ENVIRONMENT SETUP
// ============================================

/\*
Environment Variables to Create:
{
"base_url": "http://localhost:5000/api",
"token": "",
"user_id": "",
"contact_id": ""
}

Setup Steps:

1. Create new environment called "CRM Dev"
2. Add variables above
3. Use {{base_url}} in request URLs
4. After login, manually set token or use test scripts

Test Script Example (for Login request):
pm.environment.set("token", pm.response.json().token);
pm.environment.set("user_id", pm.response.json().data.id);
\*/

// ============================================
// BASH/CURL COMMANDS
// ============================================

/\*

# Register

curl -X POST http://localhost:5000/api/auth/register \
 -H "Content-Type: application/json" \
 -d '{
"name": "John Doe",
"email": "john@example.com",
"password": "SecurePass123",
"passwordConfirm": "SecurePass123"
}'

# Login

curl -X POST http://localhost:5000/api/auth/login \
 -H "Content-Type: application/json" \
 -d '{
"email": "john@example.com",
"password": "SecurePass123"
}'

# Get Current User

curl -X GET http://localhost:5000/api/auth/me \
 -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Create Contact

curl -X POST http://localhost:5000/api/contacts \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer YOUR_TOKEN_HERE" \
 -d '{
"firstName": "Jane",
"lastName": "Smith",
"email": "jane@example.com",
"status": "prospect"
}'

# Get Contacts

curl -X GET http://localhost:5000/api/contacts \
 -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Update Password

curl -X PUT http://localhost:5000/api/auth/update-password \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer YOUR_TOKEN_HERE" \
 -d '{
"currentPassword": "SecurePass123",
"newPassword": "NewPass456",
"passwordConfirm": "NewPass456"
}'
\*/
