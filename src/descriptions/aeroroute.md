# AeroRoute - Exposure-Aware Route Comparison Engine

> [!IMPORTANT]
> Source documentation and architecture specs live in [Shubh3155/AWS-DTU](https://github.com/Shubh3155/AWS-DTU). AeroRoute compares walking, driving, and motorcycle route candidates using estimated PM2.5 exposure (`ug*min/m3`) constrained by a user-defined detour time budget.

## Problem & Core Capabilities

Standard navigation engines minimize distance or ETA while remaining blind to ambient particulate exposure along busy corridors. **AeroRoute** bridges live routing geometry with regional air-quality telemetry and historical replay validation:

- **Genuine Multi-Candidate Routing**: Fetches live walking and traffic-aware geometry from Mapbox Directions and evaluates detour eligibility strictly against `max_detour_minutes`.
- **Dual Telemetry Modes**: Defaults to **Live Mode** (Open-Meteo / Copernicus CAMS Global PM2.5 forecasts along route corridors) while supporting **Replay Mode** against curated Supabase / OpenAQ Delhi station snapshots.
- **Explicit Credibility Guardrails**: Surfaces `coverage_percent`, `limited_data`, and `uncertain_difference` states transparently rather than interpolating past grid bounds or fabricating reduction claims.
- **Session & Navigation Suite**: Includes Google Sign-In via Firebase Auth, private Firestore recent-route persistence, and opt-in FCM direction alerts.

## Fullstack & Cloud System Architecture

```mermaid
flowchart TB
  subgraph Client["Frontend (AWS Amplify · Next.js + Mapbox GL JS)"]
    UI["Journey Dashboard & Route Map"]
    Auth["Firebase Auth (Google Sign-In) + Firestore"]
    FCM["Opt-In FCM Direction Alerts"]
  end

  subgraph Edge["Lightsail Mumbai VM (13.200.213.6)"]
    Caddy["Caddy TLS Reverse Proxy (:443 -> :8000)"]
    API["FastAPI Container (uvicorn, Non-Root Read-Only)"]
    Cache["Bounded 256-Entry Memory Cache (180s TTL + Coalescing)"]
  end

  subgraph Providers["External Providers & Data"]
    Mapbox["Mapbox Directions API (Walking / Traffic Geometry)"]
    OpenMeteo["Open-Meteo / CAMS Global (~45 km Live PM2.5)"]
    Supabase["Supabase PostgreSQL (aeroroute_runtime_aws · OpenAQ Replay)"]
  end

  UI -->|"HTTPS POST /api/routes/compare"| Caddy
  UI <--> Auth
  UI <--> FCM
  Caddy --> API
  API <--> Cache
  API -->|"Candidate Paths & Step Durations"| Mapbox
  API -->|"Live Mode: <=64 Deduplicated Coords"| OpenMeteo
  API -->|"Replay Mode: Station Snapshots"| Supabase
```

## Live Exposure Scoring & Caching Sequence

When `data_mode` is `live`, AeroRoute bypasses database pollution reads and scores each candidate path directly from regional forecast intervals with strict timeout and negative-cache protections.

```mermaid
sequenceDiagram
  autonumber
  participant U as Next.js Client
  participant F as FastAPI Engine
  participant C as In-Memory Coalesced Cache
  participant M as Mapbox Directions
  participant O as Open-Meteo (CAMS Global)

  U->>F: POST /api/routes/compare (origin, dest, max_detour_minutes, mode, live)
  F->>M: Fetch genuine route geometry & preserved step durations
  M-->>F: Candidate LineStrings + segment ETAs
  F->>F: Subdivide steps at <=100m, deduplicate on 0.02-deg grid (<=64 batch)
  F->>C: Check regional forecast entries (max 180s TTL, interval-checked)
  alt Cache Miss (Cold Region)
    C->>O: GET current=pm2_5&domains=cams_global (6s timeout)
    O-->>C: Regional concentrations + valid_from / valid_to
  else Provider Error / HTTP 429
    C-->>F: 15s-60s cooldown, retain geometry with limited_data warning
  end
  F->>F: Integrate PM2.5 x segment duration (ug*min/m3) & check detour budget
  F-->>U: Candidates, coverage_percent, data_quality, warnings
```

## Implemented API Contract

| Endpoint | Method | Purpose | Error / Edge Handling |
|---|---|---|---|
| `/health` | `GET` | Process liveness & version check | Works without provider keys |
| `/api/pilot` | `GET` | Central Delhi historical demo polygon | Labels `historical_demo` boundary |
| `/api/routes/compare` | `POST` | Compares candidates by time budget & PM2.5 | `503` if Mapbox unconfigured, `422` strict validation |

Example comparison request payload (`backend/app/schemas/routes.py`):

```json
{
  "origin": { "lat": 28.6139, "lng": 77.2090 },
  "destination": { "lat": 28.6200, "lng": 77.2200 },
  "max_detour_minutes": 5,
  "mode": "walking",
  "data_mode": "live"
}
```

## Repository Structure & AWS Deployment

```text
AWS-DTU/
├── frontend/            # Next.js, TypeScript, Tailwind CSS, Mapbox GL JS
├── backend/             # FastAPI, exposure model, Supabase runtime_role.sql, Docker
├── .github/workflows/   # CI checks, Playwright E2E, deploy-backend-vm.yml
└── documentations/      # API_CONTRACT.md, LIVE_AIR_QUALITY.md, AWS_VM_DEPLOYMENT.md
```

| Layer | Implementation Details |
|---|---|
| **Frontend Hosting** | AWS Amplify serving `aeroroute` branch auto-synced from `main` |
| **Backend Hosting** | Ubuntu 24.04 Lightsail VM in Mumbai (`ap-south-1`) behind Caddy auto-TLS |
| **Container Hardening** | Non-root user, read-only root filesystem, private temp mount, automatic rollback |
| **Database Scoped Role** | `aeroroute_runtime_aws` with RLS read-only access to stations/snapshots |
| **Automated Checks** | Frontend ESLint, `tsc`, Playwright desktop/mobile E2E, Python `ruff` + `pytest` |
