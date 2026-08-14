# FormFlow ✦ High-Fidelity Typeform Clone

[![Live Demo](https://img.shields.io/badge/Live_Demo-formflow--typeform--clone.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://formflow-typeform-clone.vercel.app/)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/suryansh79/formflow-typeform-clone)

[![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB?logo=python)](https://www.python.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3.0-003B57?logo=sqlite)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **FormFlow** is a full-stack web application replicating Typeform's signature design, drag-and-drop form-building studio, and distraction-free 1-question-at-a-time conversational respondent flow. Built for the SDE Fullstack Assignment.

---

## 🌐 Live Deliverables

- **Live Deployed Application**: [https://formflow-typeform-clone.vercel.app/](https://formflow-typeform-clone.vercel.app/)
- **GitHub Repository**: [https://github.com/suryansh79/formflow-typeform-clone](https://github.com/suryansh79/formflow-typeform-clone)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Installation & Local Setup](#-installation--local-setup)
- [Evaluation Compliance Matrix](#-evaluation-compliance-matrix)
- [License](#-license)

---

## 🌟 Overview

FormFlow delivers a seamless dual-experience platform:
1. **For Form Creators**: A drag-and-drop Form Builder Studio with real-time side-by-side device preview, inline canvas editing, custom theme palettes, and response analytics.
2. **For Respondents**: An unauthenticated, shareable 1-question-at-a-time conversational flow (`/f/[share_slug]`) with animated slide transitions, full keyboard navigation (`Enter`, `Arrows`, `A`-`D`, `Y`/`N`, `1`-`5`), and instant client+server validation.

---

## ✨ Key Features

### 🛠️ 1. Form Builder Studio (`/builder/[formId]`)
- **Drag-and-Drop Question List**: Powered by `@hello-pangea/dnd` for reordering questions with visual drag handles (`:::`).
- **8 Core Question Types**:
  1. `Short Text` — Single-line text input with custom placeholders.
  2. `Long Text` — Multi-line text area (Enter creates newline; OK button or Shift+Enter advances).
  3. `Multiple Choice` — Choice list with dynamic add/edit/delete choice controls and `[A]`, `[B]`, `[C]` key badges.
  4. `Dropdown` — Sleek select list dropdown.
  5. `Email` — Formatted email validation (client + server regex).
  6. `Number` — Numeric value input & numeric validation.
  7. `Yes / No` — Dual boolean choice buttons (`[Y] Yes` / `[N] No`).
  8. `Rating` — 1-5 Star scale or customizable maximum rating.
- **Focus & Canvas Editor**: Inline editing for question titles, descriptions, required toggles, placeholders, and rating scales.
- **Live Device Preview**: Real-time side-by-side desktop and mobile device preview.
- **Custom Theme Studio**: Customize accent color, background color, and text color with instant live visual feedback.

### 🚀 2. Form Management Dashboard (`/`)
- Workspace dashboard listing all creator forms.
- Status indicators (`Draft` / `Published`), response count badges, and question counters.
- Actions: Create form, rename, duplicate (clones form + questions with draft status and new slug), delete, publish/unpublish.
- Shareable public link popup modal (`/f/[slug]`).
- One-click **Re-seed Data** trigger to reset or pre-populate sample forms anytime.

### 💬 3. Conversational Respondent Flow (`/f/[share_slug]`)
- Unauthenticated public access without login.
- **Welcome Screen**: Displays title, description, time estimate badge ("Takes 1 min"), and primary **Start ▶** button.
- **1-Question-at-a-Time**: Full-screen distraction-free UI with smooth Framer Motion slide transitions (250ms).
- **Full Keyboard Navigation**:
  - `Enter` / `Down Arrow` -> Advance to next question
  - `Up Arrow` -> Go back to previous question
  - `A`, `B`, `C`, `D` -> Select choice options automatically
  - `Y` / `N` -> Select Yes/No
  - `1`-`5` -> Select Star rating
- Client & Server validation for required fields, email format, and numeric bounds.
- Thank You Screen with celebratory confetti animation (`canvas-confetti`).

### 📊 4. Results & Analytics (`/forms/[formId]/results`)
- **Summary Analytics**: Question-by-question statistical breakdown with option percentage progress bars, rating averages, and written response lists.
- **Responses Table**: Filterable table displaying submission timestamps, time spent, and answer previews.
- **Individual Submission Modal**: Full detailed view of a respondent's submission.
- **CSV Export**: Instant response dataset download (`responses_[slug].csv`).

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                          FormFlow Frontend                             │
│                  Next.js 16 (App Router, TypeScript)                   │
│          Tailwind CSS • Framer Motion • Hello-Pangea/DND               │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    │ REST API (JSON)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          FormFlow Backend                              │
│                      Python 3.13 • FastAPI                             │
│               SQLAlchemy ORM • Pydantic Validation                     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    │ SQLite3 Driver
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         SQLite Database                                │
│          `typeform.db` (Forms, Questions, Responses, Answers)          │
└───────────────────────────────────┬────────────────────────────────────┘
```

---

## 🗄️ Database Schema

```
┌───────────────────────────┐         ┌───────────────────────────┐
│           forms           │         │         questions         │
├───────────────────────────┤         ├───────────────────────────┤
│ id (PK)                   │1       *│ id (PK)                   │
│ title                     ├─────────┤ form_id (FK)              │
│ description               │         │ type                      │
│ status (draft/published)  │         │ title                     │
│ share_slug (unique)       │         │ description               │
│ theme_config (JSON)       │         │ required                  │
│ thank_you_title           │         │ order_index               │
│ thank_you_message         │         │ properties (JSON)         │
│ created_at / updated_at   │         │ logic_rules (JSON)        │
└─────────────┬─────────────┘         └─────────────┬─────────────┘
              │                                     │
              │1                                    │1
              │                                     │
              │*                                    │*
┌─────────────▼─────────────┐         ┌─────────────▼─────────────┐
│         responses         │         │          answers          │
├───────────────────────────┤         ├───────────────────────────┤
│ id (PK)                   │1       *│ id (PK)                   │
│ form_id (FK)              ├─────────┤ response_id (FK)          │
│ submitted_at              │         │ question_id (FK)          │
│ completion_time_seconds   │         │ value (JSON/Text)         │
│ user_agent                │         └───────────────────────────┘
└───────────────────────────┘
```

---

## 📡 API Reference

### Forms Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/forms` | List all creator forms with response & question counts |
| `POST` | `/api/forms` | Create a new form |
| `GET` | `/api/forms/{form_id}` | Fetch full form schema & questions |
| `PUT` | `/api/forms/{form_id}` | Update title, description, status, theme, or thank you screen |
| `DELETE` | `/api/forms/{form_id}` | Delete form & cascaded questions/responses |
| `POST` | `/api/forms/{form_id}/duplicate` | Clone form with questions (resets status to draft) |
| `POST` | `/api/forms/{form_id}/publish` | Set status to `published` |
| `POST` | `/api/forms/{form_id}/unpublish` | Set status to `draft` |

### Questions Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/forms/{form_id}/questions` | Create question |
| `PUT` | `/api/questions/{question_id}` | Update question title, required, type, or properties |
| `DELETE` | `/api/questions/{question_id}` | Delete question and re-index question order |
| `POST` | `/api/forms/{form_id}/questions/reorder` | Reorder questions using ID array |

### Public Respondent Endpoints (No Auth Required)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/forms/public/{identifier}` | Fetch public form structure by ID or `share_slug` |
| `POST` | `/api/forms/public/{form_id}/submit` | Submit answers & record response |

### Results & Analytics Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/forms/{form_id}/responses` | Fetch all submitted response rows |
| `GET` | `/api/forms/{form_id}/analytics` | Compute per-question breakdown & percentage stats |
| `GET` | `/api/forms/{form_id}/export/csv` | Download responses as CSV file |

---

## 💻 Installation & Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: v3.10 or higher
- **Git**

### 1. Clone Repository
```bash
git clone https://github.com/suryansh79/formflow-typeform-clone.git
cd formflow-typeform-clone
```

### 2. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv

# On Windows:
.\venv\Scripts\activate
# On macOS / Linux:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*The database (`typeform.db`) auto-creates and populates seed data on first startup.*

### 3. Frontend Setup (Next.js)
```bash
cd ../frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## ✅ Evaluation Compliance Matrix

| Requirement | Implementation Status | Location |
| :--- | :---: | :--- |
| **Live Deployed App** | ✅ Complete | [https://formflow-typeform-clone.vercel.app/](https://formflow-typeform-clone.vercel.app/) |
| **Public GitHub Repo** | ✅ Complete | [https://github.com/suryansh79/formflow-typeform-clone](https://github.com/suryansh79/formflow-typeform-clone) |
| **8 Question Types** | ✅ Complete | `Short Text`, `Long Text`, `Multiple Choice`, `Dropdown`, `Email`, `Number`, `Yes/No`, `Rating` |
| **Drag & Drop Builder** | ✅ Complete | `QuestionList.tsx` with `@hello-pangea/dnd` |
| **Live Device Preview** | ✅ Complete | `LivePreview.tsx` (Desktop / Mobile toggle) |
| **1-Question-at-a-Time** | ✅ Complete | `to/[formId]` & `f/[slug]` with Framer Motion |
| **Full Keyboard Shortcuts** | ✅ Complete | `Enter`, `Arrows`, `A`-`D`, `Y`/`N`, `1`-`5` |
| **Client & Server Validation**| ✅ Complete | Required, Email Regex, Numeric bounds |
| **Results & Summary Stats** | ✅ Complete | `AnalyticsSummary.tsx` & `ResponsesTable.tsx` |
| **CSV Export** | ✅ Complete | `export_responses_csv()` endpoint |
| **Custom Theme Studio** | ✅ Complete | Preset palettes & custom HEX color picker |
| **Seeded Database** | ✅ Complete | `seed.py` with 3 forms & 6 responses |

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
