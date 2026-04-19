# Vercel Deployment Setup

## Adding Environment Variables to Vercel

### Step 1: Go to Vercel Dashboard
1. Visit https://vercel.com/dashboard
2. Click on your project: `next-js-text`

### Step 2: Add Environment Variables
1. Click on **Settings** in the project menu
2. Navigate to **Environment Variables**
3. Click **Add New**

### Step 3: Add MONGODB_URI
- **Name**: `MONGODB_URI`
- **Value**: `mongodb+srv://Test:Test@t.7bexn6b.mongodb.net/?appName=T&retryWrites=true&w=majority`
- **Environments**: Select `Production`, `Preview`, and `Development` (or all)
- Click **Save**

### Step 4: Redeploy
1. Go back to **Deployments**
2. Click the **three dots (...)** on the latest deployment
3. Click **Redeploy**
4. Confirm the redeploy

Or simply push a new commit to trigger auto-deployment:
```bash
git commit --allow-empty -m "Trigger deployment with MongoDB env vars"
git push origin main
```

## Testing the Connection

Once deployed, test the contact form:
1. Visit your Vercel deployment URL
2. Fill out the contact form
3. Submit - data should save to MongoDB
4. Check your MongoDB Atlas dashboard to verify the document was created

## Troubleshooting

If you get "MongoDB connection error":
1. Verify the connection string in Vercel environment variables
2. Check MongoDB Atlas IP whitelist - allow `0.0.0.0/0` for Vercel (or add Vercel's IP range)
3. Check that your MongoDB user has read/write permissions

## Local Development

Your local `.env.local` file contains the MongoDB credentials and is already git-ignored (won't be committed).

To run locally:
```bash
npm run dev
```

Visit `http://localhost:3000` and submit test forms.
