# Dr AITD Management System

A comprehensive, modern ERP solution for Dr AITD. Streamline administration, empower teachers, and engage students with a unified platform.

## Features

### 🎓 Student Portal
- **Dashboard**: View attendance, notices, and upcoming events.
- **Academics**: Access notes, study materials, and assignments.
- **Administrative**: Pay fees, apply for leave, and view timetable.
- **Profile**: Manage personal information and change password.
- **Security**: Role-based access control ensures data privacy.

### 👨‍🏫 Teacher Portal
- **Class Management**: Mark attendance, upload marks, and manage subjects.
- **Learning Resources**: Upload and manage notes, videos, syllabus, and assignments (supports large files up to 100MB).
- **Communication**: Post notices and view student details.
- **Analytics**: View attendance and performance reports.

### 🛡️ Admin Portal
- **User Management**: Manage students, teachers, and admins.
- **Course Management**: Create and manage courses and subjects.
- **Reports**: Generate comprehensive attendance, fee, and academic reports.
- **Settings**: Configure system-wide settings.
- **System Health**: Monitor system status and logs.

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Redux Toolkit, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens) with HTTP-only cookies
- **File Storage**: Local storage with Multer (supports large uploads)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (Local or Atlas)

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd "Dr AITD Management system"
    ```

2.  **Install Dependencies**
    ```bash
    # Install backend dependencies
    cd backend
    npm install

    # Install frontend dependencies
    cd ../frontend
    npm install
    ```

3.  **Configuration**
    - Create a `.env` file in the `backend` directory based on `.sample.env`:
      ```env
      PORT=4000
      MONGO_URI=mongodb://127.0.0.1:27017/college-erp
      JWT_SECRET=your_super_secret_key_change_this
      EMAIL_USER=your_email@gmail.com
      EMAIL_PASS=your_app_specific_password
      NODE_ENV=development
      ```

4.  **Database Seeding**
    - Seed the database with initial admin and teacher accounts:
      ```bash
      cd backend
      node seed_auth_users.js
      ```
    - *Default Credentials:*
      - Admin: `admin` / `admin123`
      - Teacher: `teacher` / `teacher123`

### Running the Application

1.  **Start the Backend**
    ```bash
    cd backend
    npm start
    ```
    *Server runs on http://localhost:4000*

2.  **Start the Frontend**
    ```bash
    cd frontend
    npm run dev
    ```
    *Client runs on http://localhost:5173*

3.  **Access the Application**
    Open your browser and navigate to `http://localhost:5173`

## Project Structure

- `backend/`: Node.js/Express API
  - `controller/`: Request handlers
  - `models/`: Mongoose schemas
  - `routes/`: API route definitions
  - `middleware/`: Auth and error handling
- `frontend/`: React.js Client
  - `src/components/`: Reusable UI components
  - `src/Pages/`: Application pages
  - `src/services/`: API integration services
  - `src/features/`: Redux slices

## License

This project is licensed under the MIT License.