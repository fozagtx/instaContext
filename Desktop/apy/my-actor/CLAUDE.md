# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript Mastra Agent Actor for the Apify platform that creates AI agents capable of using tools to accomplish tasks. The project implements a social media agent that can scrape Instagram profiles using Apify's Instagram Scraper Actor as a tool.

## Commands

### Development
```bash
# Run locally in development mode
npm run start:dev
# or
npm start

# Build TypeScript to JavaScript
npm run build

# Run production build
npm run start:prod
```

### Code Quality
```bash
# Lint TypeScript code
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check
```

### Testing
```bash
# No tests implemented yet
npm test  # Currently exits with error message
```

### Deployment (Apify Platform)
```bash
# Deploy to Apify platform (requires authentication)
apify push

# Run Actor locally using Apify CLI
apify run

# Authenticate with Apify
apify login
```

## Architecture

### Core Components

**Main Entry Point** (`src/main.ts`):
- Initializes the Apify Actor with `Actor.init()`
- Handles input validation and extraction
- Creates the social media agent using the factory pattern
- Processes user queries through the agent
- Implements Pay Per Event (PPE) billing model
- Pushes results to Apify dataset and exits gracefully

**Agent Factory** (`src/agents.ts`):
- `createSocialMediaAgent()`: Factory function that creates a Mastra Agent
- Configured with OpenAI model integration via `@ai-sdk/openai`
- Specialized for Instagram analysis with domain-specific instructions
- Equipped with Instagram scraper tool for data gathering

**Tool System** (`src/tools.ts`):
- `instagramScraperTool`: Mastra tool that wraps Apify's Instagram Scraper Actor
- Implements proper input/output schema validation using Zod
- Handles Apify API client integration and error management
- Transforms raw scraper data into typed Instagram post objects

**Data Models** (`src/models.ts`):
- Zod schemas for type-safe Instagram data handling
- `InstagramPost`: Individual post structure with id, url, caption, timestamp
- `InstagramPosts`: Collection with validation and transformation utilities
- Static factory method `fromRaw()` for safe data conversion

### Actor Configuration

**Input Schema** (`.actor/input_schema.json`):
- `query`: User's request to the agent
- `modelName`: OpenAI model to use for agent reasoning

**Actor Metadata** (`.actor/actor.json`):
- Configured as "Mastra Agent TypeScript"
- Uses Pay Per Event monetization model
- References schema files for input/output/dataset validation

### Dependencies and Tooling

**Core Runtime**:
- `@mastra/core`: Agent and tool framework for building AI workflows
- `@ai-sdk/openai`: OpenAI model integration for agent reasoning
- `apify`: Apify platform SDK for Actor execution and data management
- `zod`: Type-safe schema validation for all data structures

**Development**:
- TypeScript with ES2022 target and NodeNext modules
- ESLint with Apify configuration and Prettier integration
- Configured for Node.js 18+ with ES modules (requires `.js` imports)

### Pay Per Event (PPE) Integration

The Actor implements Apify's Pay Per Event billing model:
- Charges on actor start: `Actor.charge({ eventName: 'actor-start' })`
- Charges on task completion: `Actor.charge({ eventName: 'task-completed' })`
- Event definitions stored in `.actor/pay_per_event.json`

## Environment Variables

**Required**:
- `OPENAI_API_KEY`: OpenAI API key for agent model access
- `APIFY_TOKEN`: Apify API token for Instagram Scraper tool usage

## Important Notes

### ES Modules
This project uses ES modules. All relative imports must include `.js` extensions even in TypeScript files due to Node.js ESM requirements.

### Tool Integration Pattern
New tools should:
1. Be defined in `src/tools.ts` with proper Zod schemas
2. Follow the Mastra `createTool()` pattern with id, description, schemas, and execute function
3. Be added to the agent's tools list in `src/agents.ts`
4. Include proper error handling and input validation

### Data Validation
All external data must be validated using Zod schemas before use. The project follows a strict type-safe approach with runtime validation.

### Apify Platform Integration
- Uses Apify SDK for platform integration (datasets, key-value stores, logging)
- Follows Actor lifecycle: `Actor.init()` → processing → `Actor.exit()`
- Implements proper error handling and data persistence patterns