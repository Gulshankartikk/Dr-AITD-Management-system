# How to Deploy the Backend (Permanent Fix)

Currently, your frontend is on Vercel (HTTPS), but your backend is on your laptop (HTTP). This causes "Mixed Content" and "CORS" errors for anyone else trying to use your app.

To fix this properly, you need to deploy your backend.

## Option 1: Deploy to Render (Free & Easy)

1.  **Create an Account:** Go to [render.com](https://render.com/) and sign up.
2.  **New Web Service:** Click "New +" -> "Web Service".
3.  **Connect GitHub:** Connect your GitHub account and select your repository (`Dr-AITD-Management-system`).
4.  **Configure Settings:**
    *   **Root Directory:** `backend` (Important!)
    *   **Build Command:** `npm install`
    *   **Start Command:** `node index.js`
    *   **Environment Variables:** Add these (copy from your `.env` or `.sample.env`):
        *   `MONGO_URI`: Your MongoDB Connection String.
        *   `JWT_SECRET`: A secret random key (e.g., `mysupersecretkey123`).
        *   `PORT`: `4000` (or leave blank, Render usually assigns one).
5.  **Deploy:** Click "Create Web Service".

## Option 2: Connect Frontend to Backend

Once Render finishes deploying, it will give you a URL (e.g., `https://dr-aitd-backend.onrender.com`).

1.  Go to your **Vercel Dashboard**.
2.  Select your Project -> **Settings** -> **Environment Variables**.
3.  Add a new variable:
    *   **Key:** `VITE_API_URL`
    *   **Value:** `https://dr-aitd-backend.onrender.com` (Your new Render URL, no trailing slash).
4.  Go to **Deployments** and **Redeploy** the latest commit.

Now your App is fully live!
