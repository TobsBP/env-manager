# 🔐 Env Manager

A secure, real-time environment variable management platform. Organize projects, manage environment variables across multiple environments (dev, staging, prod), and visualize dependencies between them.

## Features

- **Projects & Environments** — Create projects with multiple environments and manage variables per environment
- **Variable Management** — Add, edit, delete key-value pairs; copy all variables as `.env` format with one click
- **Dependency Graph** — Interactive visual graph of environment connections powered by XYFlow; drag nodes, create/delete edges, sort by connection density
- **Secure Auth** — Firebase Authentication with server-side session cookies (HttpOnly, 5-day expiry)
- **Real-Time Sync** — Firestore `onSnapshot` listeners keep all data live across sessions
- **User Isolation** — All data scoped per user at the database level

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Server Actions) |
| UI | React 19, Tailwind CSS 4 |
| Auth | Firebase Auth + Firebase Admin SDK (session cookies) |
| Database | Firestore (real-time, sub-collections) |
| Graph | XYFlow / @xyflow/react |
| Validation | Zod 4 |
| Linting | Biome 2 |

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd env-manager
npm install
```

### 2. Set up Firebase

Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com) with:
- **Authentication** enabled (Email/Password provider)
- **Firestore** database created

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Firebase Client SDK (public)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin SDK (server-side only)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

> The Admin SDK credentials come from a Firebase **service account** key (Project Settings → Service accounts → Generate new private key). Paste the `private_key` value with `\n` replacing actual newlines.

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Public routes: login, register, forgot-password
│   └── (protected)/         # Authenticated routes
│       ├── dashboard/        # Project list
│       ├── graph/            # Dependency graph
│       └── projects/[id]/
│           └── environments/[id]/  # Variable management
├── components/
│   ├── auth/
│   ├── graph/
│   ├── projects/
│   └── variables/
├── hooks/                   # Firestore real-time hooks (useProjects, useVariables, …)
├── lib/
│   ├── firebase/            # Client + Admin SDK setup
│   ├── auth/actions.ts      # Server Actions: session create/destroy
│   ├── projects/actions.ts  # Server Actions: project & environment CRUD
│   ├── variables/actions.ts # Server Actions: variable CRUD
│   └── connections/actions.ts
├── providers/
│   └── AuthProvider.tsx     # Auth context (onAuthStateChanged)
└── types/                   # TypeScript types + Zod schemas
```

## Scripts

```bash
npm run dev    # Start development server
npm run build  # Production build
npm run lint   # Biome lint + format
```
