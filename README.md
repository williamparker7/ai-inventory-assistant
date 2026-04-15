# AI Inventory Assistant

A full-stack app for managing equipment inventory with an AI assistant that answers natural language questions about your data.

**Stack:** React + TypeScript (frontend) → GraphQL API (backend) → MySQL (database) → Claude API (AI)

---

## What You're Building

A web app where you:
1. Add, edit, and delete inventory items (equipment, parts, products)
2. Ask an AI assistant questions about your inventory in plain English
3. The AI queries your real database and gives real answers

Example questions the AI can answer:
- "What's my most expensive item?"
- "Which products are low in stock?"
- "Write a listing description for the Caterpillar 320"
- "Give me a summary of my inventory by category"

---

## Build Order (Follow This Exactly)

### Phase 1: Database + Backend (Days 1-3)
You'll get the API working first. This is the foundation everything else sits on.

1. Set up MySQL and create the database schema
2. Build GraphQL resolvers for CRUD operations
3. Test everything with the GraphQL playground

### Phase 2: Frontend (Days 4-6)
Connect a React UI to your working API.

4. Build the inventory list view
5. Build the add/edit form
6. Wire up to the GraphQL API with Apollo Client

### Phase 3: AI Assistant (Days 7-9)
This is where it gets fun. Add the AI layer on top of your working app.

7. Build the chat interface component
8. Create the backend endpoint that talks to Claude
9. Give Claude access to your database through tool use

### Phase 4: Polish + Deploy (Day 10)
10. Style it, deploy it, put it in your portfolio

---

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- MySQL installed locally (or use Docker — see below)
- An Anthropic API key from console.anthropic.com

### 1. Install dependencies

```bash
# From the project root
npm install
```

### 2. Set up your database

**Option A: Local MySQL**
```bash
mysql -u root -p
```
```sql
CREATE DATABASE inventory_assistant;
```

**Option B: Docker (easier)**
```bash
docker run --name inventory-db -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=inventory_assistant -p 3306:3306 -d mysql:8
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env with your MySQL credentials and Anthropic API key
```

### 4. Run the database migration

```bash
npm run db:migrate
```

### 5. Seed sample data

```bash
npm run db:seed
```

### 6. Start the dev server

```bash
npm run dev
```

This starts both the backend (port 4000) and frontend (port 5173).

---

## Project Structure

```
ai-inventory-assistant/
├── .env.example          # Environment variables template
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript config
│
├── server/               # BACKEND (start here)
│   ├── index.ts          # Express + Apollo Server setup
│   ├── schema.ts         # GraphQL type definitions
│   ├── resolvers.ts      # GraphQL resolvers (your API logic)
│   ├── db.ts             # MySQL connection
│   ├── migrate.ts        # Database schema setup
│   ├── seed.ts           # Sample data
│   └── ai.ts             # Claude API integration (Phase 3)
│
├── src/                  # FRONTEND (Phase 2)
│   ├── main.tsx          # React entry point
│   ├── App.tsx           # Main app component
│   ├── apollo.ts         # Apollo Client setup
│   ├── components/
│   │   ├── InventoryList.tsx    # Table of all items
│   │   ├── InventoryForm.tsx    # Add/edit item form
│   │   └── AIChatPanel.tsx      # AI assistant (Phase 3)
│   └── types.ts          # TypeScript types
│
└── README.md             # You are here
```

---

## What You'll Learn

By the end of this project, you will have built:

- **A MySQL database** with a schema you designed
- **A GraphQL API** with queries and mutations
- **A React frontend** with TypeScript and Apollo Client
- **An AI integration** using the Claude API with tool use
- **A deployed full-stack app** in your portfolio

This is the exact stack you'll use at Flyntlok. Nothing here is wasted effort.
