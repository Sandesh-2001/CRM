# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Endpoints

### 1. Contacts Management

#### 1.1 Get All Contacts

- **URL**: `/contacts`
- **Method**: `GET`
- **Description**: Retrieve all contacts from the database

**Response (200 - Success):**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60f7b3b3c1234567890abcd1",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "company": "Acme Corp",
      "position": "Sales Manager",
      "status": "customer",
      "notes": "VIP client",
      "createdAt": "2024-03-15T10:30:00.000Z",
      "updatedAt": "2024-03-15T10:30:00.000Z"
    },
    {
      "_id": "60f7b3b3c1234567890abcd2",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@example.com",
      "phone": "+0987654321",
      "company": "Tech Corp",
      "position": "Developer",
      "status": "prospect",
      "notes": "Follow up next week",
      "createdAt": "2024-03-14T14:20:00.000Z",
      "updatedAt": "2024-03-15T09:00:00.000Z"
    }
  ]
}
```

---

#### 1.2 Get Single Contact

- **URL**: `/contacts/:id`
- **Method**: `GET`
- **Description**: Retrieve a specific contact by ID

**URL Parameters:**

- `id` (required): Contact ID (MongoDB ObjectId)

**Response (200 - Success):**

```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3c1234567890abcd1",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Acme Corp",
    "position": "Sales Manager",
    "status": "customer",
    "notes": "VIP client",
    "createdAt": "2024-03-15T10:30:00.000Z",
    "updatedAt": "2024-03-15T10:30:00.000Z"
  }
}
```

**Response (404 - Not Found):**

```json
{
  "success": false,
  "error": "Contact not found"
}
```

---

#### 1.3 Create Contact

- **URL**: `/contacts`
- **Method**: `POST`
- **Description**: Create a new contact

**Request Body:**

```json
{
  "firstName": "Robert",
  "lastName": "Johnson",
  "email": "robert@example.com",
  "phone": "+1555555555",
  "company": "Innovation Labs",
  "position": "Product Manager",
  "status": "lead",
  "notes": "Interested in our services"
}
```

**Required Fields:**

- `firstName` (string): Contact's first name
- `lastName` (string): Contact's last name
- `email` (string): Contact's email (must be valid email format)

**Optional Fields:**

- `phone` (string): Contact's phone number
- `company` (string): Company name
- `position` (string): Job position
- `status` (string): One of: `lead`, `prospect`, `customer`, `inactive` (default: `lead`)
- `notes` (string): Additional notes

**Response (201 - Created):**

```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3c1234567890abcd3",
    "firstName": "Robert",
    "lastName": "Johnson",
    "email": "robert@example.com",
    "phone": "+1555555555",
    "company": "Innovation Labs",
    "position": "Product Manager",
    "status": "lead",
    "notes": "Interested in our services",
    "createdAt": "2024-03-15T11:45:00.000Z",
    "updatedAt": "2024-03-15T11:45:00.000Z"
  }
}
```

**Response (400 - Bad Request):**

```json
{
  "success": false,
  "error": "Please provide a valid email"
}
```

---

#### 1.4 Update Contact

- **URL**: `/contacts/:id`
- **Method**: `PUT`
- **Description**: Update an existing contact

**URL Parameters:**

- `id` (required): Contact ID (MongoDB ObjectId)

**Request Body (all fields optional):**

```json
{
  "firstName": "Robert",
  "lastName": "Johnson",
  "email": "robert.johnson@example.com",
  "phone": "+1555555555",
  "company": "Innovation Labs",
  "position": "Senior Product Manager",
  "status": "customer",
  "notes": "Converted to customer"
}
```

**Response (200 - Success):**

```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3c1234567890abcd3",
    "firstName": "Robert",
    "lastName": "Johnson",
    "email": "robert.johnson@example.com",
    "phone": "+1555555555",
    "company": "Innovation Labs",
    "position": "Senior Product Manager",
    "status": "customer",
    "notes": "Converted to customer",
    "createdAt": "2024-03-15T11:45:00.000Z",
    "updatedAt": "2024-03-15T12:00:00.000Z"
  }
}
```

**Response (404 - Not Found):**

```json
{
  "success": false,
  "error": "Contact not found"
}
```

---

#### 1.5 Delete Contact

- **URL**: `/contacts/:id`
- **Method**: `DELETE`
- **Description**: Delete a contact

**URL Parameters:**

- `id` (required): Contact ID (MongoDB ObjectId)

**Response (200 - Success):**

```json
{
  "success": true,
  "data": {}
}
```

**Response (404 - Not Found):**

```json
{
  "success": false,
  "error": "Contact not found"
}
```

---

### 2. Health Check

#### 2.1 Server Health Check

- **URL**: `/health`
- **Method**: `GET`
- **Description**: Check if the API server is running

**Response (200 - Success):**

```json
{
  "success": true,
  "message": "Server is running"
}
```

---

## Data Types

### Contact Object

```typescript
interface Contact {
  _id?: string; // MongoDB ID (auto-generated)
  firstName: string; // First name (required)
  lastName: string; // Last name (required)
  email: string; // Email address (required, validated)
  phone?: string; // Phone number (optional)
  company?: string; // Company name (optional)
  position?: string; // Job position (optional)
  status?: "lead" | "prospect" | "customer" | "inactive"; // Status (default: 'lead')
  notes?: string; // Additional notes (optional)
  createdAt?: Date; // Creation timestamp (auto-generated)
  updatedAt?: Date; // Last update timestamp (auto-generated)
}
```

### API Response Wrapper

```typescript
interface ApiResponse<T> {
  success: boolean; // Operation success status
  count?: number; // Total count (for list operations)
  data?: T; // Response data
  error?: string; // Error message (if failed)
  message?: string; // Additional message
}
```

---

## Status Codes

| Code | Message               | Description                         |
| ---- | --------------------- | ----------------------------------- |
| 200  | OK                    | Request successful                  |
| 201  | Created               | Resource created successfully       |
| 400  | Bad Request           | Invalid request or validation error |
| 404  | Not Found             | Resource not found                  |
| 500  | Internal Server Error | Server error                        |

---

## cURL Examples

### Get All Contacts

```bash
curl -X GET http://localhost:5000/api/contacts
```

### Get Single Contact

```bash
curl -X GET http://localhost:5000/api/contacts/60f7b3b3c1234567890abcd1
```

### Create Contact

```bash
curl -X POST http://localhost:5000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Acme Corp",
    "position": "Sales Manager",
    "status": "lead"
  }'
