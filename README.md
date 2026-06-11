# Shrink — URL Shortener

> **Short links, big impact.** Create clean, trackable short URLs in seconds. Monitor clicks, manage your links, and grow your reach.

![Landing Page](https://img.shields.io/badge/Status-Live-brightgreen) ![Backend](https://img.shields.io/badge/Backend-Node.js-green) ![Frontend](https://img.shields.io/badge/Frontend-S3_Static_Hosting-orange) ![DB](https://img.shields.io/badge/Database-MongoDB_Atlas-darkgreen)

---

## 🚀 Live Demo

- **Frontend:** [url-shortner-deploy.s3-website-us-east-1.amazonaws.com](http://url-shortner-deploy.s3-website-us-east-1.amazonaws.com)
- **Backend API:** Running on AWS EC2 (port 5000)

---

## ✨ Features

- 🔗 **Instant shortening** — Turn any URL into a short, shareable link in seconds
- 📊 **Click analytics** — Track every click with detailed statistics and timestamps
- 🏷️ **Custom aliases** — Create branded, memorable short codes for your links
- 👤 **User accounts** — Sign up, sign in, and manage your personal link dashboard
- 📋 **Dashboard** — View and manage all your shortened links in one place

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite), hosted on **AWS S3** (static website hosting) |
| Backend | Node.js + Express, hosted on **AWS EC2** (t3.micro) |
| Database | **MongoDB Atlas** |
| Process Manager | Nodemon (dev) |

---

## 📁 Project Structure

```
URL-Shortener/
├── frontend/          # React app (Vite)
│   └── dist/          # Built output → uploaded to S3
└── backend/
    ├── config/        # DB and app config
    ├── controllers/   # Route controllers
    ├── middleware/     # Auth and other middleware
    ├── models/        # Mongoose models
    ├── routes/        # Express routes
    ├── utils/         # Helper utilities
    └── server.js      # Entry point (port 5000)
```

---

## ⚙️ Local Development

### Prerequisites

- Node.js (v18+)
- npm
- MongoDB Atlas account (or local MongoDB)

### Clone & Install

```bash
git clone https://github.com/Poojana-S/URL-Shortner-S3-Deploy.git
cd URL-Shortner-S3-Deploy
```

#### Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
```

```bash
npm run dev
```

Backend runs at `http://localhost:5000`

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` (or similar Vite default)

---

## ☁️ AWS Deployment

### Backend — EC2

1. Launch an EC2 instance (t3.micro, Ubuntu, us-east-1c)
2. SSH into the instance
3. Install Node.js and npm
4. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/Poojana-S/URL-Shortner-S3-Deploy.git
   cd URL-Shortner-S3-Deploy/backend
   npm install
   ```
5. Set up your `.env` file with production values
6. Start the server:
   ```bash
   npm run dev
   # or use pm2 for production:
   # pm2 start server.js --name url-shortener
   ```
7. Open port **5000** in the EC2 Security Group inbound rules

### Frontend — S3 Static Hosting

1. Build the React app:
   ```bash
   cd frontend
   npm run build
   ```
2. Create an S3 bucket (e.g., `url-shortner-deploy`) in us-east-1
3. Enable **Static website hosting** on the bucket (index document: `index.html`)
4. Set bucket policy to allow public read access
5. Upload the contents of the `dist/` folder to the bucket root:
   - `index.html`
   - `assets/` folder
6. Access via the S3 website endpoint

> **Note:** Update the frontend's API base URL to point to your EC2 public IP/DNS before building.

---

## 🔒 Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `NODE_ENV` | `development` or `production` |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |

> ⚠️ Never commit your `.env` file. It is listed in `.gitignore`.

---

## 📸 Screenshots

### 🌐 Application

| Home Page | Dashboard (My Links) |
|---|---|
| ![Home Page](./Screenshots/Home%20Page.png) | ![Dashboard](./Screenshots/URL%20Shortner.png) |

### ☁️ AWS Infrastructure

| EC2 Instance (Backend) | S3 Bucket (Frontend) |
|---|---|
| ![EC2](./Screenshots/EC2%20Instance.png) | ![S3](./Screenshots/S3%20Bucket.png) |

### ⚙️ Backend Running

![Backend Connected](./Screenshots/Backend%20Connected.png)

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

[MIT](LICENSE)
