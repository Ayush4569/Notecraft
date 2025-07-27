# 🧠 Notecraft — AI-Powered Note-Taking App
👉 [https://app.notecraft.tech](https://app.notecraft.tech)  

![Docker](https://img.shields.io/badge/Dockerized-%231572B6.svg?style=for-the-badge&logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-%23339933.svg?style=for-the-badge&logo=node.js&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-%23000000.svg?style=for-the-badge&logo=next.js&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-%23DC382D.svg?style=for-the-badge&logo=redis&logoColor=white)



**Notecraft** is a modern, minimal, and AI-assisted note-taking platform inspired by Notion — designed with a full product mindset, not just as a CRUD project. It offers real-time document management, AI-powered formatting, secure file uploads, subscription billing, and production-grade system architecture.

This project was built entirely from scratch over 3 months with a strong focus on full-stack depth, scalable architecture, and production-grade infrastructure.
I built a modular, AI-enhanced, scalable web platform that mimics modern SaaS architecture. It includes secure file uploads via AWS S3, payment processing with Razorpay, real-time sync using React Query, scalable backend architecture using Node.js, Redis for caching and rate limiting, and DevOps practices with Docker. The AI integration provides contextual formatting assistance to improve productivity, and the entire application is optimized for both UX and performance

---

## 🚀 Features

- 📄 **Nested Note Documents** — Intuitive, collapsible, recursive structure like Notion
- ✨ **AI Text Formatter** — Format or improve selected text using OpenAI
- 🪄 **Markdown Shortcuts** — Quick and seamless writing experience
- 💾 **Persistent State** — Sidebar and document states stored via Redux & React Query
- 🧠 **Real-Time Updates** — Automatic syncing of sidebar and content
- 🖼️ **Image Uploads via S3** — Secure multi-image uploads using AWS signed URLs
- 💳 **Subscription Billing** — Razorpay-powered subscriptions with credits and `isPro` access logic
- ⚡ **Usage Credits** — Limited free usage with AI credit tracking, enforced via backend logic
- 🧪 **AI Rate Limiting** — Redis-backed IP/user-based AI API protection
- 🐳 **Dockerized Backend** — Fully containerized Node.js backend for easy deployment
- 🌐 **CI/CD Integration** — GitHub Actions to Docker Hub + EC2 auto-pull & restart on new release
- 💡 **Production Readiness** — Redis caching, background tasks (cron job), modular backend
- ⏱️ Automated Subscription Management — Cron job resets subscription expiry and AI credit limits for pro users daily.

---

## 🧱 Tech Stack

| Layer | Tech Used |
|-------|-----------|
| **Frontend** | Next.js, React, Tailwind CSS, Redux, React Query, Shadcn, Zod, React form, Blocknote editor |
| **Backend** | Node.js (Express), PostgreSQL (Prisma ORM), Redis, Resend, Node cron |
| **AI** |  Groq SDK (OpenAI-compatible) for contextual formatting & rewriting |
| **Auth** | Json web token with access and refresh tokens |
| **Payments** | Razorpay Subscriptions API |
| **Uploads** | AWS S3 with signed URL flow |
| **Infra/DevOps** | Docker, GitHub Actions (CI/CD), Nginx (reverse proxy), Redis (rate limiting & cache), EC2 |
| **Deployment** | Dockerized backend hosted on AWS EC2 instance, frontend on vercel |

---

## 🧠 System Design & Architecture Highlights

- ⚙️ **Modular Backend Architecture**
  - Clean separation between auth, payments, documents, uploads, and AI logic.
  - Middleware-based error handling and role validation.

- 📦 **Dockerized Environment**
  - Separate containers for backend server and Redis.
  - Local development mirrors production setup.

- 🚦 **Redis Rate Limiting**
  - Per-user/IP rate limits on AI feature access.
  - Helps prevent abuse and manage OpenAI costs.

- 🧠 **Redis-Based AI Request Caching**
  - Prevents duplicate OpenAI calls for same inputs.
  - Improves response time and reduces token costs.

- 🔄 **CI/CD Pipeline**
  - GitHub Actions: On every push to `main`, Docker image is built and pushed to Docker Hub.
  - EC2 Instance: Auto pulls new image, restarts container using a secure `pull + restart` bash service.

- 📂 **Secure File Upload System**
  - Image upload via signed AWS S3 URLs.
  - Enforced limits and validations to prevent abuse.

- 📡 **Credit Tracking System**
  - `isPro`, `aiCreditsLeft`, `freeTrialsLeft` per user.
  - Auto deducted on each AI request and reset on subscription.

---


## 🧑‍💻 Author

> Built with ❤️ by Ayush Mishra  
> https://www.linkedin.com/in/ayush-mishra-659951293

---

## 🏷️ License

This project is open-source and available under the MIT License.