```

### Update Contact

```bash
curl -X PUT http://localhost:5000/api/contacts/60f7b3b3c1234567890abcd1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "customer",
    "notes": "Converted to customer"
  }'
```

### Delete Contact

```bash
curl -X DELETE http://localhost:5000/api/contacts/60f7b3b3c1234567890abcd1
```

---

## Error Handling

### Common Error Responses

**Validation Error:**

```json
{
  "success": false,
  "error": "Please provide a valid email"
}
```

**Missing Required Field:**

```json
{
  "success": false,
  "error": "Please provide a first name"
}
```

**Resource Not Found:**

```json
{
  "success": false,
  "error": "Contact not found"
}
```

**Server Error:**

```json
{
  "success": false,
  "error": "Internal Server Error"
}
```

---

## CORS Configuration

The API is configured with CORS enabled. By default, it accepts requests from:

- `http://localhost:4200` (Angular development server)

To modify CORS settings, update the `CORS_ORIGIN` in the `.env` file.

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production, consider implementing:

- Express rate limit middleware
- Request throttling
- API key authentication

---

## Testing the API

### Using Postman

1. Download and install [Postman](https://www.postman.com/downloads/)
2. Create requests for each endpoint
3. Save requests in a collection
4. Use the provided cURL examples as reference

### Using Thunder Client (VS Code)

1. Install Thunder Client extension in VS Code
2. Create requests for each endpoint
3. Test live against your running API

### Using REST Client (VS Code)

1. Install REST Client extension
2. Create a `.http` or `.rest` file
3. Use the cURL examples converted to REST Client format

---

## Performance Considerations

- Contacts are retrieved from MongoDB without pagination in the current implementation
- Consider adding pagination, filtering, and sorting for large datasets
- Add indexes on frequently queried fields (email)
- Implement caching for read-heavy operations

---

## Security Notes

- Input validation is implemented for required fields
- Email format validation ensures valid email addresses
- For production, add:
  - Authentication/Authorization (JWT)
  - Rate limiting
  - Input sanitization
  - SQL/NoSQL injection prevention
  - HTTPS
  - CSRF protection

---

## Versioning

Current API Version: v1

- Base URL: `/api` (implicitly v1)
- Future versions could use `/api/v2`, `/api/v3`, etc.
