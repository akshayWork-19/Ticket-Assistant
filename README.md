# 🎫 AI Ticket Assistant: Next-Gen AI-Powered Ticketing System

**AI Ticket Assistant** is a production-ready, AI-native customer support platform. Automating ticket triage, skill-based routing, and response drafting using **Groq LLM (LLaMA 3.3 70B)**.

Decoupled AI and email workflows using **Inngest** event-driven architecture, keeping Express response times at 20–50ms. Optimized MongoDB queries via field projection and selective `.populate()` to prevent N+1 issues and reduce payload size. Secured with **JWT authentication**, role-based access control, **Helmet**, **rate limiting**, and **Zod** validation.

---

## 🚀 Key Features

- **🧠 AI-Powered Triage**: Every incoming ticket is automatically analyzed by **Groq LLaMA 3.3** for priority (`low`/`medium`/`high`), helpful notes for moderators, and required technical skills.
- **⚡ Smart AI-Drafted Replies**: Staff can generate high-quality, context-aware reply drafts with a single click via **Groq Mixtral**, drastically reducing resolution time.
- **🛠️ Skill-Based Routing**: Tickets are automatically matched and assigned to moderators based on their specific technical expertise (React, Node.js, etc.).
- **🏗️ Reliable Event-Driven Architecture**: Powered by **Inngest** for guaranteed background job execution, automatic retries, and real-time observability — each pipeline step is independently retried on failure.
- **🔒 Secure Role-Based Access Control**: Granular permissions for `user`, `moderator`, and `admin` roles.
- **📋 Service Layer Architecture**: Clean separation of concerns — controllers handle HTTP, services handle business logic, models handle persistence.
- **🗑️ Soft Deletes**: Tickets and users are never permanently destroyed — only flagged as deleted.
- **📄 Interactive API Docs**: A dark-themed documentation page served at `/` showcasing all endpoints with real request/response examples.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js v18+ (ESM) |
| Framework | Express.js |
| Database | MongoDB + Mongoose (Atlas) |
| Auth | JSON Web Tokens (JWT) |
| Async Workflows | Inngest |
| AI / LLM | Groq API (LLaMA 3.3 70B, Mixtral 8x7B) |
| Validation | Zod |
| Security | Helmet, express-rate-limit, bcrypt |
| Logging | Winston + Morgan |
| Email | Nodemailer + Mailtrap |

---

## 📁 Project Structure

```
InngestKit-TicketProject/
├── AI-ticket-Assistant/        # Node.js + Express Backend
│   ├── config/config.js        # Centralized environment config
│   ├── controllers/            # HTTP request/response handlers
│   ├── services/               # Business logic layer
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express route definitions
│   ├── middlewares/            # Auth + Zod validation
│   ├── inngest/                # Background workflow functions
│   │   └── inngest-Functions/
│   │       ├── on-signup.js         # Welcome email on registration
│   │       └── on-ticketCreated.js  # Full 6-step AI triage pipeline
│   ├── validations/            # Zod schemas
│   ├── utils/                  # Logger, mailer, Groq AI helpers
│   └── public/index.html       # Interactive API documentation UI
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- [Inngest CLI](https://www.inngest.com/docs/local-development) for local workflow testing
- Groq API key ([free at groq.com](https://groq.com))
- Mailtrap account for email testing

### 1. Clone the repository
```bash
git clone https://github.com/YOUR-USERNAME/AI-ticket-Project.git
cd AI-ticket-Project/AI-ticket-Assistant
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file based on `.env.example`:
```env
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_super_secret_key
GROQ_API_KEY=gsk_...
INNGEST_EVENT_KEY=local
ALLOWED_ORIGIN=http://localhost:3000
MAILTRAP_SMTP_USER=your_mailtrap_user
MAILTRAP_SMTP_PASS=your_mailtrap_pass
```

### 4. Run locally
```bash
# Terminal 1 — Express API
npm run start

# Terminal 2 — Inngest Dev Server (for background workflow testing)
npx inngest-cli@latest dev
```

Visit `http://localhost:4000/` for the interactive API docs.

---

## 📡 API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/signup` | Public | Register a new user |
| POST | `/login` | Public | Login and receive JWT |
| GET | `/details` | 🔒 Auth | Get current user profile |
| PUT | `/update` | ⭐ Admin | Update any user's role and skills |
| PUT | `/profile` | 🔒 Auth | Update current user's skills/avatar |

### Tickets — `/api/tickets`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | 🔒 Auth | Create a ticket — triggers AI triage |
| GET | `/?page=1&limit=10` | 🔒 Auth | Get paginated tickets |
| GET | `/:id` | 🔒 Auth | Get a single ticket with responses |
| POST | `/:id/responses` | 🔒 Auth | Add a reply to a ticket thread |
| POST | `/:id/draft` | ⭐ Mod/Admin | Generate an AI reply draft |

### System

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Interactive API documentation |
| GET | `/health` | Public | Server & database health check |

---

## 🤖 Inngest AI Pipeline

When a ticket is created, a **durable 6-step Inngest workflow** runs asynchronously:

```
1. fetch-ticket            → Load ticket from MongoDB
2. update-ticket-status    → Set status → TODO
3. call-ai-triage          → Groq LLaMA 3.3: analyze priority, notes & skills
4. ai-processing           → Save AI results, status → IN_PROGRESS
5. assign-moderator        → Regex match moderator by relatedSkills
6. send-email-notification → Email the assigned moderator via Mailtrap
```

Each step is **independently retried** on failure (max 2 retries) — the entire pipeline never restarts from scratch.

---

## 🔐 Role Permissions

| Action | user | moderator | admin |
|--------|------|-----------|-------|
| Create ticket | ✅ | ✅ | ✅ |
| View own tickets | ✅ | ✅ | ✅ |
| View all tickets | ❌ | ✅ | ✅ |
| Add response | ✅ | ✅ | ✅ |
| Generate AI draft | ❌ | ✅ | ✅ |
| Update user roles | ❌ | ❌ | ✅ |

---

*Built with ❤️ — showcasing AI agents handling complex, multi-step business workflows from categorization to automated assignment and human-in-the-loop AI assistance.*
