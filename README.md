# Cinematic Portfolio System

Award-winning interactive portfolio with admin panel, ATS CV generator, and AI content engine.

## Quick Start

```bash
cd portfolio-system
npm install
npm start
```

Then open:
- **Portfolio**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

## Default Admin Credentials
- **Username**: admin
- **Password**: admin123

## Features

- ✨ Cinematic long-scroll portfolio with GSAP animations
- 🎛️ Full admin dashboard (profile, skills, projects, experience, education, media)
- 📄 ATS-compatible CV generator (PDF + DOCX)
- 🤖 AI content engine (bio, summaries, descriptions)
- 🔒 JWT authentication
- 💾 SQLite database
- 📱 Mobile responsive

## Tech Stack
- **Frontend**: HTML, Tailwind CSS CDN, GSAP, Lenis
- **Backend**: Express.js, better-sqlite3
- **CV**: PDFKit, docx
- **Auth**: JWT, bcryptjs

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/login | No | Admin login |
| GET | /api/all | No | All portfolio data |
| GET/PUT | /api/profile | PUT auth | Profile CRUD |
| GET/POST/PUT/DELETE | /api/skills/:id | Mutate auth | Skills CRUD |
| GET/POST/PUT/DELETE | /api/projects/:id | Mutate auth | Projects CRUD |
| GET/POST/PUT/DELETE | /api/experience/:id | Mutate auth | Experience CRUD |
| GET/POST/PUT/DELETE | /api/education/:id | Mutate auth | Education CRUD |
| GET/PUT | /api/settings | PUT auth | Settings |
| GET | /api/cv/pdf | No | Download PDF CV |
| GET | /api/cv/docx | No | Download DOCX CV |
| POST | /api/ai/generate | Auth | AI content generation |

## Environment Variables (.env)
```
PORT=3000
JWT_SECRET=your_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
OPENAI_API_KEY=  # Optional, for AI content
```
