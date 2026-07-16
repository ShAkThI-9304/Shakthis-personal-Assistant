# 🤖 Shakthi AI Assistant

> A full-stack AI-powered portfolio chatbot built with a complete RAG (Retrieval-Augmented Generation) pipeline — answers questions about Shakthivel B's professional background, skills, projects, and experience.

![Tech Stack](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-000000?style=for-the-badge)
![Google Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)
![AstraDB](https://img.shields.io/badge/AstraDB-6B4FBB?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

---

## 🔗 Live Demo

| | Link |
|---|---|
| 🌐 **Live App** | [shakthi-assistant.vercel.app](https://shakthi-assistant.vercel.app) |
| 📡 **API Docs** | [shakthi-assistant-backend.onrender.com/docs](https://shakthi-assistant-backend.onrender.com/docs) |
| 💻 **GitHub** | [github.com/ShAkThI-9304/shakthi-personal-assistant](https://github.com/ShAkThI-9304/shakthi-personal-assistant) |

> ⚡ First response may take ~30 seconds — Render free tier wakes up on first request.

---

## 📌 What is this?

Instead of hardcoding answers, this assistant:

1. **Retrieves** relevant chunks from Shakthivel's resume and profile data stored as vectors in AstraDB
2. **Augments** the user's question with that retrieved context
3. **Generates** a grounded, accurate response using Gemini AI

This is a complete **RAG pipeline** — no hallucinations, no made-up facts, only answers based on real data.

---

## ✨ Features

- 🔍 **RAG Pipeline** — vector search on resume data before every AI response
- 🤖 **Multi-model fallback** — auto-switches between Gemini models on quota exhaustion
- ⚠️ **Smart error handling** — quota, connection, and retriever errors shown as styled UI states with retry button
- 💬 **Dynamic typing indicator** — cycles through realistic status messages while thinking
- 🏗️ **Architecture modal** — interactive diagram showing the full RAG pipeline
- 🧩 **Tech stack strip** — shows the full stack used to build the assistant
- 🏷️ **Model badge** — shows which Gemini model answered each message
- 📱 **Fully responsive** — works on mobile and desktop
- ✨ **Recruiter-focused UI** — clean, polished, designed to impress

---

## 🏗️ Architecture

```
User Question
      │
      ▼
 React Frontend  ──── POST /api/chat ────►  FastAPI Backend
      │                                            │
      │                                            ▼
      │                                   LangChain Retriever
      │                                            │
      │                                            ▼
      │                                  AstraDB Vector Search
      │                               (finds top 3 matching chunks)
      │                                            │
      │                                            ▼
      │                                  Build Grounded Prompt
      │                               (context + system prompt + question)
      │                                            │
      │                                            ▼
      │                                    Gemini AI Model
      │                               (with multi-model fallback)
      │                                            │
      ◄──────── HTML Response ◄───────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js | Chat UI, state management |
| Vite | Build tool |
| Axios | API calls to FastAPI backend |
| CSS3 | Custom animations, responsive design |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | REST API, request handling |
| LangChain | RAG pipeline orchestration |
| Gemini AI | LLM response generation |
| Google Generative AI Embeddings | Convert text to vectors |
| AstraDB | Vector database for resume chunks |
| Python 3.11 | Backend language |

### Deployment
| Technology | Purpose |
|---|---|
| Vercel | Frontend hosting, auto-deploy |
| Render | Backend hosting, free tier |
| GitHub | Monorepo version control |

---

## 📁 Project Structure

```
shakthi-personal-assistant/
├── Backend/                          # FastAPI backend
│   ├── app/
│   │   ├── api/
│   │   │   └── chat.py               # Chat endpoint, model fallback, error handling
│   │   ├── core/
│   │   │   ├── config.py             # Environment variable loading
│   │   │   └── llm.py                # LLM initialization, fallback chain
│   │   ├── data/
│   │   │   ├── Sakthivel_Resume.pdf  # Resume data source
│   │   │   └── merged.md             # Additional profile data
│   │   ├── rag/
│   │   │   ├── ingest.py             # PDF → chunks → AstraDB pipeline
│   │   │   ├── retriever.py          # AstraDB vector retriever
│   │   │   └── prompts.py            # System prompt for Gemini
│   │   ├── schemas/
│   │   │   └── chat.py               # Pydantic request models
│   │   └── main.py                   # FastAPI app entry point
│   ├── requirements.txt
│   └── .env                          # (not committed)
│
└── frontend/                         # React frontend
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx             # App header with info button
    │   │   ├── ChatMessage.jsx        # Message bubble with error states
    │   │   ├── TypingIndicator.jsx    # Animated thinking indicator
    │   │   ├── SuggestedQuestions.jsx # Quick question chips
    │   │   ├── TechStackBar.jsx       # Built-with strip
    │   │   ├── ArchitectureModal.jsx  # RAG pipeline diagram
    │   │   └── icons.jsx              # All SVG icons
    │   ├── utils/
    │   │   └── formatMessage.js       # HTML formatting, timestamps
    │   ├── App.jsx                    # Main app component
    │   ├── App.css                    # All styles
    │   └── api.js                     # Axios instance
    └── package.json
```

---

## 🚀 Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- Google AI Studio API key
- AstraDB account (free)

---

### 1. Clone the repo
```bash
git clone https://github.com/ShAkThI-9304/shakthi-personal-assistant.git
cd shakthi-personal-assistant
```

---

### 2. Backend setup
```bash
cd Backend
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # Mac/Linux

pip install -r requirements.txt
```

Create `Backend/.env`:
```env
GOOGLE_API_KEY=your_google_api_key
ASTRA_DB_API_ENDPOINT=your_astradb_endpoint
ASTRA_DB_APPLICATION_TOKEN=your_astradb_token
MODEL_NAME=gemini-3.1-flash-lite
MODEL_PROVIDER=google_genai
```

---

### 3. Ingest resume data into AstraDB
```bash
python -m app.rag.ingest
```
You should see:
```
Loaded Documents: 2
Chunks Created: 47
Successfully Stored 47 Chunks
```

---

### 4. Run backend
```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
Backend live at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

---

### 5. Frontend setup
```bash
cd ../frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000
```

---

### 6. Run frontend
```bash
npm run dev
```
Frontend live at: `http://localhost:5173`

---

## 🌐 Deployment

| Service | Platform | Config |
|---|---|---|
| Frontend | Vercel | Root dir: `frontend`, auto-deploy on push |
| Backend | Render | Root dir: `Backend`, free tier |

### Environment variables needed on each platform:

**Vercel (frontend):**
```
VITE_API_URL = https://your-backend.onrender.com
```

**Render (backend):**
```
GOOGLE_API_KEY
ASTRA_DB_API_ENDPOINT
ASTRA_DB_APPLICATION_TOKEN
MODEL_NAME = gemini-3.1-flash-lite
MODEL_PROVIDER = google_genai
```

---

## 🔄 Update resume data

When you update your resume:

1. Replace the PDF in `Backend/app/data/`
2. Clear old vectors in AstraDB dashboard
3. Re-run ingest:
```bash
python -m app.rag.ingest
```
4. Push to GitHub — auto-redeploys on both platforms

---

## 🤖 Multi-Model Fallback

The backend automatically tries models in this order if quota is hit:

```
gemini-3.1-flash-lite  (500 req/day)  ← primary
        │
        ▼ if quota exceeded
gemini-2.5-flash-lite  (20 req/day)   ← backup
        │
        ▼ if quota exceeded
gemini-2.5-flash       (20 req/day)   ← last resort
```

---

## 📄 License

MIT License — feel free to use this as inspiration for your own portfolio assistant.

---

## 👤 Author

**Shakthivel B**
- 🌐 Portfolio Assistant: [shakthi-assistant.vercel.app](https://shakthi-assistant.vercel.app)
- 💼 LinkedIn: [linkedin.com/in/shakthivel-b](https://linkedin.com/in/shakthivel-b)
- 🐙 GitHub: [github.com/ShAkThI-9304](https://github.com/ShAkThI-9304)

---

⭐ **If you found this useful, give it a star!**
