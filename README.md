# GearServer

REST API Backend zur Verwaltung von Gear-Items und deren Zuordnung zu Benutzern.

## Tech Stack

- **Hono** - Schnelles, leichtgewichtiges Web-Framework
- **TypeScript** - Statische Typisierung
- **PostgreSQL** - Relationale Datenbank
- **Drizzle ORM** - TypeScript ORM mit Migrations-Support
- **Zod** - Schema-Validierung
- **Swagger/OpenAPI** - API-Dokumentation

## Voraussetzungen

- Node.js (v18+)
- pnpm
- PostgreSQL

## Installation

```bash
# Dependencies installieren
pnpm install

# .env Datei erstellen
cp .env.example .env

# Datenbank-URL in .env anpassen
DATABASE_URL=postgres://user:password@localhost:5432/gearserver
```

## Datenbank Setup

```bash
# Schema zur Datenbank pushen
pnpm db:push

# Oder Migrationen generieren und ausführen
pnpm db:generate
pnpm db:migrate

# Drizzle Studio öffnen (visuelle DB-Verwaltung)
pnpm db:studio
```

## Entwicklung

```bash
# Development Server starten (mit Hot Reload)
pnpm dev

# Linting
pnpm lint
pnpm lint:fix

# Formatierung
pnpm format

# Alle Checks ausführen
pnpm check
```

## Produktion

```bash
# Build erstellen
pnpm build

# Server starten
pnpm start
```

## API Dokumentation

Nach dem Start ist die API-Dokumentation verfügbar unter:

- **Swagger UI**: http://localhost:3000/api/ui
- **OpenAPI Spec**: http://localhost:3000/api/doc

## API Endpoints

### Gear

| Methode | Endpoint | Beschreibung |
|---------|----------|--------------|
| GET | `/api/gear/{id}` | Einzelnes Gear abrufen |
| GET | `/api/gear/user/{userId}` | Alle Gear-Items eines Users |
| POST | `/api/gear/` | Neues Gear erstellen |
| PUT | `/api/gear/{id}` | Gear aktualisieren |
| DELETE | `/api/gear/{id}` | Gear löschen |

### User

| Methode | Endpoint | Beschreibung |
|---------|----------|--------------|
| GET | `/api/user/{id}` | Einzelnen User abrufen |
| POST | `/api/user/` | Neuen User erstellen |

## Datenbank Schema

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    users     │       │  user_gears  │       │     gear     │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │◄──────│ userId (FK)  │       │ id (PK)      │
│ username     │       │ gearId (FK)  │──────►│ name         │
│ email        │       └──────────────┘       │ type         │
│ passwordHash │                              │ yearOfProd.  │
└──────────────┘                              └──────────────┘
```

## Projektstruktur

```
src/
├── index.ts          # Server Entry Point
├── api/
│   ├── index.ts      # API Router & OpenAPI Setup
│   ├── gear.ts       # Gear Endpoints
│   └── user.ts       # User Endpoints
├── db/
│   ├── index.ts      # Datenbank-Verbindung
│   └── schema.ts     # Tabellen-Definitionen
└── schemas/
    ├── gear.schema.ts   # Gear Validierung
    └── users.schema.ts  # User Validierung
```

## Lizenz

MIT
