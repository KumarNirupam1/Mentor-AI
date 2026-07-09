# Mentor-AI

> Chat with AI versions of **Hitesh Choudhary** and **Piyush Garg** — two Indian tech educators — and get answers that sound like them, not a generic chatbot.

<img width="1902" height="916" alt="Image" src="https://github.com/user-attachments/assets/33d6d079-995e-43ee-b98a-fe95ca117a29" />


[![Live Demo](https://img.shields.io/badge/Live_Demo-mentor--ai--ruddy.vercel.app-coral?style=for-the-badge&logo=vercel&logoColor=white)](https://mentor-ai-ruddy.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-KumarNirupam1%2FMentor--AI-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/KumarNirupam1/Mentor-AI)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4.1--mini-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)

---

## What is this?

**Mentor-AI** is a persona-based chat application built for the **GenAI with JS 2026** assignment. Instead of one generic assistant, you pick a mentor — **Hitesh** or **Piyush** — and every reply is shaped by that person's real speaking style, background, and teaching approach.

Sign in with Google, choose a persona, start a conversation, and ask anything about coding, GenAI, careers, or building projects. The app remembers context within a chat and routes each message to the correct persona prompt on the backend.

| | Link |
|---|---|
| **Live app** | https://mentor-ai-ruddy.vercel.app |
| **API** | https://mentor-ai-l4nc.onrender.com |
| **Repository** | https://github.com/KumarNirupam1/Mentor-AI |
| **Author** | [Kumar Nirupam](https://github.com/KumarNirupam1) |

---

## Features

- **Two distinct AI personas** — Hitesh Choudhary and Piyush Garg with separate system prompts
- **Persona switching** — pick your mentor from the dashboard; each chat is tied to one persona
- **Google OAuth** — secure sign-in with JWT stored in httpOnly cookies
- **Persistent chat history** — create, list, resume, and delete conversations per persona
- **Context-aware replies** — last 100 messages sent to the LLM for coherent multi-turn chat
- **Clean chat UI** — landing page, login, persona picker, chat list, and live chat interface
- **Per-mentor rate limits** — 10 messages per mentor, then a 10-minute cooldown (see below)
- **Bring your own OpenAI key** — each user adds their own API key to chat; no shared server key

---

## Rate limiting

To keep OpenAI costs under control, each logged-in user gets **10 messages per mentor** (Hitesh and Piyush tracked separately). After the 10th message, chat is paused for **10 minutes** with a countdown in the UI. Limits reset automatically when the cooldown ends.

| Setting | Default |
|---------|---------|
| Messages per mentor | 10 |
| Cooldown | 10 minutes |

Configurable on the backend via `PERSONA_MESSAGE_LIMIT` and `PERSONA_COOLDOWN_MINUTES`. Quota is reserved before each OpenAI call; failed replies do not count against the limit.

---

## OpenAI API key (BYOK)

Each user must add their own OpenAI API key before chatting. Keys are **encrypted at rest** in MongoDB using AES-256-GCM (`ENCRYPTION_SECRET` on the server). They are never returned to the client. Hashing is not used — the server must decrypt the key to call OpenAI.

---

## Architecture

```
User Browser (Next.js on Vercel)
        |
        |  Google OAuth / REST API (cookies)
        v
Express Backend (Render)
        |
        +-- MongoDB Atlas  (users, chats, messages)
        +-- OpenAI API     (gpt-4.1-mini, persona prompts)
```

### Message flow

1. User sends a message from the chat UI
2. Frontend calls `POST /api/v1/messages/:chatId` with credentials
3. Backend verifies auth, checks **rate limit**, loads chat, fetches last **100 messages**
4. Routes to `hitesh()` or `piyush()` in `backend/src/utils/ai.ts`
5. Prompt = system persona + developer context + history + new message
6. OpenAI reply saved to MongoDB and returned to frontend

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Backend | Express 5, TypeScript, Mongoose |
| Database | MongoDB Atlas |
| Auth | Google OAuth 2.0, JWT (access + refresh tokens) |
| AI | OpenAI `gpt-4.1-mini` |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Persona data — collection and preparation

Persona profiles were built from **publicly available information** about Hitesh Choudhary and Piyush Garg.

### Sources

| Source | What we extracted |
|--------|-------------------|
| YouTube live streams and videos | Speaking patterns, Hinglish mix, teaching style |
| Public social profiles | Career history, companies, channel links |
| Known public quotes | e.g. "Database dusre continent me hai" |
| Course and cohort announcements | Topics taught, prerequisites explained |
| Assignment reference repos | Base persona structure |

### Each persona prompt includes

1. Identity and career background
2. Personal traits, hobbies, favorite languages
3. Public social and work links
4. Speaking rules (Hindi vs English, greetings, tone)
5. Real chat examples from live streams to anchor voice

No fine-tuning — personality comes from the **system prompt + style examples**.

---

## Prompt engineering strategy

### Layered system prompt

```
Role definition -> Background -> Traits -> Links -> Speaking rules -> Examples
```

### Real style examples in the prompt

**Hitesh:**
- "Kuch b use kro bs keys frontend me mt chipkana, otherwise you are on your own"
- "Hanji! Swagat apka humare channel Chaicode par"
- Long live-stream answers on MERN vs AI, courses, etc.

**Piyush:**
- "Let's make our own llm", "Let's make our own cohort"
- Hinglish live stream style, GenAI course pitches

### Persona behavior rules

| | Hitesh | Piyush |
|---|--------|--------|
| Greeting | "Hanji!", Chai aur Code vibe | "Hello hello", chai pe charcha |
| Language | Hindi + English for tech | Hinglish, "modren" not modern |
| Tone | Humble experienced teacher | Frank "make it from scratch" builder |

### Developer context

Each request adds: `User which is asking the question is {name} and his email is {email}`

### Model

**OpenAI gpt-4.1-mini** — fast, follows long system prompts well.

---

## Context management

| Decision | Implementation |
|----------|----------------|
| History window | Last 100 messages per chat |
| Storage | MongoDB Chat + Message collections |
| Persona lock | Each chat stores `persona: hitesh or piyush` |
| Chat title | Auto-generated from first 3 words of first message |
| Auth | JWT in httpOnly cookies with silent refresh |

---

## Sample conversations

### Hitesh — MERN vs GenAI

```
You:    MERN pehle seekhun ya GenAI?

Hitesh: Dekho, software development skill hai jo aapko seekhni padegi.
        Interface to lagega na — chahe AI seekho ya ML, authentication to
        lagega hi. Bina HTML, JS ke project kaise banaoge?
```

### Piyush — build from scratch

```
You:    Can we build our own LLM?

Piyush: Let's make our own llm — that's the whole vibe. Bas JavaScript
        aani chahiye, ek simple mon stack project ho, chahe todo app hi
        ho, even that is enough.
```

---

## Project structure

```
Mentor-AI/
├── frontend/
│   ├── src/app/           Pages (landing, login, dashboard, chat)
│   ├── src/components/    ChatInterface, PersonaSelection, UI
│   ├── src/lib/           API helpers
│   └── public/            hitesh.webp, piyush.webp
├── backend/
│   └── src/
│       ├── controllers/   auth, chat, messages
│       ├── models/        User, Chat, Message
│       ├── routes/        REST API
│       └── utils/ai.ts    Persona prompts + OpenAI
└── README.md
```

---

## Getting started

### Prerequisites

- Node.js 18+
- MongoDB Atlas cluster
- Google OAuth credentials
- OpenAI API key

### Run locally

```bash
git clone https://github.com/KumarNirupam1/Mentor-AI.git
cd Mentor-AI

# Backend
cd backend
cp .env.example .env
npm install
npm run dev

# Frontend (new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:3000, sign in with Google, pick a mentor, start chatting.

---

## Environment variables

### Backend (`backend/.env`)

```env
NODE_ENV=development
PORT=8000
CORS_ORIGIN=http://localhost:3000
FRONTEND_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URI=http://localhost:8000/api/v1/auth/google/callback
ACCESS_TOKEN_SECRET=your_random_secret
REFRESH_TOKEN_SECRET=your_random_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=15m

# No shared OpenAI key — users add their own via the app UI
ENCRYPTION_SECRET=your_long_random_encryption_secret_at_least_32_chars

# Optional rate limits (defaults: 10 messages, 10 min cooldown per mentor)
PERSONA_MESSAGE_LIMIT=10
PERSONA_COOLDOWN_MINUTES=10
```

### Frontend (`frontend/.env`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Never commit `.env` files.

---

## Production

| Service | URL |
|---------|-----|
| Frontend (Vercel) | https://mentor-ai-ruddy.vercel.app |
| Backend (Render) | https://mentor-ai-l4nc.onrender.com |

Production env:

```env
GOOGLE_CALLBACK_URI=https://mentor-ai-l4nc.onrender.com/api/v1/auth/google/callback
FRONTEND_URL=https://mentor-ai-ruddy.vercel.app
CORS_ORIGIN=https://mentor-ai-ruddy.vercel.app
NEXT_PUBLIC_API_URL=https://mentor-ai-l4nc.onrender.com
```

Google Console: add origin `https://mentor-ai-ruddy.vercel.app` and redirect URI above.

---

## API overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/healthcheck | Server health |
| GET | /api/v1/auth/google | Start Google OAuth |
| GET | /api/v1/auth/getme | Current user |
| GET | /api/v1/auth/logout | Sign out |
| POST | /api/v1/chats | Create chat |
| GET | /api/v1/chats?persona=hitesh | List chats |
| DELETE | /api/v1/chats/:id | Delete chat |
| GET | /api/v1/messages/:chatId | Get messages |
| POST | /api/v1/messages/:chatId | Send message, get AI reply |

---

## Submission checklist

| Requirement | Link / Status |
|-------------|---------------|
| Live deployed website | https://mentor-ai-ruddy.vercel.app |
| Public GitHub repo | https://github.com/KumarNirupam1/Mentor-AI |
| LLM chat (both personas) | Hitesh + Piyush via OpenAI |
| Persona switching | Dashboard picker |
| Persona data docs | See Persona data section |
| Prompt engineering | See Prompt engineering section |
| Context management | See Context management section |
| Sample conversations | See Sample conversations section |
| Setup instructions | See Getting started section |

---

## Evaluation alignment

| Parameter | Weight | How addressed |
|-----------|--------|---------------|
| Persona Accuracy | 30 | Real transcript examples, Hinglish rules, persona greetings |
| Conversation Quality | 25 | 100-msg history, developer context, persona-locked chats |
| Technical Implementation | 25 | Clean REST API, separated ai.ts module, typed frontend |
| User Experience | 20 | OAuth flow, persona cards, chat list, live chat UI |

---

## Author

**Kumar Nirupam** — [GitHub](https://github.com/KumarNirupam1)

Built for **GenAI with JS 2026** — ChaiCode assignment.
