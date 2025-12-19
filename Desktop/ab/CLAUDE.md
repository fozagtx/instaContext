# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI-powered multi-agent customer support system built on the Motia framework. The system uses three specialized AI agents (Sales, Technical Support, and Billing) that collaborate to handle customer inquiries with intelligent routing and seamless handoffs.

**Key Technologies:**
- Framework: Motia (TypeScript/JavaScript only)
- AI: OpenAI API (GPT-4o-mini or GPT-4o)
- Package Manager: Bun
- State Storage: Motia State (built-in)
- Frontend: Next.js + Tailwind CSS

## Architecture Overview

### Motia Step Structure
The system is organized around Motia steps that handle different aspects of the customer support flow:

```
steps/
├── api/
│   └── message-ingest.ts      # Customer message API endpoint
├── router/
│   └── classify-intent.ts     # OpenAI-powered intent classification
├── agents/
│   ├── sales-agent.ts         # Sales inquiries handler
│   ├── tech-agent.ts          # Technical support handler
│   └── billing-agent.ts       # Billing/payment handler
├── coordinator/
│   └── handoff.ts             # Inter-agent handoff management
└── jobs/
    └── sync-knowledge.ts      # Knowledge base synchronization
```

### Event Flow
1. **Message Ingestion** → API step receives customer messages
2. **Intent Classification** → Router classifies intent using OpenAI
3. **Agent Routing** → Message routed to appropriate specialized agent
4. **Agent Processing** → Agent generates response using OpenAI + knowledge base
5. **Handoff Detection** → System detects when different expertise is needed
6. **Context Transfer** → Full conversation context preserved during handoffs

### Agent Specializations
- **Sales Agent**: Product inquiries, pricing, demos, upgrades
- **Tech Agent**: Troubleshooting, bug reports, technical documentation
- **Billing Agent**: Invoices, payments, subscriptions, refunds

Each agent has its own knowledge base and can trigger handoffs to other agents while preserving full conversation context.

## Development Commands

### Project Setup
```bash
# Install dependencies
bun install motia openai

# Initialize Motia project (if needed)
bunx motia init
```

### Development
```bash
# Start development server with hot reload
bunx motia dev

# Open Motia Workbench for observability
# Navigate to http://localhost:3000/workbench
```

### Production
```bash
# Build the project
bunx motia build

# Start production server
bunx motia start
```

## Environment Configuration

Required environment variables:
```bash
OPENAI_API_KEY=sk-...           # OpenAI API key for agent responses
MOTIA_PORT=3000                 # Server port (optional)
NODE_ENV=development            # Environment setting
LOG_LEVEL=debug                 # Logging level (optional)
```

## Knowledge Base Structure

Knowledge bases are stored as JSON files and loaded by each agent:
```
knowledge/
├── sales/
│   ├── products.json
│   ├── pricing.json
│   └── scripts.json
├── technical/
│   ├── documentation.json
│   ├── troubleshooting.json
│   └── error-codes.json
└── billing/
    ├── policies.json
    ├── plans.json
    └── procedures.json
```

## State Management

The system uses Motia's built-in state management:
- **Conversation History**: `conversation:{conversationId}`
- **Agent Context**: `agent:{agentType}:{conversationId}`
- **Handoff State**: `handoff:{conversationId}`

## Key Implementation Details

### OpenAI Integration Pattern
All agents follow this pattern for OpenAI integration:
1. Load conversation history from Motia state
2. Load relevant knowledge base content
3. Construct system prompt with agent role and knowledge
4. Call OpenAI API with conversation context
5. Process response for handoff triggers
6. Update conversation state
7. Emit response or handoff event

### Handoff Triggers
Agents detect handoff needs through:
- Specific keywords in customer messages
- OpenAI response analysis
- Predefined trigger patterns
- Confidence scoring on agent expertise

### Event-Driven Communication
- All agent communication uses Motia events
- No direct function calls between agents
- Clean separation of concerns
- Full observability through Workbench

## Testing Strategy

### Demo Scenarios
1. **Sales → Tech Handoff**: Customer asks about upgrade, then migration process
2. **Billing → Sales Loop**: Invoice question leading to upgrade inquiry
3. **Complex Multi-Agent**: Billing issue → tech support → upgrade path

### Success Metrics
- Response Time: < 5 seconds
- Intent Classification: > 80% accuracy
- Handoff Success: > 90%
- Concurrent Conversations: 10+

## Workbench Usage

Access Motia Workbench at `http://localhost:3000/workbench` to:
- Monitor real-time conversation flows
- Debug agent handoffs
- View conversation traces
- Monitor system performance
- Analyze event flows between agents