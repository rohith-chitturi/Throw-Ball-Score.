# Throwball Live Scoring System 🏐

A production-grade, real-time live scoring application for throwball matches, built with the MERN stack and Socket.IO.

## 🚀 Features
- **Real-time Live Scores**: Instant updates using Socket.IO.
- **Official Rules**: Best of 3 sets, 27 points per set.
- **Admin Dashboard**: Create matches, manage teams, and control live scoring.
- **Security**: JWT Authentication, Role-based Access Control, Rate Limiting, and Helmet security.
- **Premium UI**: Modern dark theme with glassmorphism and smooth animations.

## 🛠 Tech Stack
- **Frontend**: React.js, Tailwind CSS, Socket.IO Client, Framer Motion, Lucide-React.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Socket.IO, JWT, Bcrypt.

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js installed
- MongoDB installed and running (default: `mongodb://localhost:27017/throwball_live`)

### 2. Backend Setup
```bash
cd backend
npm install
# Create .env file (already created with defaults)
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Admin Account Setup
For security, credentials must be set in your `.env` file or environment variables.

1. In `backend/.env`, set:
   ```env
   ADMIN_USERNAME=your_username
   ADMIN_PASSWORD=your_secure_password
   JWT_SECRET=a_very_long_random_string
   ```
2. Run the admin creation script:
   ```bash
   cd backend
   npm run create-admin
   ```

**Important:** The password is automatically hashed using Bcrypt before being stored in the database. Never share your `.env` file.

## 🎽 Match Rules
- **Sets**: Best of 3 sets.
- **Points**: First team to reach 27 points wins the set.
- **Match Winner**: First team to win 2 sets wins the match.

## 📁 Folder Structure
- `backend/`: Express server, Mongoose models, and real-time socket logic.
- `frontend/`: React application with Tailwind CSS and Framer Motion.
- `seed.js`: Database initialization script.

## 🔒 Security
- Rate limiting on API routes.
- Helmet for secure HTTP headers.
- CORS enabled for frontend communication.
- JWT protected administrative routes.
- Input validation in backend.

---
Built with ❤️ for Throwball Enthusiasts.
