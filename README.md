# SkillRock Student Ambassador Program (SSAP)

A production-ready, full-stack web application for the SkillRock Student Ambassador Program.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Tailwind CSS + Vite |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB (via Mongoose) |
| Auth | JWT (admin) + Status token (applicants) |
| Icons | Lucide React |
| Forms | React Hook Form |
| Animations | Framer Motion / CSS |

## Project Structure

```
ssap/
├── backend/          Express API + MongoDB models
│   ├── src/
│   │   ├── config/   Database + seed
│   │   ├── middleware/ Auth + rate limiting
│   │   ├── models/   Mongoose schemas
│   │   └── routes/   API routes
│   └── .env.example
├── frontend/         React SPA
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/      API client + constants
│   │   └── types/
│   └── .env.example
└── README.md
```

## Pages

| Route | Description |
|---|---|
| `/` | Landing page with program info, FAQ, timeline |
| `/apply` | 7-step application form |
| `/application-success` | Post-submission confirmation |
| `/application-status` | Check status by email + token |
| `/privacy` | Privacy policy |
| `/terms` | Program terms |
| `/admin/login` | Admin authentication |
| `/admin/dashboard` | Application management |
| `/admin/applications/:id` | Review individual application |

---

## Local Setup

### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone and set up backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
```

### 2. Generate admin password hash

```bash
node -e "const b=require('bcryptjs'); b.hash('your_admin_password', 12).then(h=>console.log(h))"
```

Copy the hash into `ADMIN_PASSWORD_HASH` in your `.env`.

### 3. Generate JWT secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy into `JWT_SECRET` in your `.env`.

### 4. Start backend (dev)

```bash
cd backend
npm run dev
```

Backend runs on `http://localhost:5000`.

### 5. Set up and start frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required |
|---|---|---|
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `MONGODB_DB_NAME` | Database name (default: `ssap_db`) | ✅ |
| `JWT_SECRET` | Long random secret for JWT signing | ✅ |
| `ADMIN_EMAIL` | Admin login email | ✅ |
| `ADMIN_PASSWORD_HASH` | bcryptjs hash of admin password | ✅ |
| `ADMIN_NAME` | Admin display name | Optional |
| `FRONTEND_URL` | Frontend URL for CORS | ✅ |
| `PORT` | Server port (default: 5000) | Optional |
| `EMAIL_HOST` | SMTP host | Optional |
| `EMAIL_PORT` | SMTP port | Optional |
| `EMAIL_USER` | SMTP username | Optional |
| `EMAIL_PASSWORD` | SMTP password / app password | Optional |
| `EMAIL_FROM` | Sender address | Optional |

---

## Deployment on Render

### Backend (Web Service)

1. Create a new **Web Service** on Render
2. Connect your repository
3. Set **Root Directory**: `ssap/backend`
4. **Build Command**: `npm install && npm run build`
5. **Start Command**: `node dist/index.js`
6. Add all environment variables from above
7. Set `NODE_ENV=production`
8. Set `FRONTEND_URL` to your frontend Render URL

### Frontend (Static Site)

1. Create a new **Static Site** on Render
2. Set **Root Directory**: `ssap/frontend`
3. **Build Command**: `npm install && npm run build`
4. **Publish Directory**: `dist`
5. Add **Redirect/Rewrite Rule**:
   - Source: `/*`
   - Destination: `/index.html`
   - Action: Rewrite
6. Set `VITE_API_URL` to your backend Render URL + `/api`

### Health Check

Backend health check endpoint: `GET /health`

---

## API Endpoints

### Public

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/applications` | Submit application |
| `GET` | `/api/applications/status` | Check status (email + token) |

### Admin (JWT required)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/admin/login` | Admin login |
| `GET` | `/api/admin/me` | Get current admin |
| `GET` | `/api/applications` | List all applications (paginated) |
| `GET` | `/api/applications/stats` | Dashboard statistics |
| `GET` | `/api/applications/:id` | Get single application |
| `PATCH` | `/api/applications/:id` | Update status/scores/notes |
| `GET` | `/api/applications/export/csv` | Export CSV |

---

## Security

- Admin routes protected with JWT (8-hour expiry)
- Passwords hashed with bcryptjs (12 rounds)
- Rate limiting on all endpoints
- Input validation (express-validator)
- CORS configured for specific frontend origin
- Helmet.js security headers
- No sensitive data in frontend environment variables
- Status checking requires both email AND secret token
- Applicant data never exposed through public APIs

---

## Application Scoring (Admin Review)

| Category | Max Points |
|---|---:|
| Motivation & Commitment | 20 |
| Situational Judgment | 30 |
| Campus Knowledge | 25 |
| Quick-Fire | 5 |
| Video Communication | 20 |
| **Total** | **100** |
