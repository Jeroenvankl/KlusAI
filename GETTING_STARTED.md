# KlusAI - Aan de slag

KlusAI is een AI-gedreven klusapp voor het plannen, visualiseren en uitvoeren van verbouwingsprojecten. De app combineert beeldsegmentatie (SAM), kleurwetenschap (LAB color space) en AI-advies (Google Gemini) in een Next.js webapp met een FastAPI Python-backend.

---

## Vereisten

### Systeemvereisten
- **macOS** (voor iOS development)
- **Python 3.11+** (3.13 aanbevolen)
- **Node.js 18+**
- **Yarn** (corepack)
- **Xcode** (voor iOS) of **Android Studio** (voor Android)

### API Keys
- **Google AI API key** - Nodig voor AI-functies (kameranalyse, designsuggesties, bouwplannen). Verkrijgbaar op https://aistudio.google.com/apikey

---

## Snelle start

### 1. Setup script draaien

```bash
# Vanuit de root van het project:
./scripts/setup.sh
```

Dit doet automatisch:
- Python virtual environment aanmaken en dependencies installeren
- Database seeden met 200+ verfkleuren en 100+ producten
- Node.js dependencies installeren

### 2. Environment instellen

```bash
# Kopieer het .env voorbeeld (als setup.sh dit nog niet heeft gedaan):
cp .env.example packages/backend/.env

# Open en vul je API key in:
# GOOGLE_AI_API_KEY=jouw-google-ai-key-hier
```

### 3. Backend starten

```bash
cd packages/backend
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

De API draait nu op **http://localhost:8000**. Open **http://localhost:8000/docs** voor de interactieve Swagger UI.

### 4. Mobile app starten

```bash
# Terminal 1: Metro bundler
yarn mobile:start

# Terminal 2: iOS
yarn mobile:ios

# Of Android:
yarn mobile:android
```

---

## Project structuur

```
klusai/
├── packages/
│   ├── backend/          # FastAPI Python backend
│   │   ├── app/
│   │   │   ├── main.py          # App factory
│   │   │   ├── config.py        # Settings (env vars)
│   │   │   ├── routers/         # API endpoints (8 routers)
│   │   │   ├── services/        # Business logic
│   │   │   ├── models/          # SQLAlchemy ORM
│   │   │   ├── schemas/         # Pydantic validation
│   │   │   └── utils/           # Kleur- en beeldverwerking
│   │   ├── tests/               # pytest test suite (130 tests)
│   │   └── data/seed/           # Seed data (verfkleuren, producten)
│   ├── mobile/           # React Native app
│   │   └── src/
│   │       ├── screens/         # 6 modules, elk met meerdere schermen
│   │       ├── components/      # Herbruikbare UI-componenten
│   │       ├── services/        # API client
│   │       ├── store/           # Zustand state management
│   │       └── navigation/      # React Navigation stacks
│   └── shared/           # Gedeelde TypeScript types
└── scripts/              # Setup, seed en test scripts
```

---

## Backend API overzicht

| Endpoint | Methode | Beschrijving |
|----------|---------|-------------|
| `/health` | GET | Health check |
| `/api/v1/segment/auto` | POST | Automatische muur-segmentatie (SAM) |
| `/api/v1/segment/point` | POST | Punt-geselecteerde segmentatie |
| `/api/v1/paint/apply` | POST | Verf toepassen met LAB blending |
| `/api/v1/paint/search-colors` | POST | Zoek vergelijkbare verfkleuren (CIEDE2000) |
| `/api/v1/paint/brands` | GET | Lijst van verfmerken |
| `/api/v1/analyze-room/` | POST | AI kameranalyse (SAM + Claude Vision) |
| `/api/v1/design/suggest` | POST | AI designsuggesties |
| `/api/v1/design/styles` | GET | Beschikbare interieurstijlen |
| `/api/v1/products/` | GET | Producten zoeken (Gamma, Praxis, IKEA, Karwei) |
| `/api/v1/products/{id}` | GET | Product details |
| `/api/v1/build-plan/create` | POST | AI bouwplan genereren |
| `/api/v1/reverse/analyze` | POST | Foto reverse-engineeren |

### Snel testen via Swagger UI

1. Start de backend: `uvicorn app.main:app --reload`
2. Open **http://localhost:8000/docs**
3. Probeer `/health` - zou `{"status": "ok"}` moeten teruggeven
4. Probeer `/api/v1/paint/brands` - toont beschikbare verfmerken
5. Probeer `/api/v1/products/` - toont producten uit de database
6. Upload een foto naar `/api/v1/segment/auto` om muur-segmentatie te testen

---

## Tests draaien

### Alle tests

```bash
./scripts/test.sh
```

### Met code coverage

```bash
./scripts/test.sh --coverage
```

### Specifieke tests

```bash
# Alleen paint-gerelateerde tests:
./scripts/test.sh -k "paint"

