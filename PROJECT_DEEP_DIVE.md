# 🏆 Throwball Live Scoring System - Technical Deep Dive

This document provides a comprehensive, 360-degree overview of the Throwball Live Scoring project. It covers everything from the folder structure to advanced security implementations.

---

## 🏗️ 1. Technology Stack (The "Engine")

This project is built using the **MERN Stack** + **Real-time WebSockets**.

- **Frontend**: React.js (Vite)
  - **Styling**: Vanilla CSS + Framer Motion (Animations)
  - **Icons**: Lucide-React
  - **State Management**: React Context API (for Auth)
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose (ODM)
- **Real-time**: Socket.IO (for instant score updates)
- **Security**: JWT (JSON Web Tokens), Bcrypt.js, Helmet, CORS, Rate Limiting.

---

## 📂 2. Folder Structure & File Use

### 📁 Root Directory
- `/backend`: The logic, database, and API server.
- `/frontend`: The user interface and visual application.
- `README.md`: Basic setup instructions.

---

### 📁 /backend (The Brain)
- `server.js`: **The Entry Point.** Initializes the Express app, connects to MongoDB, starts Socket.IO, and loads all routes.
- `.env`: **Secrets File.** Stores sensitive data like Database URLs and Passwords (never shared).
- `seed.js`: A script to populate the database with dummy data for testing.
- **📁 /models**: Defines the "Shape" of data in the database.
  - `User.js`: Schema for users (Username, Password Hashing, Roles).
  - `Match.js`: Schema for games (Sets, Teams, Scores, Outcomes).
  - `Team.js`: Schema for college teams (Name, Players, Stats).
- **📁 /routes**: Defines the "Endpoints" (URLs) the frontend can talk to.
  - `authRoutes.js`: Login, Signup, Profile updates.
  - `matchRoutes.js`: Creating matches, fetching scores, updating points.
- **📁 /middleware**: Security guards.
  - `auth.js`: Checks if a user is logged in and if they are an "Admin".
- **📁 /sockets**: Real-time logic.
  - `socketMain.js`: Manages users joining "Rooms" (e.g., a room for a specific match).
- **📁 /scripts**: Utility tools.
  - `create-admin.js`: Manages initial admin creation.
  - `reset-admin.js`: Emergency password/username reset tool.

---

### 📁 /frontend (The Face)
- `index.html`: The core page where React is injected.
- **📁 /src**:
  - `main.jsx`: Connects React to the HTML.
  - `App.jsx`: **The Router.** Manages all pages and URL paths (e.g., `/`, `/login`, `/admin`).
  - **📁 /api**: 
    - `axios.js`: Configuration for all HTTP requests to the backend.
  - **📁 /context**:
    - `AuthContext.jsx`: Global store for "Who is logged in?".
  - **📁 /pages**:
    - `Home.jsx`: Public view showing all live/upcoming matches.
    - `MatchDetail.jsx`: The premium live scoreboard fans see.
    - `ScoringPanel.jsx`: **The Remote Control.** Where Admins click +1/ -1 point.
    - `AdminDashboard.jsx`: Where Admins create new matches/teams.
  - **📁 /components**:
    - `Navbar.jsx`: The top navigation bar.

---

## 🛡️ 3. Security Implementation (The "Armor")

This project implements professional-grade security:

1.  **Password Hashing**: We never save plain-text passwords. `Bcrypt.js` hashes them (e.g., `123456` becomes `k9#sj2!L...`).
2.  **JWT Authentication**: After login, the server gives the user a "Token". The browser sends this token with every request to prove who they are safely.
3.  **Role-Based Access Control (RBAC)**:
    - `user`: Can only watch scores.
    - `admin`: Can modify scores and delete data.
    - If a `user` tries to access `/admin`, the server blocks them with a `403 Forbidden` error.
4.  **CORS (Cross-Origin Resource Sharing)**: Prevents unauthorized websites from making requests to your backend. Only your specific Render URL is allowed.
5.  **Helmet**: Adds special security headers to the browser to prevent common attacks like "Clickjacking".
6.  **Rate Limiting**: Stops hackers from trying 1000 passwords in 1 second. It blocks IPs that make too many requests.
7.  **Trust Proxy**: Configured specifically for Render to ensure IP tracking works through cloud proxies.

---

## 🔄 4. The System Flow (How it works)

1.  **The Action**: An Admin clicks "+1 Point" on the **Scoring Panel**.
2.  **The Request**: Axios sends a `POST` request to `/api/matches/:id/score` with the admin token.
3.  **The Backend**:
    - Middleware checks if the token is valid and the user is an `admin`.
    - The `matchRoutes.js` updates the MongoDB database.
    - **Socket.IO** "Broadcasts" the update: *"Attention everyone watching Match ID 123, the score is now 15-10!"*
4.  **The Result**: All fan screens (Home & MatchDetail) update **instantly** without refreshing.

---

## 🚀 5. Commands Reference

### Local Development
- `npm run dev` (in `/backend`): Starts the server with auto-restart.
- `npm run dev` (in `/frontend`): Starts the React interface.
- `npm run seed`: Clears and resets the local database.

### Production/Reset (Critical)
- `npm run create-admin`: Manages the initial admin account.
- `npm run reset-admin`: Forces a specific username/password into the admin role (for forgotten creds).
- `npm run check-users`: Displays all registered users and their roles in a table.

---

## 🌍 6. Deployment Strategy

- **Backend**: Hosted on **Render (Web Service)**.
- **Frontend**: Hosted on **Render (Static Site)**.
- **Database**: Hosted on **MongoDB Atlas (Global Cloud)**.
- **Static Assets**: Favicon and images are hosted on CDNs (Cloudinary/Twemoji) for speed.

---

## ⚠️ IMPORTANT NOTE
**DO NOT PUSH THIS FILE TO GITHUB.** 
This file contains specific architectural details that should remain internal. Add `PROJECT_DEEP_DIVE.md` to your `.gitignore` file.
