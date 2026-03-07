# 🎫 Ticket AI: AI-Powered Ticketing System

A modern, full-stack ticketing system that uses AI to automatically analyze, prioritize, and assign support tickets. Built with **React**, **Node.js**, **Inngest**, and **Google Gemini**.

---

## 🚀 Features

- **AI Triage**: Automatically analyzes ticket titles and descriptions using Gemini 1.5 Flash.
- **Smart Prioritization**: Categorizes tickets into Low, Medium, or High priority based on content.
- **Automated Assignment**: Matches tickets to moderators based on required technical skills.
- **Reliable Background Jobs**: Powered by Inngest for guaranteed execution and observability.
- **Real-time Notifications**: Sends email alerts to moderators when a new ticket is assigned.
- **Role-based Access**: Separate dashboards for Users, Moderators, and Admins.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, DaisyUI.
- **Backend**: Node.js, Express, Mongoose (MongoDB).
- **AI/Automation**: Google Generative AI (Gemini), Inngest.
- **Communication**: Nodemailer.

## 📦 Installation

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/your-username/AI-ticket-Project.git
cd AI-ticket-Project
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd AI-ticket-Assistant
npm install
\`\`\`
- Create a \`.env\` file and add:
  - \`MONGO_URI\`, \`JWT_SECRET\`, \`GEMINI_API_KEY\`, \`EMAIL_USER\`, \`EMAIL_PASS\`, \`ALLOWED_ORIGIN\`.

### 3. Frontend Setup
\`\`\`bash
cd ../AI-ticket-Frontend
npm install
\`\`\`
- Add \`VITE_SERVER_URL=http://localhost:3000/api\` to your \`.env\`.

## 🚦 Running Locally

1. **Start Backend**: \`npm run dev\` (in Assistant folder)
2. **Start Inngest**: \`npm run inngest-dev\` (in Assistant folder)
3. **Start Frontend**: \`npm run dev\` (in Frontend folder)

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or pull requests to improve the AI prompts, UI, or add new features.

---

*Made with ❤️ !*