# Alleen een specifiek bestand:
./scripts/test.sh tests/test_paint_engine.py

# Snel draaien (stopt bij eerste fout):
./scripts/test.sh --fast
```

### Handmatig met pytest

```bash
cd packages/backend
source .venv/bin/activate
python -m pytest tests/ -v
```

### Test suite overzicht (130 tests)

| Bestand | Tests | Wat wordt getest |
|---------|-------|-----------------|
| `test_utils_color.py` | 17 | HEX/RGB/LAB conversies, delta-E, complementaire kleuren |
| `test_utils_image.py` | 13 | Beeldverwerking, base64, EXIF, resize |
| `test_paint_engine.py` | 16 | LAB kleurblending, helderheid, warmte, maskers |
| `test_segmentation.py` | 10 | Auto-segmentatie, punt-segmentatie, RLE compressie |
| `test_schemas.py` | 12 | Pydantic request/response validatie |
| `test_product_service.py` | 15 | Productzoeking, verfkleur-matching |
| `test_models.py` | 6 | ORM modellen, relaties, constraints |
| `test_api_health.py` | 4 | Health endpoint, docs, 404 |
| `test_api_paint.py` | 10 | Verf toepassen, kleuren zoeken, merken |
| `test_api_products.py` | 10 | Product search, paginatie, filteren |
| `test_api_segment.py` | 5 | Segmentatie endpoints |
| `test_api_analyze.py` | 2 | Kameranalyse endpoint |
| `test_api_design.py` | 3 | Design suggesties, stijlen |
| `test_api_build_plan.py` | 3 | Bouwplan generatie |
| `test_api_reverse.py` | 2 | Reverse engineering endpoint |

---

## Kernconcepten

### Paint Engine (LAB blending)
De verfvisualisatie gebruikt LAB kleurruimte voor realistische resultaten:
- **L-kanaal** (lichtheid) wordt 70% behouden van de originele foto, waardoor textuur en schaduwen zichtbaar blijven
- **a\*/b\* kanalen** worden vervangen met de doelkleur
- **Helderheid slider** past het L-kanaal aan
- **Warmte slider** past het b*-kanaal aan (warm = meer geel, koel = meer blauw)
- Gaussian blur op maskerranden voor zachte overgangen

### Kleuren matching (CIEDE2000)
Bij het zoeken naar vergelijkbare verfkleuren wordt CIEDE2000 delta-E gebruikt, de industriestandaard voor kleurverschilperceptie.

### Segmentatie
Gebruikt Meta's SAM (Segment Anything Model) met een OpenCV K-means fallback als SAM niet beschikbaar is. In de test suite wordt de fallback gebruikt.

---

## Veelvoorkomende problemen

### "ModuleNotFoundError" bij backend starten
Zorg dat de virtual environment actief is:
```bash
cd packages/backend
source .venv/bin/activate
```

### Database is leeg
Seed de database opnieuw:
```bash
./scripts/seed-db.sh
```

### Tests falen
Controleer of alle dependencies geinstalleerd zijn:
```bash
cd packages/backend
source .venv/bin/activate
pip install -r requirements.txt
```

### API key niet ingesteld
Maak een `.env` bestand aan in `packages/backend/`:
```
GOOGLE_AI_API_KEY=jouw-google-ai-key-hier
GEMINI_MODEL=gemini-2.5-flash
```

AI-functies (kameranalyse, design, bouwplannen) werken niet zonder geldige API key. De segmentatie en verfvisualisatie werken wel zonder API key.

---

## Ontwikkelen

### Nieuwe test toevoegen
1. Maak een nieuw bestand `tests/test_jouw_feature.py`
2. Gebruik de fixtures uit `conftest.py` (`client`, `db_session`, `seeded_db`)
3. Draai `./scripts/test.sh` om te verifiëren

### Nieuwe API endpoint toevoegen
1. Maak een router in `app/routers/`
2. Voeg schemas toe in `app/schemas/`
3. Registreer de router in `app/main.py`
4. Schrijf tests in `tests/test_api_jouw_router.py`
5. Draai de test suite

### Database migraties
```bash
cd packages/backend
source .venv/bin/activate
alembic revision --autogenerate -m "beschrijving van wijziging"
alembic upgrade head
```
