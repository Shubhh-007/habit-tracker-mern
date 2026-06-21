# 🚀 Habit Tracker Pro

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white)

A gamified, dark-themed, daily Habit Tracker built on the MERN stack. Designed with a spreadsheet-like habit matrix, detailed progress analytics, and daily mindfulness journaling. 

---

## ✨ Features

- **🔒 Secure Authentication:** JWT-based login and registration system with encrypted passwords.
- **📊 Spreadsheet-Style Tracking:** Interactive daily habit grid with dynamic week pagination.
- **🔥 Dynamic Streaks:** Backend algorithms calculate real-time current and longest streaks.
- **✏️ Habit Management (CRUD):** Create, edit, and delete habits with gamified categories.
- **📔 Daily Journal:** Log daily moods and personal notes directly tied to your daily entries.
- **🎨 Premium UI/UX:** Sleek dark-mode aesthetic utilizing glassmorphism, Lucide icons, and Tailwind CSS.
- **📱 Fully Responsive:** Mobile-first layout ensuring a seamless experience across all devices.

---

## 🛠️ Tech Stack

**Frontend:**
- React (v19)
- Vite
- Tailwind CSS
- React Router DOM
- Recharts (Data Visualization)
- Date-fns
- Lucide React

**Backend:**
- Node.js & Express.js
- MongoDB Atlas & Mongoose
- JSON Web Tokens (JWT)
- Bcrypt.js

---

## 🏗️ Architecture

This project follows a decoupled Monolithic architecture:
1. **Client (`/client`):** A Single Page Application (SPA) serving the user interface and managing local state. Communicates with the backend via RESTful Axios HTTP requests.
2. **Server (`/server`):** A Node.js API acting as the central controller. It enforces JWT authorization middleware before allowing interaction with the MongoDB cluster.
3. **Database Schema:** Utilizes highly efficient daily bucketing. Instead of storing a document per habit toggle, it stores one `DailyEntry` document per day containing an array of that day's habit statuses.

---

## 🚀 Installation & Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Connection String

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/habit-tracker.git
cd habit-tracker
```

### 2. Setup the Backend
```bash
cd server
npm install
```
Create a `.env` file in the `/server` directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/habit_tracker?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here
```
Start the backend server:
```bash
npm run dev
```

### 3. Setup the Frontend
Open a new terminal window:
```bash
cd client
npm install
```
Start the frontend server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173/`.

---

## 📸 Screenshots

*(Replace these placeholders with actual screenshots of your application)*

| Dashboard Overview | Adding a Habit |
| :---: | :---: |
| `![Dashboard](path/to/dashboard-img.png)` | `![Add Habit](path/to/add-habit-img.png)` |

---

## 🌐 Live Demo

**Deployed Application:** [https://your-vercel-deployment.vercel.app](https://your-vercel-deployment.vercel.app) *(Coming Soon)*

---

## 👨‍💻 Author

**Shubh Gupta**
- Email: [shubhgupta1707@gmail.com](mailto:shubhgupta1707@gmail.com)
- Built for Digital Heroes

---

> Built with ❤️ to crush bad habits.
