import Anthropic from '@anthropic-ai/sdk';
import pool from './db.js';
import { RowDataPacket } from 'mysql2';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Define tools that Claude can use to query your database
const tools: Anthropic.Tool[] = [
  {
    name: 'query_inventory',
    description:
      'Query the inventory database. Returns matching items. Use this to answer any question about current inventory, stock levels, pricing, categories, etc.',
    input_schema: {
      type: 'object' as const,
      properties: {
        sql_query: {
          type: 'string',
          description:
            'A SELECT SQL query to run against the inventory_items table. Columns: id, name, category, description, price, stock_quantity, condition_status, manufacturer, model_number, year, created_at, updated_at. ONLY SELECT queries are allowed — never INSERT, UPDATE, DELETE, or DROP.',
        },
      },
      required: ['sql_query'],
    },
  },
  {
    name: 'get_inventory_summary',
    description:
      'Get a high-level summary of the entire inventory: total items, total value, stock count, and category breakdown.',
    input_schema: {
      type: 'object' as const,
      properties: {},
    },
  },
];

// Execute a tool call from Claude
async function executeTool(toolName: string, toolInput: any): Promise<string> {
  try {
    if (toolName === 'query_inventory') {
      const query = toolInput.sql_query as string;

      // Safety check: only allow SELECT queries
      const normalized = query.trim().toUpperCase();
      if (!normalized.startsWith('SELECT')) {
        return JSON.stringify({ error: 'Only SELECT queries are allowed.' });
      }

      const [rows] = await pool.execute<RowDataPacket[]>(query);
      return JSON.stringify(rows, null, 2);
    }

    if (toolName === 'get_inventory_summary') {
      const [totals] = await pool.execute<RowDataPacket[]>(
        'SELECT COUNT(*) as total_items, COALESCE(SUM(price * stock_quantity), 0) as total_value, COALESCE(SUM(stock_quantity), 0) as total_stock FROM inventory_items'
      );
      const [categories] = await pool.execute<RowDataPacket[]>(
        'SELECT category, COUNT(*) as count, SUM(stock_quantity) as total_stock, SUM(price * stock_quantity) as total_value FROM inventory_items GROUP BY category ORDER BY total_value DESC'
      );
      return JSON.stringify({ totals: totals[0], categories }, null, 2);
    }

    return JSON.stringify({ error: `Unknown tool: ${toolName}` });
  } catch (err: any) {
    return JSON.stringify({ error: err.message });
  }
}

// Main chat function: sends user message to Claude with tool access
export async function chat(userMessage: string, conversationHistory: any[] = []) {
  const systemPrompt = `You are an AI inventory assistant for an equipment dealership. You help users understand and manage their inventory by querying the database and providing clear, useful answers.

When users ask about inventory, use the query_inventory tool to get real data before answering. Be specific with numbers and details. If you're writing a listing description, make it professional and compelling.

Keep responses concise and helpful. Use plain language, not technical jargon. Format numbers nicely (e.g., "$185,000.00" not "185000").`;

  // Build messages array
  const messages: Anthropic.MessageParam[] = [
    ...conversationHistory,
    { role: 'user', content: userMessage },
  ];

  // First API call — Claude may decide to use tools
  let response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    tools,
    messages,
  });

  // Tool use loop: if Claude wants to use a tool, execute it and send the result back
  while (response.stop_reason === 'tool_use') {
    const assistantContent = response.content;

    // Find the tool use block
    const toolUseBlock = assistantContent.find(
      (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
    );

    if (!toolUseBlock) break;

    // Execute the tool
    const toolResult = await executeTool(toolUseBlock.name, toolUseBlock.input);

    // Send the tool result back to Claude
    messages.push({ role: 'assistant', content: assistantContent });
    messages.push({
      role: 'user',
      content: [
        {
          type: 'tool_result',
          tool_use_id: toolUseBlock.id,
          content: toolResult,
        },
      ],
    });

    // Get Claude's final response with the tool results
    response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      tools,
      messages,
    });
  }

  // Extract the text response
  const textBlock = response.content.find(
    (block): block is Anthropic.TextBlock => block.type === 'text'
  );

  return {
    message: textBlock?.text || 'I could not generate a response.',
    conversationHistory: messages,
  };
}
