# KlusAI Deployment Stappenplan

## Overzicht

KlusAI bestaat uit twee onderdelen die apart gedeployd worden:

| Component | Technologie | Aanbevolen hosting |
|-----------|------------|-------------------|
| **Frontend** (webapp) | Next.js 14 | Vercel (gratis tier) |
| **Backend** (API) | FastAPI + Python | Railway / Render / Fly.io |

---

## Stap 1: GitHub Repository aanmaken

### 1.1 Maak een repo op GitHub
```bash
# Ga naar https://github.com/new
# Naam: klusai
# Visibility: Private (of Public)
# GEEN README, .gitignore of license toevoegen (die hebben we al)
```

### 1.2 Push naar GitHub
```bash
cd /Users/jeroenvankleinwee/Downloads/klusai

# Voeg de remote toe (vervang <username> met je GitHub username)
git remote add origin https://github.com/<username>/klusai.git

# Push
git push -u origin main
```

---

## Stap 2: Backend deployen (Railway — aanbevolen)

Railway is het makkelijkst voor Python + SQLite/PostgreSQL projecten.

### 2.1 Account aanmaken
- Ga naar [railway.app](https://railway.app) en log in met GitHub

### 2.2 Nieuw project
1. Klik **"New Project"** → **"Deploy from GitHub repo"**
2. Selecteer je `klusai` repository
3. Railway detecteert de monorepo — stel in:
   - **Root Directory**: `packages/backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### 2.3 Environment variables instellen
Ga naar **Settings → Variables** en voeg toe:

```
GOOGLE_AI_API_KEY=AIzaSy...jouw-key...
GEMINI_MODEL=gemini-2.5-flash
DATABASE_URL=sqlite+aiosqlite:///./klusai.db
HOST=0.0.0.0
PORT=8000
```

> **Tip**: Voor productie kun je een PostgreSQL database toevoegen via Railway's database add-on. Pas dan `DATABASE_URL` aan naar de PostgreSQL connection string.

### 2.4 Database seeden
Na de eerste deploy, open de Railway shell:
```bash
python -m app.utils.seed_database
```

### 2.5 Noteer de backend URL
Railway geeft je een URL zoals: `https://klusai-backend-production.up.railway.app`

---

## Stap 3: Frontend deployen (Vercel — aanbevolen)

### 3.1 Account aanmaken
- Ga naar [vercel.com](https://vercel.com) en log in met GitHub

### 3.2 Importeer project
1. Klik **"Add New..."** → **"Project"**
2. Selecteer je `klusai` repository
3. Configureer:
   - **Framework Preset**: Next.js
   - **Root Directory**: `packages/webapp`
   - **Build Command**: `next build` (standaard)
   - **Output Directory**: `.next` (standaard)

### 3.3 Environment variables instellen
Voeg toe in Vercel's project settings:

```
NEXT_PUBLIC_API_URL=https://jouw-railway-url.up.railway.app
```

### 3.4 Deploy
Klik **"Deploy"** — Vercel bouwt en deployt automatisch.

---

## Stap 4: CORS configureren

Na deployment moet je CORS in de backend toestaan voor je Vercel domain.

Open `packages/backend/app/main.py` en update de CORS origins:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",           # lokaal
        "https://klusai.vercel.app",       # productie
        "https://jouw-custom-domain.nl",   # optioneel
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Commit en push — Railway herdeployt automatisch.

---

## Stap 5: Custom domain (optioneel)

### Vercel (frontend)
1. Ga naar **Project Settings → Domains**
2. Voeg je domein toe (bijv. `klusai.nl`)
3. Stel DNS records in bij je domeinprovider

### Railway (backend)
1. Ga naar **Settings → Networking → Custom Domain**
2. Voeg toe: `api.klusai.nl`
3. Stel DNS records in

Update dan `NEXT_PUBLIC_API_URL` in Vercel naar `https://api.klusai.nl`.

---

## Alternatieve hosting opties

### Backend alternatieven

| Platform | Gratis tier | PostgreSQL | Moeilijkheid |
|----------|------------|------------|-------------|
| **Railway** | $5 credit/maand | Ja (add-on) | Makkelijk |
| **Render** | 750 uur/maand | Ja (gratis) | Makkelijk |
| **Fly.io** | 3 shared VMs | Ja (add-on) | Gemiddeld |
| **Google Cloud Run** | Ruim gratis tier | Via Cloud SQL | Gevorderd |

### Render setup (alternatief)
1. Ga naar [render.com](https://render.com)
2. **New → Web Service** → Connect GitHub repo
3. **Root Directory**: `packages/backend`
4. **Build Command**: `pip install -r requirements.txt`
5. **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Voeg environment variables toe

---

## Automatische deploys

Zowel Vercel als Railway deployen automatisch bij elke `git push` naar `main`:

```bash
# Lokaal wijzigingen maken en pushen
git add .
git commit -m "Update: beschrijving van de wijziging"
git push origin main
# → Vercel + Railway deployen automatisch!
```

---

## Checklist voor live gaan

- [ ] GitHub repo aangemaakt en code gepushed
- [ ] Backend draait op Railway/Render met correcte env vars
- [ ] Database geseeded met kleuren en producten
- [ ] Frontend draait op Vercel met `NEXT_PUBLIC_API_URL` ingesteld
- [ ] CORS origins bijgewerkt in `main.py`
- [ ] AI bouwplan generatie werkt (test via `/bouw` pagina)
- [ ] Verf kleuren laden correct vanuit de backend API
- [ ] (Optioneel) Custom domein geconfigureerd
- [ ] (Optioneel) PostgreSQL database i.p.v. SQLite voor productie

---

## Troubleshooting

### Backend start niet
- Check of `GOOGLE_AI_API_KEY` correct is ingesteld
- Check Railway logs: `railway logs`

### Frontend kan backend niet bereiken
- Check of `NEXT_PUBLIC_API_URL` correct is (inclusief `https://`)
- Check CORS configuratie in `main.py`

### Database is leeg
- Draai `python -m app.utils.seed_database` in de Railway shell

### AI generatie werkt niet
- Test je API key: ga naar [aistudio.google.com](https://aistudio.google.com)
- Check of `GEMINI_MODEL=gemini-2.5-flash` beschikbaar is
