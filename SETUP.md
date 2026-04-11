# CRM Application Setup Guide

## Quick Start (5 minutes)

### Prerequisites

- Node.js v20+ installed
- MongoDB installed locally OR MongoDB Atlas account

### Option 1: Local MongoDB

1. **Install MongoDB Community Edition**
   - Windows: https://www.mongodb.com/try/download/community
   - Mac: `brew install mongodb-community`
   - Linux: Follow MongoDB installation guide

2. **Start MongoDB**
   - Windows: MongoDB runs as a service
   - Mac/Linux: `mongod`

### Option 2: MongoDB Atlas (Cloud - No Installation Required)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/crm`
4. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crm?retryWrites=true&w=majority
   ```

### Option 3: Docker (Recommended)

1. Install Docker: https://www.docker.com/products/docker-desktop
2. Run MongoDB container:
   ```bash
   docker-compose up -d
   ```

---

## Running the Application

### Method 1: Separate Terminals (Recommended)

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

Expected output: `Server running on port 5000`

**Terminal 2 - Frontend:**

```bash
cd frontend/crm-frontend
npm start
```

Expected output: `✔ Compiled successfully.`

### Method 2: Batch File (Windows Only)

```bash
./start-all.bat
```

### Method 3: Shell Script (Mac/Linux)

```bash
chmod +x start-all.sh
./start-all.sh
```

---

## Verify Installation

### Backend Health Check

```bash
curl http://localhost:5000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Server is running"
}
```

### Frontend Access

- Open browser to: http://localhost:4200

---

## Common Issues & Solutions

### MongoDB Connection Refused

**Problem:** `Error: MongooseError: Cannot connect to mongodb://localhost:27017/crm`

**Solutions:**

1. Ensure MongoDB is running: `mongod` (in new terminal)
2. Use MongoDB Atlas: Update .env with connection string
3. Use Docker: `docker-compose up -d`

### Port Already in Use

**Problem:** `EADDRINUSE: address already in use :::5000`

**Solution:**

- Change PORT in `backend/.env`
- Restart the backend server

### Angular Port in Use

**Problem:** Port 4200 already in use

**Solution:**

```bash
mg serve --port 4300
```

### Dependency Installation Issues

```bash
# In backend/ or frontend/crm-frontend/
rm -rf node_modules package-lock.json
npm install
```

---

## Project Structure Details

### Backend Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js         # MongoDB connection
│   ├── models/
│   │   └── Contact.js          # Mongoose schema
│   ├── controllers/
│   │   └── contactController.js # Business logic
│   ├── routes/
│   │   └── contactRoutes.js    # API endpoints
│   └── middleware/
│       └── errorHandler.js     # Error handling
├── server.js                   # Express app entry point
├── .env                        # Environment variables
├── package.json               # Dependencies
└── .gitignore
```

### Frontend Folder Structure

```
frontend/crm-frontend/
├── src/
│   ├── app/
│   │   ├── app.component.*    # Root component
│   │   ├── app.config.ts      # App configuration
│   │   └── app.routes.ts      # Routing configuration
│   ├── main.ts                # Application bootstrap
│   ├── index.html             # HTML template
│   └── styles.scss            # Global styles
├── angular.json               # Angular CLI config
├── tsconfig.json             # TypeScript config
├── package.json              # Dependencies
└── .gitignore
```

---

## API Reference

### Contacts Endpoints

#### Get All Contacts

```
GET /api/contacts
```

**Response:**

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
      "createdAt": "2024-01-10T12:30:00Z",
      "updatedAt": "2024-01-10T12:30:00Z"
    }
  ]
}
```

#### Get Single Contact

```
GET /api/contacts/:id
```

#### Create Contact

```
POST /api/contacts
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "+9876543210",
  "company": "Tech Corp",
  "position": "Developer",
  "status": "prospect",
  "notes": "Follow up next week"
}
```

#### Update Contact

```
PUT /api/contacts/:id
Content-Type: application/json

{
  "status": "customer",
  "notes": "Updated contact info"
}
```

#### Delete Contact

```
DELETE /api/contacts/:id
```

---

## Next Development Steps

### 1. Authentication & Authorization

- Implement JWT token-based auth
- Create user login/signup
- Protect routes with authentication middleware

### 2. Additional Models

```javascript
// Examples:
-Users - Deals - Tasks - Activities - Companies;
```

### 3. Angular Components & Services

- Create ContactListComponent
- Create ContactFormComponent
- Create ContactDetailComponent
- Create ContactService for API calls

### 4. Frontend Features

- Implement data table for contacts
- Add create/edit/delete forms
- Add search and filter functionality
- Add pagination and sorting

### 5. Testing

```bash
# Backend tests
npm test

# Frontend tests
ng test
```

### 6. Production Build

```bash
# Frontend
ng build --configuration production

# Backend already production-ready
npm start
```

---

## Deployment Options

- **Frontend**: Netlify, Vercel, GitHub Pages, AWS S3
- **Backend**: Heroku, Railway, Render, AWS EC2, DigitalOcean
- **Database**: MongoDB Atlas (recommended)

---

## Useful Commands

### Backend

```bash
npm run dev        # Start with auto-reload
npm start          # Start for production
npm test           # Run tests
```

### Frontend

```bash
ng serve           # Start dev server
ng build           # Build for production
ng test            # Run unit tests
ng lint            # Run linter
ng generate        # Generate new components/services
```

### Docker

```bash
docker-compose up -d        # Start MongoDB
docker-compose down         # Stop MongoDB
docker-compose logs         # View logs
```

---

## Additional Resources

- [Angular Docs](https://angular.io/docs)
- [Express Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [REST API Best Practices](https://restfulapi.net/)

---

## Support

For issues or questions:

1. Check the troubleshooting section
2. Review the API documentation
3. Check MongoDB and Node.js versions
4. Review browser console and server logs

Happy coding! 🚀
