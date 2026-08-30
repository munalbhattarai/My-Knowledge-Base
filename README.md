# Personal Knowledge Base

[![Live Demo](https://img.shields.io/badge/Live%20Demo-munal.me-0051C8?style=for-the-badge&logo=cloudflare&logoColor=white)](https://munal.me)
[![Frontend](https://img.shields.io/badge/Frontend-Cloudflare%20Pages-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://render.com/)
[![Database](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

A full-stack personal knowledge management system for documenting notes, code snippets, resources, and tracking learning progress.

🌐 **Live Production**: [munal.me](https://munal.me) | [www.munal.me](https://www.munal.me)

---

## ⚡ Tech Stack & Infrastructure

- **Frontend**: React 19, Vite, Redux Toolkit, Tailwind CSS v4, Framer Motion
- **Backend**: Django 6.0, Django REST Framework, SimpleJWT
- **Database**: Supabase PostgreSQL
- **Hosting**:
  - **Client**: Cloudflare Pages
  - **API Server**: Render (`https://my-knowledge-base-awqv.onrender.com/api/`)

---

## 🔑 Key Features

- **Markdown & Code Highlighting**: GFM syntax, live preview, and multi-language syntax highlighting.
- **Learning Lifecycle**: Categorize notes into `Learning`, `Learned`, and `Review` statuses.
- **Organization**: Hierarchical custom Categories, Tags, Starred Favorites, and Archival storage.
- **Attached Media & Snippets**: Attach code snippets and categorized reference URLs (Articles, Videos, Docs, GitHub).
- **Authentication**: JWT-based session security with auto token refresh.

---

## ⚙️ Environment Configuration

### Frontend (`frontend/.env`)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `VITE_USE_MOCK` | Toggle local mock API (`true` / `false`) | `false` |
| `VITE_API_BASE_URL` | Django REST API root URL | `https://my-knowledge-base-awqv.onrender.com/api/` |

### Backend (`backend/.env`)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `SECRET_KEY` | Django cryptographic secret | `django-insecure-...` |
| `DEBUG` | Development mode toggle | `False` |
| `DB_NAME` | PostgreSQL Database Name | `postgres` |
| `DB_USER` | PostgreSQL Username | `postgres` |
| `DB_PASSWORD` | PostgreSQL Password | `<db_password>` |
| `DB_HOST` | PostgreSQL Host address | `db.mrmftdtojpkqskaaqlxc.supabase.co` |
| `DB_PORT` | PostgreSQL Connection Port | `5432` |
| `ALLOWED_HOSTS` | Host header validation | `localhost,127.0.0.1,.onrender.com` |
| `CORS_ALLOWED_ORIGINS`| Allowed origins for CORS | `https://munal.me,https://www.munal.me` |

---

## 🛠️ Local Development

### 1. Backend

```bash
cd backend
python -m venv env
# Activate: .\env\Scripts\Activate.ps1 (Win) or source env/bin/activate (Unix)
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🚀 Deployment

- **Frontend (Cloudflare Pages)**:
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`
  - **Env Variables**: Set `VITE_API_BASE_URL` to production backend API URL.

- **Backend (Render)**:
  - **Build Command**: `./build.sh` (`pip install`, `collectstatic`, `migrate`)
  - **Start Command**: `gunicorn config.wsgi:application`
