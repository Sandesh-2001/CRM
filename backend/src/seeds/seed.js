require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Contact = require("../models/Contact");
const Deal = require("../models/Deal");
const Activity = require("../models/Activity");
const Organization = require("../models/Organization");

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/crm",
    );
    console.log("✓ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Contact.deleteMany({});
    await Deal.deleteMany({});
    await Activity.deleteMany({});
    await Organization.deleteMany({});
    console.log("✓ Cleared existing data");

    // Create demo users
    const demoUsers = [
      {
        name: "Demo User",
        email: "demo@example.com",
        password: "Demo@123",
        role: "user",
        isActive: true,
      },
      {
        name: "Admin User",
        email: "admin@example.com",
        password: "Admin@123",
        role: "admin",
        isActive: true,
      },
      {
        name: "Manager User",
        email: "manager@example.com",
        password: "Manager@123",
        role: "manager",
        isActive: true,
      },
      {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "John@123",
        role: "user",
        isActive: true,
      },
      {
        name: "Sarah Smith",
        email: "sarah.smith@example.com",
        password: "Sarah@123",
        role: "user",
        isActive: true,
      },
    ];

    const users = await User.create(demoUsers);
    console.log(`✓ Created ${users.length} demo users`);

    // Create demo organizations
    const demoOrganizations = [
      {
        name: "TechCorp Solutions",
        address: "123 Silicon Valley, CA 94088",
        industry: "Technology",
      },
      {
        name: "Financial Innovations Inc",
        address: "456 Wall Street, NY 10005",
        industry: "Finance",
      },
      {
        name: "Healthcare Enterprises",
        address: "789 Medical Plaza, TX 75001",
        industry: "Healthcare",
      },
      {
        name: "RetailMax Group",
        address: "321 Commerce Ave, FL 33101",
        industry: "Retail",
      },
      {
        name: "Global Manufacturing Ltd",
        address: "654 Industrial Park, OH 45201",
        industry: "Manufacturing",
      },
    ];

    const organizations = await Organization.create(demoOrganizations);
    console.log(`✓ Created ${organizations.length} demo organizations`);

    // Create demo contacts
    const demoContacts = [
      {
        firstName: "Michael",
        lastName: "Johnson",
        email: "michael.johnson@techcorp.com",
        phone: "+1-234-567-8900",
        organizationId: organizations[0]._id.toString(),
        company: "TechCorp Solutions",
        position: "CEO",
        status: "customer",
        notes: "Key decision maker, interested in enterprise solutions",
      },
      {
        firstName: "Emily",
        lastName: "Chen",
        email: "emily.chen@techcorp.com",
        phone: "+1-234-567-8901",
        organizationId: organizations[0]._id.toString(),
        company: "TechCorp Solutions",
        position: "CTO",
        status: "customer",
        notes: "Technical lead, focuses on innovation",
      },
      {
        firstName: "David",
        lastName: "Williams",
        email: "david.williams@financial.com",
        phone: "+1-345-678-9001",
        organizationId: organizations[1]._id.toString(),
        company: "Financial Innovations Inc",
        position: "VP of Operations",
        status: "prospect",
        notes: "Evaluating solutions for Q2 budget",
      },
      {
        firstName: "Jessica",
        lastName: "Martinez",
        email: "jessica.martinez@healthcare.com",
        phone: "+1-456-789-0012",
        organizationId: organizations[2]._id.toString(),
        company: "Healthcare Enterprises",
        position: "Director of IT",
        status: "lead",
        notes: "Initial inquiry about compliance features",
      },
      {
        firstName: "Robert",
        lastName: "Taylor",
        email: "robert.taylor@retailmax.com",
        phone: "+1-567-890-1234",
        organizationId: organizations[3]._id.toString(),
        company: "RetailMax Group",
        position: "Operations Manager",
        status: "prospect",
        notes: "Interested in multi-location management",
      },
      {
        firstName: "Amanda",
        lastName: "Brown",
        email: "amanda.brown@manufacturing.com",
        phone: "+1-678-901-2345",
        organizationId: organizations[4]._id.toString(),
        company: "Global Manufacturing Ltd",
        position: "Supply Chain Lead",
        status: "lead",
        notes: "Needs inventory integration",
      },
      {
        firstName: "James",
        lastName: "Anderson",
        email: "james.anderson@techcorp.com",
        phone: "+1-789-012-3456",
        organizationId: organizations[0]._id.toString(),
        company: "TechCorp Solutions",
        position: "Product Manager",
        status: "customer",
        notes: "Product team contact for integration",
      },
      {
        firstName: "Lisa",
        lastName: "Garcia",
        email: "lisa.garcia@financial.com",
        phone: "+1-890-123-4567",
        organizationId: organizations[1]._id.toString(),
        company: "Financial Innovations Inc",
        position: "Risk Manager",
        status: "prospect",
        notes: "Compliance and security focused",
      },
    ];

    const contacts = await Contact.create(demoContacts);
    console.log(`✓ Created ${contacts.length} demo contacts`);

    // Create demo deals
    const demoDeals = [
      {
        title: "Enterprise SaaS License - Annual",
        value: 150000,
        stage: "Won",
        contactId: contacts[0]._id.toString(),
        assignedTo: users[0].name,
      },
      {
        title: "Cloud Infrastructure Migration",
        value: 250000,
        stage: "Proposal",
        contactId: contacts[1]._id.toString(),
        assignedTo: users[1].name,
      },
      {
        title: "Financial Analytics Dashboard",
        value: 85000,
        stage: "Contacted",
        contactId: contacts[2]._id.toString(),
        assignedTo: users[3].name,
      },
      {
        title: "Healthcare Compliance System",
        value: 120000,
        stage: "Lead",
        contactId: contacts[3]._id.toString(),
        assignedTo: users[4].name,
      },
      {
        title: "Retail Management Suite",
        value: 95000,
        stage: "Contacted",
        contactId: contacts[4]._id.toString(),
        assignedTo: users[0].name,
      },
      {
        title: "Manufacturing ERP Implementation",
        value: 180000,
        stage: "Proposal",
        contactId: contacts[5]._id.toString(),
        assignedTo: users[1].name,
      },
      {
        title: "API Integration Services",
        value: 45000,
        stage: "Won",
        contactId: contacts[6]._id.toString(),
        assignedTo: users[3].name,
      },
      {
        title: "Financial Data Security Audit",
        value: 35000,
        stage: "Contacted",
        contactId: contacts[7]._id.toString(),
        assignedTo: users[4].name,
      },
      {
        title: "Contract Renewal",
        value: 75000,
        stage: "Proposal",
        contactId: contacts[0]._id.toString(),
        assignedTo: users[0].name,
      },
      {
        title: "Lost Deal - Budget Constraints",
        value: 55000,
        stage: "Lost",
        contactId: contacts[2]._id.toString(),
        assignedTo: users[1].name,
      },
    ];

    const deals = await Deal.create(demoDeals);
    console.log(`✓ Created ${deals.length} demo deals`);

    // Create demo activities
    const now = new Date();
    const demoActivities = [
      {
        type: "call",
        date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        status: "completed",
        relatedTo: {
          entityType: "contact",
          entityId: contacts[0]._id.toString(),
        },
      },
      {
        type: "meeting",
        date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        status: "completed",
        relatedTo: {
          entityType: "deal",
          entityId: deals[0]._id.toString(),
        },
      },
      {
        type: "task",
        date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        status: "pending",
        relatedTo: {
          entityType: "contact",
          entityId: contacts[1]._id.toString(),
        },
      },
      {
        type: "call",
        date: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
        status: "pending",
        relatedTo: {
          entityType: "deal",
          entityId: deals[1]._id.toString(),
        },
      },
      {
        type: "meeting",
        date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        status: "completed",
        relatedTo: {
          entityType: "contact",
          entityId: contacts[2]._id.toString(),
        },
      },
      {
        type: "task",
        date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        status: "pending",
        relatedTo: {
          entityType: "deal",
          entityId: deals[2]._id.toString(),
        },
      },
      {
        type: "call",
        date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        status: "completed",
        relatedTo: {
          entityType: "contact",
          entityId: contacts[3]._id.toString(),
        },
      },
      {
        type: "meeting",
        date: new Date(now.getTime()),
        status: "completed",
        relatedTo: {
          entityType: "deal",
          entityId: deals[4]._id.toString(),
        },
      },
      {
        type: "task",
        date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        status: "pending",
        relatedTo: {
          entityType: "contact",
          entityId: contacts[4]._id.toString(),
        },
      },
      {
        type: "call",
        date: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        status: "completed",
        relatedTo: {
          entityType: "deal",
          entityId: deals[5]._id.toString(),
        },
      },
    ];

    const activities = await Activity.create(demoActivities);
    console.log(`✓ Created ${activities.length} demo activities`);

    console.log("\n✅ Database seeded successfully!");
    console.log("\n📋 Demo Login Credentials:");
    console.log("=====================================");
    console.log("Email: demo@example.com");
    console.log("Password: Demo@123");
    console.log("Role: User");
    console.log("-------------------------------------");
    console.log("Email: admin@example.com");
    console.log("Password: Admin@123");
    console.log("Role: Admin");
    console.log("-------------------------------------");
    console.log("Email: manager@example.com");
    console.log("Password: Manager@123");
    console.log("Role: Manager");
    console.log("=====================================\n");

    console.log("📊 Seeded Data Summary:");
    console.log(`   - ${users.length} Users`);
    console.log(`   - ${organizations.length} Organizations`);
    console.log(`   - ${contacts.length} Contacts`);
    console.log(`   - ${deals.length} Deals`);
    console.log(`   - ${activities.length} Activities`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    process.exit(1);
  }
};

seedDatabase();
