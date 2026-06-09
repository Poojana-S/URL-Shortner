# 🔗 Shrink — MERN URL Shortener

A full-stack URL shortener with authentication, analytics, custom aliases, and a sleek dark UI.

---

## 📁 Project Structure

```
url-shortener/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js     # Register, login, getMe
│   │   ├── url.controller.js      # CRUD + analytics
│   │   └── redirect.controller.js # Short URL redirect
│   ├── middleware/
│   │   ├── auth.middleware.js     # JWT protect middleware
│   │   ├── error.middleware.js    # Global error handler
│   │   └── validation.middleware.js # express-validator rules
│   ├── models/
│   │   ├── User.model.js          # User schema
│   │   └── Url.model.js           # URL schema
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── url.routes.js
│   │   └── redirect.routes.js
│   ├── utils/
│   │   ├── jwt.utils.js           # Token helpers
│   │   └── url.utils.js           # URL validation, nanoid
│   ├── .env.example
│   ├── package.json
│   └── server.js                  # Entry point
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── axios.js            # Axios instance with interceptors
    │   │   ├── auth.api.js
    │   │   └── url.api.js
    │   ├── components/
    │   │   ├── layout/
    │   │   │   └── Navbar.jsx
    │   │   ├── ui/
    │   │   │   ├── LoadingSpinner.jsx
    │   │   │   ├── StatCard.jsx
    │   │   │   ├── UrlCard.jsx
    │   │   │   └── EditUrlModal.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── CreateUrl.jsx
    │   │   ├── Analytics.jsx
    │   │   └── NotFound.jsx
    │   ├── utils/
    │   │   └── helpers.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── .env.example
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v18+
- npm or yarn
- MongoDB Atlas account (free tier works)

---

### 1. Clone / Download the project

```bash
# If using git
git clone <repo-url>
cd url-shortener
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file:
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/urlshortener?retryWrites=true&w=majority
JWT_SECRET=supersecretkey_changeme_inproduction_min32chars
JWT_EXPIRE=7d
BASE_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend:
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create your `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_BASE_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔌 API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint           | Access  | Description           |
|--------|--------------------|---------|-----------------------|
| POST   | `/api/auth/register` | Public | Register new user     |
| POST   | `/api/auth/login`    | Public | Login and get token   |
| GET    | `/api/auth/me`       | Private | Get current user info |

**Register body:**
```json
{
  "name": "Alex Johnson",
  "email": "alex@example.com",
  "password": "secret123"
}
```

**Login body:**
```json
{
  "email": "alex@example.com",
  "password": "secret123"
}
```

**Auth response:**
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "user": { "id": "...", "name": "Alex", "email": "...", "createdAt": "..." }
}
```

---

### URL Routes — `/api/urls` (all protected)

| Method | Endpoint                        | Description                  |
|--------|---------------------------------|------------------------------|
| POST   | `/api/urls`                     | Create a short URL           |
| GET    | `/api/urls`                     | Get all user URLs (paginated)|
| GET    | `/api/urls/:id`                 | Get single URL by ID         |
| PUT    | `/api/urls/:id`                 | Update title or destination  |
| DELETE | `/api/urls/:id`                 | Delete a URL                 |
| GET    | `/api/urls/analytics/dashboard` | Get dashboard stats          |

**Create URL body:**
```json
{
  "originalUrl": "https://very-long-url.com/path",
  "customAlias": "my-link",  // optional
  "title": "My Link"          // optional
}
```

**GET /api/urls query params:**
```
?page=1&limit=10&search=github&sortBy=createdAt&order=desc
```

---

### Redirect Route

| Method | Endpoint        | Description                            |
|--------|-----------------|----------------------------------------|
| GET    | `/:shortCode`   | Redirect to original URL + count click |

---

## 🗄️ Database Schemas

### User
```js
{
  name:      String (required, 2-50 chars)
  email:     String (required, unique, lowercase)
  password:  String (required, hashed with bcrypt, hidden by default)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

### Url
```js
{
  originalUrl: String (required)
  shortCode:   String (required, unique, indexed)
  title:       String (optional, max 100 chars)
  clickCount:  Number (default: 0)
  lastVisited: Date (null until first click)
  owner:       ObjectId → User (required)
  createdAt:   Date (auto)
  updatedAt:   Date (auto)
}
```

---

## 🌍 Deployment Guide

### MongoDB Atlas

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas) and create a free cluster
2. Create a database user (username + password)
3. Whitelist IP `0.0.0.0/0` (allow all) under Network Access
4. Get your connection string and replace in `MONGO_URI`

---

### Backend on Render

1. Push your `backend/` folder to a GitHub repo
2. Go to [render.com](https://render.com) → New → **Web Service**
3. Connect your GitHub repo
4. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
5. Add all environment variables from your `.env` (with `NODE_ENV=production`)
6. Set `BASE_URL` to your Render service URL (e.g. `https://shrink-api.onrender.com`)
7. Deploy

---

### Frontend on Vercel

1. Push your `frontend/` folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Set framework: **Vite**
4. Add environment variables:
   ```
   VITE_API_URL=https://shrink-api.onrender.com/api
   VITE_BASE_URL=https://shrink-api.onrender.com
   ```
5. Deploy

---

## 🧪 Sample Data (seed script)

Save as `backend/seed.js` and run `node seed.js`:

```js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.model.js';
import Url from './models/Url.model.js';

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

const user = await User.create({
  name: 'Demo User',
  email: 'demo@shrink.io',
  password: 'demo123456',
});

await Url.insertMany([
  { originalUrl: 'https://github.com', shortCode: 'github', title: 'GitHub', clickCount: 42, owner: user._id },
  { originalUrl: 'https://docs.mongodb.com', shortCode: 'mongo', title: 'MongoDB Docs', clickCount: 18, owner: user._id },
  { originalUrl: 'https://vitejs.dev', shortCode: 'vite', title: 'Vite Docs', clickCount: 7, owner: user._id },
]);

console.log('✅ Seed complete. Login: demo@shrink.io / demo123456');
await mongoose.disconnect();
```

---

## 🛠️ Tech Stack Summary

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React 18, Vite, React Router 6      |
| Styling     | Tailwind CSS 3                      |
| HTTP Client | Axios                               |
| Notifications | react-hot-toast                   |
| Backend     | Node.js, Express.js                 |
| Database    | MongoDB, Mongoose                   |
| Auth        | JWT (jsonwebtoken)                  |
| Hashing     | bcryptjs                            |
| Validation  | express-validator                   |
| Short codes | nanoid                              |
