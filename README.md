# 🎫 Ticket AI: Next-Gen AI-Powered Ticketing System

**Ticket AI** is a premium, high-performance customer support platform that leverages **Google Gemini** and **Inngest** to automate the entire ticket lifecycle—from triage to resolution.

---

## 🚀 Key Features

- **🧠 AI-Powered Triage & Analysis**: Every incoming ticket is automatically analyzed by **Gemini 1.5 Flash** for sentiment, technical requirements, and core issue identification.
- **⚡ Smart AI-Drafted Replies**: Staff can generate high-quality, context-aware drafted responses with a single click, drastically reducing resolution time.
- **🛠️ Technical Skill-Based Routing**: Tickets are automatically matched and assigned to moderators based on their specific technical expertise (React, Node, DB, etc.).
- **💬 GitHub-Style Resolution Thread**: A professional, boxed message interface for clear and intuitive two-way communication between users and support staff.
- **📊 Real-Time Intelligence Dashboard**: A glassmorphic admin interface featuring live ticket tracking, priority filtering, and message reply indicators.
- **🏗️ Reliable Event-Driven Architecture**: Powered by **Inngest** for guaranteed background job execution, retries, and real-time observability.
- **✨ Premium UI/UX**: Built with **React** and **Tailwind CSS**, featuring dark mode, glassmorphism, smooth animations, and **Shadcn UI** components.
- **🔒 Secure Role-Based Access**: Granular permissions for Users, Moderators, and Administrators to manage workflows effectively.

---

## 🛠️ Modern Tech Stack

- **Frontend**: `React 18`, `Vite`, `Tailwind CSS`, `Lucide Icons`, `Sonner Toasts`.
- **Backend**: `Node.js`, `Express`, `Mongoose`, `JWT Authentication`.
- **Cloud/AI**: `Google Generative AI (Gemini SDK)`, `Inngest` (Event-driven background processes).
- **Communication**: `Nodemailer`.

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
