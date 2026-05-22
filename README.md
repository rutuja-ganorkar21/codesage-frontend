<div align="center">

# ◈ CodeSage

### AI · DSA · PRACTICE

A DSA practice platform where **Google Gemini AI** acts as your personal mentor —
giving hints, explaining logic, and helping you actually understand problems, not just solve them.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-codesage--snowy.vercel.app-6366f1?style=for-the-badge)](https://codesage-snowy.vercel.app)
[![Frontend](https://img.shields.io/badge/Frontend-Repo-61DAFB?style=for-the-badge&logo=react)](https://github.com/rutuja-ganorkar21/codesage-frontend)
[![Backend](https://img.shields.io/badge/Backend-Repo-339933?style=for-the-badge&logo=node.js)](https://github.com/rutuja-ganorkar21/codesage-backend)

</div>

---

## What makes CodeSage different?

Most platforms tell you if your code is right or wrong. CodeSage tells you **why** — and helps you get there.

- **AI that knows your problem** — Gemini AI is scoped to the exact problem you're solving. Ask for a hint, an explanation, or help debugging your code — it understands context.
- **Video solutions** — Admin-uploaded video walkthroughs so you can see the thought process, not just the answer.
- **VS Code-like editor** — Monaco Editor with syntax highlighting for JavaScript, Java, and C++.
- **Real code execution** — Judge0 runs your code against actual test cases. See your output vs expected output instantly.
- **Progress that means something** — Track Easy / Medium / Hard separately. See your accuracy, recent submissions, and how far you've come.

---

## Features

### Problem Solving Page
Each problem has 5 tabs:

| Tab | What's inside |
|-----|--------------|
| Description | Problem statement, examples, constraints |
| Editorial | Step-by-step approach to the solution |
| Solutions | Reference solutions in JavaScript, Java, and C++ |
| Submissions | Your submission history for that problem |
| ChatAI | Gemini AI — ask anything about this problem |

### Code Editor & Execution
- Monaco Editor (same engine as VS Code)
- Run code → see Input / Your Output / Expected Output
- Submit → get Accepted, Wrong Answer, or Error
- Supports JavaScript, Java, C++

### User Profile
- DSA progress ring with total problems solved
- Separate progress bars for Easy / Medium / Hard
- Recent submissions with status, language, and date
- Accuracy percentage across all submissions

### Admin Dashboard
Only accessible to admins:
- Create problems with test cases, editorial, and reference solutions
- Update or delete existing problems
- Upload video solutions per problem (stored on Cloudinary)

### Authentication
- JWT-based auth with secure httpOnly cookies
- Role-based access — User and Admin
- Profile picture upload and update via Cloudinary

---

## Tech Stack

**Frontend**
- React 19 + Vite
- Tailwind CSS v4 + DaisyUI
- Monaco Editor
- Redux Toolkit
- React Router v7
- React Hook Form + Zod
- Axios

**Backend**
- Node.js + Express v5
- MongoDB + Mongoose
- Redis
- Google Gemini AI (`@google/genai`)
- Judge0 — code execution engine
- Cloudinary — video and image storage
- JWT + bcrypt

---

## Project Structure

**Frontend**
```
src/
├── components/
│   ├── ChatAi.jsx            # Gemini AI chat
│   ├── Editorial.jsx         # Editorial tab
│   ├── ProgressPanel.jsx     # DSA progress tracking
│   ├── UserProfile.jsx       # Profile page
│   ├── ProfilePicture.jsx    # Profile picture management
│   ├── AdminPanel.jsx        # Admin dashboard
│   ├── AdminDelete.jsx       # Delete problem
│   ├── AdminUpdate.jsx       # Update problem
│   ├── AdminUpload.jsx       # Upload video
│   └── AdminVedio.jsx        # Video management
├── pages/
│   ├── Homepage.jsx          # Problems list
│   ├── ProblemPage.jsx       # Problem solving page
│   ├── Admin.jsx             # Admin route
│   ├── Login.jsx
│   └── Signup.jsx
├── store/
│   └── store.js
└── utils/
    └── axiosClient.js
```

**Backend**
```
src/
├── config/
│   ├── db.js                 # MongoDB connection
│   └── redis.js              # Redis connection
├── controllers/
│   ├── solveDoubt.js         # Gemini AI logic
│   ├── userAuthent.js        # Auth logic
│   ├── userProblem.js        # Problem CRUD
│   ├── userSubmission.js     # Code execution + profile pic
│   └── vedioSection.js       # Video upload/delete
├── middleware/
│   ├── userMiddleware.js     # Auth guard
│   └── adminMiddlware.js     # Admin guard
├── models/
│   ├── user.js
│   ├── problem.js
│   ├── submission.js
│   └── solutionVedio.js
├── routes/
│   ├── userAuth.js
│   ├── ProblemCreater.js
│   ├── submit.js
│   ├── aiChatting.js
│   └── vedioCreator.js
└── utils/
    ├── ProblemUtility.js     # Judge0 integration
    └── validator.js
```

---

## API Reference

### Auth — `/api/auth`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login and receive JWT cookie |
| POST | `/logout` | User | Logout |
| GET | `/check` | User | Verify session and get user info |
| POST | `/admin/register` | Admin | Register a new admin |
| GET | `/profile-pic-signature` | User | Cloudinary upload signature |
| POST | `/save-profile-picture` | User | Save profile picture |
| DELETE | `/delete-profile-picture` | User | Delete profile picture |

### Problems — `/api/problems`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/getAllProblem` | User | Get all problems |
| GET | `/problemById/:id` | User | Get a single problem |
| GET | `/problemSolvedByuser` | User | Get problems solved by current user |
| GET | `/submittedProblem/:pid` | User | Get submissions for a problem |
| POST | `/create` | Admin | Create a new problem |
| PUT | `/update/:id` | Admin | Update a problem |
| DELETE | `/delete/:id` | Admin | Delete a problem |

### Code Execution — `/api/submit`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/runcode/:id` | User | Run code against test cases |
| POST | `/submit/:id` | User | Submit solution |
| GET | `/getUserSubmissions` | User | Get all submissions by user |

### AI — `/api/ai`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/chat` | User | Send message to Gemini AI mentor |

### Video — `/api/video`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/create/:problemId` | Admin | Get Cloudinary upload signature |
| POST | `/save` | Admin | Save video metadata |
| DELETE | `/delete/:problemId` | Admin | Delete a video |

---

## Screenshots

### Problems List
![Problems List](./screenshots/problems-list.png)

### Problem Page — Description & Editor
![Problem Description](./screenshots/problem-description.png)

### Problem Page — Solutions & Console
![Solutions and Editor](./screenshots/solutions-editor.png)

### User Profile
![User Profile](./screenshots/user-profile.png)

### Admin Dashboard
![Admin Panel](./screenshots/admin-panel.png)

### Login & Signup
![Login](./screenshots/login.png)

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB
- Redis
- Judge0 (self-hosted or RapidAPI)
- Google Gemini API Key
- Cloudinary account

### 1. Clone

```bash
git clone https://github.com/rutuja-ganorkar21/codesage-frontend.git
git clone https://github.com/rutuja-ganorkar21/codesage-backend.git
```

### 2. Backend

```bash
cd codesage-backend
npm install
```

Create `.env`:
```env
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_url
GEMINI_API_KEY=your_gemini_key
JUDGE0_API_URL=your_judge0_url
JUDGE0_API_KEY=your_judge0_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

```bash
node src/index.js
```

### 3. Frontend

```bash
cd codesage-frontend
npm install
```

Create `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000
```

```bash
npm run dev
```

Open `http://localhost:5173`

---

## Deployment

| Layer | Platform |
|-------|----------|
| Frontend | Vercel |
| Backend | Render / Railway |
| Database | MongoDB Atlas |
| Cache | Redis Cloud |
| Media | Cloudinary |
| Code Execution | Judge0 |

Live: [https://codesage-snowy.vercel.app](https://codesage-snowy.vercel.app)

---

## Author

**Rutuja Ganorkar**
[![GitHub](https://img.shields.io/badge/GitHub-rutuja--ganorkar21-181717?style=flat&logo=github)](https://github.com/rutuja-ganorkar21)

---

<div align="center">
⭐ Star this repo if you found it helpful!
</div>
