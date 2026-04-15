import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import typeDefs from './schema.js';
import resolvers from './resolvers.js';
import { chat } from './ai.js';

async function start() {
  const app = express();
  const port = Number(process.env.PORT) || 4000;

  // Middleware
  app.use(cors());
  app.use(express.json());

  // ---- GraphQL API ----
  const apollo = new ApolloServer({ typeDefs, resolvers });
  await apollo.start();
  app.use('/graphql', expressMiddleware(apollo));

  // ---- AI Chat Endpoint ----
  // This is a simple REST endpoint for the AI assistant
  // (GraphQL subscriptions would be overkill for this)
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      const result = await chat(message, history || []);
      res.json(result);
    } catch (err: any) {
      console.error('Chat error:', err);
      res.status(500).json({ error: 'AI request failed. Check your ANTHROPIC_API_KEY.' });
    }
  });

  // ---- Health Check ----
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.listen(port, () => {
    console.log(`\n🚀 Server running at http://localhost:${port}`);
    console.log(`   GraphQL:  http://localhost:${port}/graphql`);
    console.log(`   AI Chat:  POST http://localhost:${port}/api/chat`);
    console.log(`   Health:   http://localhost:${port}/api/health\n`);
  });
}

start().catch(console.error);
