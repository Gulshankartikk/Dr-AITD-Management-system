# 🛑 CRITICAL STEP MISSING: CONNECT BACKEND

Your Netlify app is failing because it doesn't know where your Backend is.
It is trying to connect to `http://localhost:4000`, which **DOES NOT EXIST** on the internet (it only exists on your laptop).

## YOU MUST DO THIS TO FIX LOGIN:

### Step 1: Deploy Backend to Render (Free)
1.  Go to [render.com](https://render.com/).
2.  Create a **New Web Service**.
3.  Connect your GitHub Repo.
4.  **Root Directory:** `backend`
5.  **Build Command:** `npm install`
6.  **Start Command:** `node index.js`
7.  **Deploy**.
8.  **Copy the URL** Render gives you (e.g., `https://my-api.onrender.com`).

### Step 2: Tell Netlify about the Backend
1.  Go to [netlify.com](https://www.netlify.com/).
2.  Select your Site.
3.  Go to **Site Configuration** -> **Environment Variables**.
4.  Click **"Add variable"**.
    *   **Key:** `VITE_API_URL`
    *   **Value:** (PASTE YOUR RENDER URL HERE - e.g., `https://my-api.onrender.com`)
5.  **Save**.

### Step 3: Redeploy Netlify
1.  Go to the **Deploys** tab.
2.  Click **"Trigger deploy"** -> **"Deploy site"**.

**Once Step 3 finishes, Login will work.**
