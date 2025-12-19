import { readFile } from 'fs/promises';
import { join } from 'path';
import { KnowledgeBase, AgentType } from '../types/agents.js';

const KNOWLEDGE_BASE_PATH = join(process.cwd(), 'knowledge');

/**
 * Load knowledge base for a specific agent type
 */
export async function loadKnowledgeBase(agentType: AgentType): Promise<KnowledgeBase[]> {
  try {
    const knowledgeBases: KnowledgeBase[] = [];

    switch (agentType) {
      case 'sales':
        const productsData = await readFile(join(KNOWLEDGE_BASE_PATH, 'sales', 'products.json'), 'utf-8');
        const scriptsData = await readFile(join(KNOWLEDGE_BASE_PATH, 'sales', 'scripts.json'), 'utf-8');

        knowledgeBases.push(
          { domain: 'products', data: JSON.parse(productsData) },
          { domain: 'scripts', data: JSON.parse(scriptsData) }
        );
        break;

      case 'technical':
        const docsData = await readFile(join(KNOWLEDGE_BASE_PATH, 'technical', 'documentation.json'), 'utf-8');
        const troubleshootingData = await readFile(join(KNOWLEDGE_BASE_PATH, 'technical', 'troubleshooting.json'), 'utf-8');

        knowledgeBases.push(
          { domain: 'documentation', data: JSON.parse(docsData) },
          { domain: 'troubleshooting', data: JSON.parse(troubleshootingData) }
        );
        break;

      case 'billing':
        const policiesData = await readFile(join(KNOWLEDGE_BASE_PATH, 'billing', 'policies.json'), 'utf-8');
        const plansData = await readFile(join(KNOWLEDGE_BASE_PATH, 'billing', 'plans.json'), 'utf-8');

        knowledgeBases.push(
          { domain: 'policies', data: JSON.parse(policiesData) },
          { domain: 'plans', data: JSON.parse(plansData) }
        );
        break;

      default:
        console.warn(`Unknown agent type: ${agentType}`);
    }

    return knowledgeBases;
  } catch (error) {
    console.error(`Error loading knowledge base for ${agentType}:`, error);
    return [];
  }
}

/**
 * Format knowledge base data for AI prompt inclusion
 */
export function formatKnowledgeForPrompt(knowledgeBases: KnowledgeBase[]): string {
  if (knowledgeBases.length === 0) {
    return 'No specific knowledge base available.';
  }

  return knowledgeBases
    .map(kb => {
      return `## ${kb.domain.toUpperCase()} KNOWLEDGE:\n${JSON.stringify(kb.data, null, 2)}`;
    })
    .join('\n\n');
}

/**
 * Extract relevant information from knowledge base based on query
 */
export function extractRelevantKnowledge(
  knowledgeBases: KnowledgeBase[],
  query: string
): string {
  const queryLower = query.toLowerCase();
  const relevantInfo: string[] = [];

  for (const kb of knowledgeBases) {
    const kbString = JSON.stringify(kb.data).toLowerCase();

    // Simple keyword matching - in a production system, you'd use more sophisticated matching
    if (kbString.includes(queryLower) || queryLower.includes(kb.domain)) {
      relevantInfo.push(`From ${kb.domain}: ${JSON.stringify(kb.data, null, 2)}`);
    }
  }

  return relevantInfo.length > 0
    ? relevantInfo.join('\n\n')
    : formatKnowledgeForPrompt(knowledgeBases);
}