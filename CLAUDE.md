# AI Inventory Assistant

## What this is
Full-stack inventory management app with AI assistant.

## Stack
- Frontend: React + TypeScript + Apollo Client (port 5173)
- Backend: Express + Apollo Server + GraphQL (port 4000)  
- Database: MySQL 8 via Docker (port 3306)
- AI: Anthropic Claude API with tool use

## How to run
- Start DB: docker start inventory-db
- Start app: npm run dev
- GraphQL playground: http://localhost:4000/graphql

## Project structure
- server/ = backend code
- src/ = React frontend
- src/components/ = React components