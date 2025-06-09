# 🚀 Quick Setup Guide - Cloudflare D1 Database

Since the OAuth login timed out, here's how to quickly complete the setup manually:

## **Step 1: Manual Cloudflare Authentication**

### Option A: API Token (Recommended)
1. Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click **"Create Token"**
3. Use **"Custom token"** template
4. Configure:
   - **Token name**: `Training Plans App`
   - **Permissions**:
     - `Account` → `Cloudflare Workers:Edit`
     - `Account` → `D1:Edit` 
     - `Account` → `Pages:Edit`
   - **Account Resources**: `Include` → `All accounts`
5. Click **"Continue to summary"** → **"Create token"**
6. Copy the token and set it:
   ```powershell
   $env:CLOUDFLARE_API_TOKEN="your_token_here"
   ```

### Option B: Global API Key
1. Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Find **"Global API Key"** → Click **"View"**
3. Copy your API key and email
4. Set environment variables:
   ```powershell
   $env:CLOUDFLARE_EMAIL="your-email@example.com"
   $env:CLOUDFLARE_API_KEY="your_global_api_key_here"
   ```

## **Step 2: Verify Authentication**

```bash
npx wrangler whoami
```

You should see your Cloudflare account email.

## **Step 3: Run Automated Setup**

Now run the automated setup script:

```bash
npm run setup:d1
```

This will automatically:
- ✅ Create the D1 database
- ✅ Update `wrangler.toml` with the database ID
- ✅ Run database migrations
- ✅ Seed initial data

## **Step 4: Test Local Development**

```bash
npm run dev
```

Your app should now run at `http://localhost:5173` with a fully working D1 database!

## **Step 5: Deploy to Cloudflare Pages**

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

2. **Create Cloudflare Pages Project**:
   - Go to [Cloudflare Pages](https://dash.cloudflare.com/pages)
   - Click **"Create a project"**
   - Connect your GitHub repository
   - Configure:
     - **Framework preset**: `SvelteKit`
     - **Build command**: `npm run build`
     - **Build output directory**: `.svelte-kit/cloudflare`

3. **Add D1 Binding**:
   - In Pages project settings → **"Functions"** tab
   - **"D1 database bindings"** section
   - Add binding:
     - **Variable name**: `DB`
     - **D1 database**: `training_plans_db`

4. **Deploy**: Cloudflare will automatically build and deploy your app!

## **Troubleshooting**

### If authentication fails:
```bash
npx wrangler logout
npx wrangler login
```

### If database already exists:
```bash
npx wrangler d1 list
# Find your database ID and update wrangler.toml manually
```

### If migrations fail:
```bash
npm run migrate:remote
```

---

**🎉 Your app is now production-ready and deployed on Cloudflare Pages with D1 database!**
