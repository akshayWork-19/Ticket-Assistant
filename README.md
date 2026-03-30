# 🎫 Ticket AI: Next-Gen AI-Powered Ticketing System

**Ticket AI** is an AI-powered customer support platform automating ticket triage, skill-based routing, and response drafting using Google Gemini 1.5 Flash — built to feel and perform like a production SaaS tool.

Decoupled AI and email workflows using Inngest event-driven architecture, keeping Express response times at 20–50ms; optimized MongoDB queries via field projection and selective `.populate()` to prevent N+1 issues and reduce payload size. 

Built a high-performance React 18 + Vite frontend with skeleton loaders for zero layout shift, live AI triage state indicators, and role-based UI — architected for horizontal scaling via stateless JWT auth and MongoDB Atlas indexing.

---

## 🚀 Key Features

- **🧠 AI-Powered Triage & Analysis**: Every incoming ticket is automatically analyzed by **Gemini 1.5 Flash** for sentiment, technical requirements, and core issue identification.
- **⚡ Smart AI-Drafted Replies**: Staff can generate high-quality, context-aware drafted responses with a single click, drastically reducing resolution time.
- **🛠️ Technical Skill-Based Routing**: Tickets are automatically matched and assigned to moderators based on their specific technical expertise (React, Node, DB, etc.).
- **💬 GitHub-Style Resolution Thread**: A professional, boxed message interface for clear and intuitive two-way communication between users and support staff.
- **📊 Real-Time Intelligence Dashboard**: A glassmorphic admin interface featuring live ticket tracking, priority filtering, and message reply indicators.
- **🏗️ Reliable Event-Driven Architecture**: Powered by **Inngest** for guaranteed background job execution, retries, and real-time observability.
- **✨ Premium UI/UX**: Built with **React** and **Tailwind CSS**, featuring feature highlight grids, dark mode, glassmorphism, smooth animations, and **Shadcn UI** components.
- **🔒 Secure Role-Based Access**: Granular permissions for Users, Moderators, and Administrators to manage workflows effectively with robust error handling for user registration.
- **📈 Advanced Admin Operations**: Upgraded dashboard visibility with comprehensive view modals and automated Google Sheets sync (IST timestamps).
- **🗄️ Optimized Data Access**: Implemented Mongoose `.lean()` and selective `.populate()` reducing payload sizes and preventing N+1 queries.

---

## 🛠️ Modern Tech Stack

- **Frontend**: `React 18`, `Vite`, `Tailwind CSS`, `Lucide Icons`, `Sonner Toasts`, `Vercel` (Hosting).
- **Backend**: `Node.js`, `Express`, `Mongoose`, `JWT Authentication`, `Railway` (Hosting).
- **Cloud/AI**: `Google Generative AI (Gemini SDK)`, `Inngest` (Event-driven background processes).
- **Database**: `MongoDB Atlas` (Optimized via indexing and lean queries).
- **Communication & Data Sync**: `Nodemailer`, `Google Sheets API`.

---

## 📦 Installation & Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Google Gemini API Key
- Inngest Account (for local development)

### 2. Implementation
```bash
# Clone the repo
git clone https://github.com/your-username/AI-ticket-Project.git
cd AI-ticket-Project

# Backend Setup
cd AI-ticket-Assistant
npm install
# Add .env: MONGO_URI, JWT_SECRET, GEMINI_API_KEY, ALLOWED_ORIGIN

# Frontend Setup
cd ../AI-ticket-Frontend
npm install
# Add .env: VITE_SERVER_URL
```

### 3. Run Locally
1. **Inngest Dev**: `npx inngest-cli@latest dev`
2. **Backend**: `npm run dev` (in Assistant directory)
3. **Frontend**: `npm run dev` (in Frontend directory)

---

## 📸 Presentation
*This project is designed to showcase how AI agents can handle complex, multi-step business workflows—from categorization to automated assignment and human-in-the-loop AI assistance.*

---

*Built with ❤️ by [Your Name]*
