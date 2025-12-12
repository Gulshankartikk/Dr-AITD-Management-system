# 🚀 Full Stack Deployment on Render

This project is configured to deploy both the **Backend** and **Frontend** on Render using a "Blueprint".

## Step 1: Push Code to GitHub
Ensure all your specific files (`render.yaml`, `package.json`, etc.) are pushed to your GitHub repository.

## Step 2: Deploy on Render
1.  Go to [dashboard.render.com](https://dashboard.render.com/).
2.  Click **New +** -> **Blueprint**.
3.  Connect your GitHub repository.
4.  Render will read the `render.yaml` file and detect two services:
    *   **dr-aitd-backend** (Web Service)
    *   **dr-aitd-frontend** (Static Site)
5.  Click **Apply**.

## Step 3: Configure Environment Variables
Render will ask you for values for the variables defined in `render.yaml`.
**You MUST provide existing values for:**
*   `MONGO_URL`: Your MongoDB Connection String.
*   `JWT_SECRET`: A secure random string.

*Note: `PORT` is handled automatically by Render. `VITE_API_URL` for the frontend is automatically linked to the backend service!*

---

## Manual Setup Configuration (If not using Blueprint)

If you prefer to set up services carefully by hand:

### **1. Backend (Web Service)**
*   **Root Directory:** `backend`
*   **Build Command:** `npm install`
*   **Start Command:** `node index.js`
*   **Environment Variables:**
    *   `MONGO_URL`
    *   `JWT_SECRET`

### **2. Frontend (Static Site)**
*   **Root Directory:** `frontend`
*   **Build Command:** `npm run build`
*   **Publish Directory:** `dist`
*   **Environment Variables:**
    *   `VITE_API_URL`: The URL of your deployed backend (e.g., `https://dr-aitd-backend.onrender.com`).
