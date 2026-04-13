# Seeding Data on Deployed App (Render)

After deploying your CRM application to Render, you can seed the database with demo data using one of these methods.

## Prerequisites

- Application deployed on Render
- MongoDB database connected to your deployed app
- Environment variables set on Render (including `SEED_KEY`)

---

## Method 1: Use Render Console (Easiest)

### Steps:

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Select your **Backend Service**

2. **Open Shell**
   - Click the **"Shell"** tab at the top
   - You'll get terminal access to your deployed service

3. **Run Seed Command**

   ```bash
   npm run seed
   ```

4. **Wait for Completion**
   - The script will clear existing data and populate demo data
   - You'll see the demo credentials printed

### Pros:

- Quick and simple
- Direct database access
- See full output

---

## Method 2: Call Seed Endpoint via API (Recommended)

You can trigger the seed endpoint from anywhere using a simple HTTP request. This is safer and doesn't require console access.

### Setup:

1. **Set Environment Variable on Render**
   - Go to your service settings
   - Add this in **Environment**:
     ```
     SEED_KEY=your_strong_seed_key_12345_change_this_to_something_safe
     ```

2. **Make API Request**

   Use any of these methods:

   **Using cURL:**

   ```bash
   curl -X POST "https://your-app.onrender.com/api/admin/seed-database" \
     -H "x-seed-key: your_strong_seed_key_12345_change_this_to_something_safe"
   ```

   **Using Postman:**
   - Method: `POST`
   - URL: `https://your-app.onrender.com/api/admin/seed-database`
   - Headers: `x-seed-key: your_strong_seed_key_12345_change_this_to_something_safe`

   **Using JavaScript/Node.js:**

   ```javascript
   fetch("https://your-app.onrender.com/api/admin/seed-database", {
     method: "POST",
     headers: {
       "x-seed-key": "your_strong_seed_key_12345_change_this_to_something_safe",
     },
   })
     .then((res) => res.json())
     .then((data) => console.log(data));
   ```

3. **Check Response**
   - Success: `{ "success": true, "message": "Database seeded successfully!", ... }`
   - Error: `{ "success": false, "error": "Unauthorized: Invalid seed key" }`

### Pros:

- Can call from browser developer console
- No need for terminal/console access
- Can share with team members (with proper key)

---

## Method 3: GitHub Actions Deployment Hook (Advanced)

You can automatically seed data after deployment:

**Add to your deployment workflow (`.github/workflows/deploy.yml`):**

```yaml
- name: Seed Database
  run: |
    curl -X POST "${{ secrets.RENDER_API_URL }}/api/admin/seed-database" \
      -H "x-seed-key: ${{ secrets.SEED_KEY }}"
  if: github.event_name == 'push' && github.ref == 'refs/heads/main'
```

---

## After Seeding: Login with Demo Credentials

Once seeded, you can log in with:

```
Email: demo@example.com
Password: Demo@123
```

Other available credentials:

- admin@example.com / Admin@123
- manager@example.com / Manager@123
- john.doe@example.com / John@123
- sarah.smith@example.com / Sarah@123

---

## What Gets Seeded

After running the seed, your database will contain:

- **5 Users** (various roles)
- **5 Organizations** (TechCorp, Financial, Healthcare, Retail, Manufacturing)
- **8 Contacts** (linked to organizations)
- **10 Deals** (various stages and values: $35K - $250K)
- **10 Activities** (calls, meetings, tasks)

---

## Important Notes

⚠️ **WARNING:** The seed script **clears all existing data** before seeding. Only run if you want to reset your database.

### Security Tips:

1. **Change SEED_KEY in Production**
   - Don't use the default key
   - Use a long, random string
   - Store in Render environment variables, NOT in code

2. **Restrict Access**
   - Only expose the endpoint to trusted users
   - Consider adding IP whitelisting if needed

3. **One-Time Seeding**
   - After seeding, consider disabling the endpoint or rotating the key
   - You can comment out the seed route in `server.js` after first use

---

## Troubleshooting

### "Unauthorized: Invalid seed key"

- Check that the `SEED_KEY` environment variable is set on Render
- Make sure the header key exactly matches: `x-seed-key`
- Verify the value matches what's in Render environment

### "Connection refused" or "Cannot connect to database"

- Verify MongoDB URI is correct in Render environment variables
- Check MongoDB cluster is accessible from Render IP
- Ensure network access is allowed in MongoDB Atlas

### "No seed script found"

- Verify you've pushed the latest code with `src/routes/seedRoutes.js`
- Redeploy the service after changes

---

## Removing the Seed Endpoint (Optional)

For production, you may want to remove the seed endpoint:

1. Comment out in `server.js`:

   ```javascript
   // app.use("/api/admin", seedRoutes);
   ```

2. Remove the import:

   ```javascript
   // const seedRoutes = require("./src/routes/seedRoutes");
   ```

3. Redeploy

Alternatively, keep it but use a very strong, secret `SEED_KEY`.
