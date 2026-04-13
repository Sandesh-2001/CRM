# Database Seed Script

This document explains how to use the database seed script to populate your CRM with demo data.

## Overview

The seed script creates a complete demo database with:

- **5 Users** (with different roles)
- **5 Organizations** (various industries)
- **8 Contacts** (across different organizations)
- **10 Deals** (different stages and values)
- **10 Activities** (calls, meetings, and tasks)

## Running the Seed Script

### Prerequisites

- Backend server is NOT running (MongoDB connection will be made directly)
- MongoDB is running and accessible
- `.env` file is properly configured with `MONGODB_URI`

### Command

```bash
cd backend
npm run seed
```

## Demo Login Credentials

After running the seed script, you can log in with any of these credentials:

### Demo User (Basic Access)

- **Email:** demo@example.com
- **Password:** Demo@123
- **Role:** User

### Admin User (Full Access)

- **Email:** admin@example.com
- **Password:** Admin@123
- **Role:** Admin

### Manager User (Management Access)

- **Email:** manager@example.com
- **Password:** Manager@123
- **Role:** Manager

### Additional Users

- **Email:** john.doe@example.com | **Password:** John@123
- **Email:** sarah.smith@example.com | **Password:** Sarah@123

## Demo Data Details

### Organizations

1. TechCorp Solutions (Technology)
2. Financial Innovations Inc (Finance)
3. Healthcare Enterprises (Healthcare)
4. RetailMax Group (Retail)
5. Global Manufacturing Ltd (Manufacturing)

### Sample Contacts

- Contacts are linked to organizations
- Various positions: CEO, CTO, VP, Director, Manager
- Status: lead, prospect, customer, inactive
- Contact information included for emails and calls

### Sample Deals

- Deal values range from $35,000 to $250,000
- Stages: Lead, Contacted, Proposal, Won, Lost
- Linked to contacts and assigned to users
- Mix of active and completed deals

### Sample Activities

- Activities linked to contacts and deals
- Types: call, meeting, task
- Status: pending, completed
- Dates include past and future activities

## Clearing Data

The seed script automatically clears existing data before seeding. If you want to clear data without re-seeding:

```bash
cd backend
npx mongoose-cli -c exec "db.dropDatabase()"
```

Or modify the seed script to only run the cleanup portion.

## Customizing the Seed Data

To customize demo data, edit `src/seeds/seed.js`:

1. Modify the `demoUsers`, `demoOrganizations`, `demoContacts`, `demoDeals`, or `demoActivities` arrays
2. Ensure data matches the model schema requirements
3. Run the seed script again

## Notes

- All demo passwords follow basic patterns (Name@123 format)
- Timestamps are automatically set by Mongoose
- Relationships between entities are maintained (contacts linked to organizations, etc.)
- Activity dates are set relative to current date for realistic demo
