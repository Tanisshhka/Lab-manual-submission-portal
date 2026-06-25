# Lab Manual Submission Portal

An intelligent, AI-powered Lab Manual Submission Portal designed for Sage University students and faculty. This platform streamlines the submission process, utilizing AI (Google Gemini & OpenAI) to analyze uploaded PDF manuals, provide instant feedback, and assist faculty in grading.

![Lab Manual Portal](https://raw.githubusercontent.com/Tanisshhka/Lab-manual-submission-portal/main/client/public/vite.svg)

## 🚀 Features

### For Students
*   **Secure Authentication:** Role-based sign-up and login.
*   **Seamless Uploads:** Easily upload lab manuals (PDF format) to the system.
*   **Instant AI Feedback:** Get immediate analysis, grammar checks, and improvement suggestions powered by advanced AI models.
*   **Dashboard Tracking:** Monitor the status of all submissions (Pending, Reviewed, Approved).

### For Faculty
*   **Context-Aware Dashboard:** Automatically filters student submissions based on the faculty member's assigned department, subject, and semester.
*   **AI-Assisted Grading:** Review the AI-generated report before adding final comments and status updates.
*   **Status Management:** Easily approve, reject, or request revisions for student submissions.
*   **Statistics & Analytics:** Visual charts and metrics to track submission statuses across the classroom.

## 🛠️ Technology Stack

*   **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion (for dynamic animations)
*   **Backend:** Node.js, Express.js (Deployed as Vercel Serverless Functions)
*   **Database:** MongoDB (Mongoose ODM)
*   **AI Integration:** Google Gemini API & OpenAI API
*   **Authentication:** JSON Web Tokens (JWT) & bcrypt.js
*   **Deployment:** Vercel (Full-Stack Monorepo)

## 💻 Running Locally

### Prerequisites
*   Node.js (v18+)
*   MongoDB Atlas Account

### Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Tanisshhka/Lab-manual-submission-portal.git
    cd Lab-manual-submission-portal/client
    ```

2.  **Install Dependencies:**
    This project is set up as a Vercel native project. All dependencies (both frontend and backend) are in the `client` folder.
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the `client/backend/` directory:
    ```env
    PORT=5005
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    GEMINI_API_KEY=your_gemini_api_key
    OPENAI_API_KEY=your_openai_api_key
    ```

4.  **Start the Local Backend Server:**
    ```bash
    node backend/index.js
    ```

5.  **Start the React Frontend:**
    Open a **second** terminal inside the `client` folder:
    ```bash
    npm run dev
    ```

6.  Open `http://localhost:5173` in your browser.

## ☁️ Deployment (Vercel)

This project is optimized for a zero-config deployment on Vercel utilizing Serverless Functions.

1. Create a new project in Vercel and import this GitHub repository.
2. Ensure the **Root Directory** in Vercel is set to `client` (or left as default if it detects it).
3. Add the environment variables from your `.env` file into the Vercel Dashboard -> Project Settings -> Environment Variables.
4. Deploy! Vercel will automatically build the React app and convert the `client/api/index.js` into your backend server.

## 📄 License
This project is open-source and available under the MIT License.
