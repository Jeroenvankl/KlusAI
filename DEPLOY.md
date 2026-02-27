# KlusAI Deployment Stappenplan (100% Gratis)

## Overzicht

| Component | Technologie | Hosting | Kosten |
|-----------|------------|---------|--------|
| **Frontend** (webapp) | Next.js 14 | Vercel | Gratis |
| **Backend** (API) | FastAPI + Python | Render.com | Gratis |

> Beide platforms deployen automatisch bij elke push naar GitHub.

---

## Stap 1: GitHub Repository

1. Ga naar **[github.com/new](https://github.com/new)**
2. **Repository name**: `klusai`
3. **Visibility**: Private of Public
4. **Vink NIETS aan** (geen README, geen .gitignore)
5. Klik **"Create repository"**
6. Op de lege repo-pagina, klik **"uploading an existing file"**
7. Open Finder → ga naar `Downloads/klusai-github-upload/`
8. Selecteer alles (⌘+A), sleep naar het upload-veld
9. Wacht tot alle bestanden geladen zijn
10. Commit message: `Initial commit: KlusAI`
11. Klik **"Commit changes"**

---

## Stap 2: Backend deployen op Render (gratis)

### 2.1 Account
- Ga naar **[render.com](https://render.com)** → **Sign up met GitHub**

### 2.2 Web Service aanmaken
1. Klik **"New +"** → **"Web Service"**
2. Klik **"Build and deploy from a Git repository"** → **Next**
3. Verbind je GitHub account en selecteer de `klusai` repo
4. Configureer:

| Instelling | Waarde |
|-----------|--------|
| **Name** | `klusai-backend` |
| **Region** | Frankfurt (EU) |
| **Root Directory** | `packages/backend` |
| **Runtime** | Python 3 |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `python -m app.utils.seed_database && uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | **Free** |

### 2.3 Environment Variables
Scroll naar beneden naar **"Environment Variables"** en voeg toe:

| Key | Value |
|-----|-------|
| `GOOGLE_AI_API_KEY` | `AIzaSyC1qjRcVjtLB-bctEfkf3RC27wVsiGhCEU` |
| `GEMINI_MODEL` | `gemini-2.5-flash` |
| `DATABASE_URL` | `sqlite+aiosqlite:///./klusai.db` |
| `PYTHON_VERSION` | `3.13.0` |

### 2.4 Deployen
1. Klik **"Create Web Service"**
2. Wacht tot de deploy klaar is (2-3 minuten)
3. Je krijgt een URL zoals: `https://klusai-backend.onrender.com`
4. **Kopieer deze URL** — die heb je nodig in stap 3

> **Let op**: Bij het gratis plan slaapt de server na 15 min inactiviteit.
> De eerste request na inactiviteit duurt ~30 sec (cold start), daarna is alles snel.

---

## Stap 3: Frontend deployen op Vercel (gratis)

### 3.1 Account
- Ga naar **[vercel.com](https://vercel.com)** → **Sign up met GitHub**

### 3.2 Project importeren
1. Klik **"Add New..."** → **"Project"**
2. Selecteer je `klusai` repository → **"Import"**
3. Configureer:

| Instelling | Waarde |
|-----------|--------|
| **Framework Preset** | Next.js |
| **Root Directory** | `packages/webapp` (klik "Edit" om dit in te stellen) |

### 3.3 Environment Variables
Klik **"Environment Variables"** en voeg toe:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://klusai-backend.onrender.com` *(de URL uit stap 2.4)* |

### 3.4 Deploy
1. Klik **"Deploy"**
2. Wacht tot de build klaar is (~1 minuut)
3. Je app is nu live op: `https://klusai.vercel.app` (of vergelijkbaar)

---

## Stap 4: CORS instellen

De backend moet weten dat je Vercel-frontend verbinding mag maken.

1. Ga naar je repo op **GitHub**
2. Open het bestand: `packages/backend/app/main.py`
3. Klik het **potlood-icoon** (✏️) om te bewerken
4. Zoek de regel met `allow_origins` en vervang deze met:

```python
allow_origins=[
    "http://localhost:3000",
    "https://klusai.vercel.app",       # ← vervang met jouw Vercel URL
],
```

5. Klik **"Commit changes"**
6. Render herdeployt automatisch (~2 min)

---

## Klaar! Testen

1. Open je Vercel URL in de browser
2. Ga naar **Verf & Kleuren** → je zou 309 kleuren moeten zien
3. Ga naar **Bouw & Klushulp** → typ een project → klik **Genereer**
4. Het AI bouwplan wordt gegenereerd door Gemini

---

## Troubleshooting

| Probleem | Oplossing |
|----------|----------|
| Kleuren laden niet | Backend slaapt waarschijnlijk — wacht 30 sec en herlaad |
| AI plan geeft error | Check Render logs → Dashboard → klusai-backend → Logs |
| "Failed to fetch" | CORS niet ingesteld (stap 4) of verkeerde URL in Vercel |
| Backend deploy faalt | Check of `Root Directory` = `packages/backend` staat |
| Frontend deploy faalt | Check of `Root Directory` = `packages/webapp` staat |
