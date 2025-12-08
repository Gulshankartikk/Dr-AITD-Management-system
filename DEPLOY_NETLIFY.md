# 🚀 Deploying to Netlify (Frontend) & Render (Backend)

Netlify is excellent for hosting your Frontend (React). However, Netlify is **not** designed for long-running Backend servers (Express/Node.js). Therefore, we will split the deployment:

1.  **Frontend** -> go to **Netlify**
2.  **Backend** -> go to **Render** (Free)

---

## Part 1: Deploy Backend (Render) - Do this First!
Your backend needs to be live so the frontend can talk to it.

1.  Push your latest code to GitHub.
2.  Go to [render.com](https://render.com/) and create a "Web Service".
3.  Connect your GitHub repo.
4.  **Settings:**
    *   **Root Directory:** `backend`
    *   **Build Command:** `npm install`
    *   **Start Command:** `node index.js`
    *   **Environment Variables:**
        *   `MONGO_URI`: (Your MongoDB connection string)
        *   `JWT_SECRET`: (Any random password)
5.  **Deploy**. Wait for it to finish.
6.  **Copy the URL** (e.g., `https://my-college-api.onrender.com`).

---

## Part 2: Deploy Frontend (Netlify)

1.  Go to [netlify.com](https://www.netlify.com/) and log in.
2.  Click **"Add new site"** -> **"Import from Git"**.
3.  Choose **GitHub** and select your `Dr-AITD-Management-system` repo.
4.  **Build Settings** ( Netlify should detect them from the `netlify.toml` file I created):
    *   **Base directory:** `frontend/`
    *   **Build command:** `npm run build`
    *   **Publish directory:** `frontend/dist` (or just `dist` if Base directory is set)
5.  **Environment Variables:**
    *   Click "Add Environment Variable".
    *   Key: `VITE_API_URL`
    *   Value: (Paste your **Render Backend URL** from Part 1).
6.  **Deploy Site**.

---

## Part 3: Verify
Once Netlify finishes:
1.  Open your new Netlify URL (e.g., `https://cool-site.netlify.app`).
2.  Try to Login.
3.  If it works, you are done! 
4.  If you get a Network Error, double-check that you added the `VITE_API_URL` in Netlify settings and triggered a **new deploy** to apply it.
