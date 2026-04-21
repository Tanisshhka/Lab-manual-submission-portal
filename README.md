# 📚 Lab Manual Submission Portal

A full-stack MERN web application for **Sage University Bhopal** that enables students to upload lab manuals and faculty to review them with AI-powered analysis.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-ISC-green?style=for-the-badge)
![Platform](https://img.shields.io/badge/Deployed%20on-Vercel%20%2B%20Render-black?style=for-the-badge)

---

## ✨ Features

- 🔐 **Role-based Authentication** — Separate dashboards for Students and Faculty
- 📤 **Lab Manual Upload** — Students upload PDFs linked to their subject & semester
- 🤖 **AI-Powered Review** — Google Gemini API automatically analyzes uploaded manuals
- 🌩️ **Cloud File Storage** — Files stored securely on Cloudinary
- 📧 **Email Notifications** — Faculty receives email alerts on new submissions
- 📊 **Real-time Dashboard** — Track submission status (Pending / Reviewed / Rejected)
- 🌙 **Dark Mode UI** — Premium glassmorphism design with animations

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| AI Analysis | Google Gemini API |
| File Storage | Cloudinary |
| Authentication | JWT |
| Email | Nodemailer |

---

## 📁 Project Structure

```
lab-manual-submission-portal/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── api/            # Axios API config
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Auth context
│   │   └── pages/          # Page components
│   └── vercel.json         # Vercel SPA routing config
└── server/                 # Express backend
    ├── config/             # DB & Cloudinary config
    ├── controllers/        # Route logic
    ├── middleware/         # Auth middleware
    ├── models/             # Mongoose schemas
    ├── routes/             # API routes
    ├── services/           # AI & Email services
    └── .env.example        # Environment variable template
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Google Gemini API key

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/lab-manual-submission-portal.git
cd lab-manual-submission-portal
```

### 2. Setup the backend
```bash
cd server
cp .env.example .env       # Fill in your values
npm install
npm run dev
```

### 3. Setup the frontend
```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`  
Backend runs on `http://localhost:5000`

---

## ⚙️ Environment Variables

Copy `server/.env.example` to `server/.env` and fill in your values:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `GEMINI_API_KEY` | Google Gemini API key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `EMAIL_USER` | Gmail address for notifications |
| `EMAIL_PASS` | Gmail App Password |

---

## 🌐 Deployment

- **Frontend** → [Vercel](https://vercel.com) — set root directory to `client`, add `VITE_API_URL` env var
- **Backend** → [Render](https://render.com) — set root directory to `server`, add all env vars

See [Deployment Guide](./DEPLOYMENT.md) for detailed step-by-step instructions.

---

## 👩‍💻 Made For

**Sage University Bhopal** — Computer Science Department  
Lab Manual Submission & Review System

---

## 📄 License

ISC License
