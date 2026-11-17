# Amicus AI - Jurisdiction-Aware Legal Consultation Platform

> [!WARNING]
> AMICUS.AI is an informational AI assistant, not a licensed attorney. All strategic outputs include explicit legal-disclaimer framing requiring human counsel verification before executing binding agreements.

## Overview

**Amicus AI** is a fullstack legal intelligence workspace built with **Next.js 16 (App Router)**, **Google Gemini AI**, **MongoDB**, and **Tailwind CSS v4**, delivering three specialized workflows inside a responsive dark-navy and gold interface.

## Fullstack Platform Architecture

```mermaid
flowchart TB
  subgraph Client["Next.js 16 App Router Frontend"]
    Chat["/chat · Live Counsel (Jurisdiction-Aware)"]
    Vault["/vault · Ghost Vault (Ephemeral Uploads)"]
    Forge["/contracts · Contract Forge (Generate + Scan + PDF)"]
    AuthModal["AuthModal (OTP Signup + Terms Gate)"]
  end

  subgraph API["Next.js Route Handlers (/app/api/*)"]
    AuthAPI["/api/auth (JWT + bcrypt + Nodemailer OTP)"]
    ChatAPI["/api/chat"]
    AnalyzeAPI["/api/analyze (Zero-Retention Buffer)"]
    ForgeAPI["/api/forge & /api/scan"]
  end

  subgraph Services["External Intelligence & Storage"]
    Gemini["Google Gemini AI API"]
    Mongo["MongoDB + Mongoose (User Schema)"]
    SMTP["Gmail SMTP via Nodemailer"]
  end

  Chat --> ChatAPI
  Vault --> AnalyzeAPI
  Forge --> ForgeAPI
  AuthModal --> AuthAPI

  AuthAPI <--> Mongo
  AuthAPI --> SMTP
  ChatAPI <--> Gemini
  AnalyzeAPI <--> Gemini
  ForgeAPI <--> Gemini
```

## Core Workflows: Ghost Vault & Contract Forge

Ghost Vault enforces a **zero-retention privacy boundary** for sensitive PDFs, images, and text contracts: files are inspected in memory by Gemini for clause risk and fraud indicators and immediately discarded without persistent storage.

```mermaid
sequenceDiagram
  autonumber
  participant U as User Browser
  participant S as Next.js /api/analyze & /api/forge
  participant G as Google Gemini AI
  participant PDF as html2pdf.js Exporter

  rect rgba(0, 0, 242, 0.08)
    Note over U,G: Ghost Vault Zero-Retention Flow
    U->>S: Upload Legal Document (PDF / Image / Text)
    S->>G: Stream document buffer for clause risk & anomaly scan
    G-->>S: Structured risk breakdown & flagged clauses
    S->>S: Purge temporary buffer immediately (0 bytes retained)
    S-->>U: Render Markdown Risk Assessment
  end

  rect rgba(248, 120, 207, 0.08)
    Note over U,PDF: Contract Forge Generation Flow
    U->>S: Submit Jurisdiction + Contract Requirements
    S->>G: Draft structured legal clauses
    G-->>U: Interactive editable contract draft
    U->>PDF: Export signed-ready contract as PDF
  end
```

## Tech Stack Breakdown

| Layer | Technology | Role in System |
|---|---|---|
| **Web Framework** | Next.js 16 App Router | Unified SSR UI and `/api/*` backend endpoints |
| **LLM Reasoning** | Google Gemini AI | Jurisdiction-scoped legal counsel, contract drafting & clause audit |
| **Database** | MongoDB + Mongoose | User identity records and terms-acceptance state (`models/User.ts`) |
| **Authentication** | JWT + `bcrypt` + Nodemailer | Email OTP verification and session token issuance |
| **UI & Motion** | Tailwind CSS v4 + Framer Motion | 3D prism canvas background and responsive navigation drawer |
| **Document Export** | `html2pdf.js` | Instant downloadable PDF rendering from Contract Forge output |

## Directory Structure

```text
gemini-hackahton/
├── app/
│   ├── api/              # auth/, chat/, analyze/, forge/, scan/
│   ├── chat/             # Live Counsel workspace
│   ├── vault/            # Ghost Vault zero-retention analyzer
│   ├── contracts/        # Contract Forge & scanner
│   └── about/, terms/    # Governance & legal disclaimers
├── components/           # AuthModal, Navbar, Sidebar, Contact
├── models/User.ts        # Mongoose User model
└── lib/                  # db.ts & auth.ts JWT utilities
```
