<div align="center">

<img src="client/public/roadrescue-logo.png" alt="RoadRescue logo" width="90" />

# RoadRescue: Vehicle Breakdown Assistance

**A full-stack web app that connects stranded drivers with nearby mechanics in real time.**

[**🚀 Live Demo**](https://vehicle-breakdown-assistance-sachith.vercel.app) · [API](https://vehicle-breakdown-assistance-three.vercel.app) · [Report a Bug](https://github.com/Sachith1227/vehicle-breakdown-assistance/issues)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma_7-4169E1?logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)

</div>

---

## 🔑 Try It Out

No sign-up needed. Use these demo accounts on the [live site](https://vehicle-breakdown-assistance-sachith.vercel.app/login):

| Role | Email | Password |
|---|---|---|
| 🚗 Driver | `driver@roadrescue.demo` | `Demo@1234` |
| 🔧 Mechanic | `mechanic@roadrescue.demo` | `Demo@1234` |

**Suggested walkthrough:** log in as the driver in one browser, add a vehicle and create a breakdown request. Then log in as the mechanic in a private window, accept the request and move it through each status while the driver's page updates.

> The first request after a period of inactivity may take a second or two while the serverless API and database wake up.

---

## 📸 Screenshots

| Welcome | Breakdown request with live location |
|---|---|
| ![Welcome page](docs/screenshots/welcome.png) | ![New request](docs/screenshots/new-request.png) |

| Route & ETA to the driver | Mechanic dashboard |
|---|---|
| ![Request details](docs/screenshots/request-details.png) | ![Mechanic dashboard](docs/screenshots/mechanic-dashboard.png) |

---

## ✨ Features

### For drivers
- **Vehicle management:** add, edit and remove your vehicles.
- **One-tap breakdown requests:** choose a vehicle and problem type, then share your GPS location.
- **High-accuracy location:** samples GPS for the best fix, shows an accuracy radius, and lets you drag or click to fine-tune the pin.
- **Live status tracking:** follow your request through `REQUESTED → ACCEPTED → ON_THE_WAY → ARRIVED → IN_PROGRESS → COMPLETED`, with automatic refresh.
- **Cancel** a request before help arrives.

### For mechanics (service providers)
- **Nearby requests:** pending requests sorted by distance from the garage (Haversine formula).
- **Accept and update jobs** through every stage of the repair.
- **Driving route with ETA:** a road route from the mechanic's live position to the driver, with distance and travel time.
- **One-click navigation** to the driver in Google Maps.
- **Availability toggle** to go on or off duty.

### Platform
- **JWT authentication** with role-based routes (Driver / Service Provider).
- **Google Sign-In** using the Google Identity Services ID token, verified on the server.
- **Map styles:** street, satellite and OpenStreetMap layers, with no API keys required.
- **Friendly validation:** inline field errors, show/hide password, and clear network or server error messages.
- **Responsive UI** built with Tailwind CSS.

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, React Router 7, Tailwind CSS 4, Axios |
| **Maps** | Leaflet + React-Leaflet, Esri / OpenStreetMap tiles, OSRM routing, Browser Geolocation API |
| **Backend** | Node.js, Express 5, TypeScript |
| **Database** | PostgreSQL (Neon), Prisma ORM 7 with the `pg` driver adapter |
| **Auth** | JSON Web Tokens, bcrypt, Google OAuth (`google-auth-library`) |
| **Deployment** | Vercel (static frontend + serverless API in Singapore), Neon serverless Postgres |

---

## 🏗 Architecture

```
┌──────────────────────┐   HTTPS / JSON    ┌───────────────────────────┐   SQL   ┌──────────────────┐
│  React + Vite (SPA)  │ ────────────────▶ │  Express API on Vercel    │ ──────▶ │  PostgreSQL      │
│  Vercel static host  │ ◀──────────────── │  serverless function, sin1│ ◀────── │  Neon, Singapore │
└──────────┬───────────┘    JWT in header  └───────────────────────────┘ Prisma  └──────────────────┘
           │
           ├── Esri / OSM map tiles
           ├── OSRM routing API
           └── Google Identity Services
```

### Data model

```
User ──1:N── Vehicle
 │                      BreakdownRequest
 ├──1:N──────────────▶  (driver, vehicle, location, problemType, status)
 │                              ▲
 └──1:1── Mechanic ──1:N────────┘  (assigned service provider)
```

---

## 📡 API Overview

All routes are prefixed with `/api`. 🔒 = requires `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a driver or service provider |
| `POST` | `/auth/login` | Log in with email and password |
| `POST` | `/auth/google` | Log in or sign up with a Google ID token |
| `GET` | `/auth/me` 🔒 | Current user |
| `GET/POST` | `/vehicles` 🔒 | List or create vehicles |
| `GET/PUT/DELETE` | `/vehicles/:id` 🔒 | Read, update or delete a vehicle |
| `POST` | `/requests` 🔒 | Create a breakdown request |
| `GET` | `/requests` 🔒 | Driver's requests |
| `GET` | `/requests/:id` 🔒 | Request details |
| `PATCH` | `/requests/:id/cancel` 🔒 | Cancel a request |
| `GET` | `/requests/pending` 🔒 | Nearby pending requests (mechanic) |
| `GET` | `/requests/my-assigned` 🔒 | Mechanic's assigned jobs |
| `PATCH` | `/requests/:id/accept` 🔒 | Accept a request |
| `PATCH` | `/requests/:id/status` 🔒 | Update job status |
| `GET/POST` | `/mechanics/profile` 🔒 | Mechanic profile |
| `PATCH` | `/mechanics/availability` 🔒 | Toggle availability |

---

## 🚀 Running Locally

**Prerequisites:** Node.js 20+ and a PostgreSQL database (local or [Neon](https://neon.tech)).

```bash
git clone https://github.com/Sachith1227/vehicle-breakdown-assistance.git
cd vehicle-breakdown-assistance
```

**1. Backend**

```bash
cd server
npm install
```

Create `server/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/roadrescue"
JWT_SECRET="a-long-random-string"
CLIENT_URL="http://localhost:5173"
GOOGLE_CLIENT_ID="your-id.apps.googleusercontent.com"   # optional
```

```bash
npx prisma migrate deploy   # create tables
npx prisma generate
npm run dev                 # http://localhost:5000
```

**2. Frontend** (in a new terminal)

```bash
cd client
npm install
```

Create `client/.env` (optional; it defaults to `http://localhost:5000/api`):

```env
VITE_API_URL="http://localhost:5000/api"
VITE_GOOGLE_CLIENT_ID="your-id.apps.googleusercontent.com"   # optional
```

```bash
npm run dev                 # http://localhost:5173
```

---

## ☁️ Deployment

Both apps are deployed as **separate Vercel projects** from this repository:

| Project | Root directory | Environment variables |
|---|---|---|
| Frontend | `client` | `VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID` |
| Backend | `server` | `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`, `GOOGLE_CLIENT_ID` |

- The backend runs as a serverless function (`server/api/index.ts`), pinned to the **Singapore** region next to the Neon database.
- `npm run vercel-build` generates the Prisma client and applies migrations on every deploy.
- `CLIENT_URL` accepts several comma-separated origins for CORS.

---

## 📂 Project Structure

```
vehicle-breakdown-assistance/
├── client/                 # React frontend
│   └── src/
│       ├── components/     # MapLayers, RouteLine, PasswordInput, GoogleSignInButton...
│       ├── context/        # AuthContext (JWT + user in localStorage)
│       ├── pages/          # Login, Register, Dashboard, Vehicles, Requests, Mechanic...
│       ├── services/       # Axios API clients
│       └── utils/          # Geolocation, error helpers
└── server/                 # Express backend
    ├── api/index.ts        # Vercel serverless entry
    ├── prisma/             # Schema + migrations
    └── src/
        ├── controllers/    # Auth, vehicles, requests, mechanics
        ├── middleware/     # JWT authentication, role checks
        └── routes/
```

---

## 🗺 Future Improvements

- Real-time updates with WebSockets instead of polling
- Live mechanic location tracking during `ON_THE_WAY`
- Push / SMS notifications
- Ratings and reviews after completed jobs
- In-app payments

---

## 👤 Author

**Sachith**
- GitHub: [@Sachith1227](https://github.com/Sachith1227)

If you found this project interesting, consider giving it a ⭐!
