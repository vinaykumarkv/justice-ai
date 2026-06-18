# Justice AI — Court Case Management Tool

A full-stack AI application that helps judges and court clerks manage cases by providing instant briefings, risk assessments, and automated hearing scheduling — powered by a local LLM via Ollama.

---

## What It Does

When a new case arrives, the clerk enters the defendant details into the app. Justice AI then:

1. **Briefs the judge** — generates a structured case overview from the raw case details
2. **Assesses risk** — scores the case from 0–10 and recommends analysis depth (Low / Medium / High)
3. **Schedules the next hearing** — recommends and saves a hearing date based on risk level (High = within 2 weeks, Medium = within 1 month, Low = within 3 months)

All scheduled hearings are stored in a local database and displayed in the app.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) |
| Backend | Python, Flask |
| Database | SQLite |
| AI | Ollama (llama3.2) via OpenAI-compatible API |

---

## Project Structure

```
justice-ai/
├── app.py            # Flask backend — all API endpoints
├── database.py       # SQLite setup and insert functions
├── justice.db        # SQLite database (auto-created on first run)
├── index.html        # Original HTML prototype (replaced by React)
└── frontend/         # React app (Vite)
    └── src/
        └── App.jsx   # Main React component
```

---

## Prerequisites

- Python 3.12+
- Node.js 18+
- [Ollama](https://ollama.com) installed and running with llama3.2 pulled

```bash
ollama pull llama3.2
```

---

## How to Run

### 1. Clone and set up Python environment

```bash
cd justice-ai
python -m venv .venv

# Windows
.venv\Scripts\activate

# Mac/Linux
source .venv/bin/activate
```

### 2. Install Python dependencies

```bash
pip install flask flask-cors openai
```

### 3. Start Ollama

```bash
ollama run llama3.2
```

### 4. Start the Flask backend

```bash
python app.py
```

Flask runs on `http://localhost:5000`

### 5. Start the React frontend

```bash
cd frontend
npm install
npm run dev
```

React runs on `http://localhost:5173` (or next available port)

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/brief` | Generate AI case briefing |
| POST | `/risk` | Get structured risk assessment |
| POST | `/schedule` | Schedule next hearing + save to DB |
| GET | `/hearings` | Retrieve all scheduled hearings |

---

## Features

- **Structured AI output** — risk scores returned as JSON, not plain text
- **Colour-coded risk badges** — red for High, yellow for Medium, green for Low
- **Persistent storage** — all hearings saved to SQLite with timestamps
- **Local AI** — runs entirely on your machine, no API keys or internet required
- **Prompt-engineered responses** — strict output formatting enforced via system prompts

---

## Built With

This project was built as a learning exercise covering:
- React state management and hooks (`useState`, `useEffect`)
- REST API design with Flask
- Prompt engineering for structured LLM output
- SQLite database design and queries
- Full-stack debugging across frontend and backend