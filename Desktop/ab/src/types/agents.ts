// Agent Types and Interfaces

export interface CustomerMessage {
  customerId: string;
  message: string;
  timestamp: number;
  sessionId?: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  source: string;
  timestamp: number;
}

export interface ConversationContext {
  conversationId: string;
  messages: ConversationMessage[];
  currentAgent?: AgentType;
  handoffReason?: string;
}

export type AgentType = 'sales' | 'technical' | 'billing' | 'triage';

export type IntentType = 'sales' | 'technical' | 'billing' | 'general' | 'escalation';

export interface IntentClassification {
  intent: IntentType;
  confidence: number;
  reasoning?: string;
}

export interface AgentResponse {
  conversationId: string;
  message: string;
  agentType: AgentType;
  requiresHandoff: boolean;
  handoffTo?: AgentType;
  handoffReason?: string;
  timestamp: number;
}

export interface HandoffRequest {
  conversationId: string;
  fromAgent: AgentType;
  toAgent: AgentType;
  reason: string;
  context: ConversationContext;
  timestamp: number;
}

export interface KnowledgeBase {
  domain: string;
  data: Record<string, any>;
}

// Event Types for Motia
export interface MessageReceivedEvent {
  customerId: string;
  message: string;
  timestamp: number;
  sessionId?: string;
}

export interface IntentClassifiedEvent {
  conversationId: string;
  intent: IntentType;
  confidence: number;
  originalMessage: string;
}

export interface AgentMessageEvent {
  conversationId: string;
  agentType: AgentType;
  message: string;
  context: ConversationContext;
}

export interface HandoffEvent {
  conversationId: string;
  fromAgent: AgentType;
  toAgent: AgentType;
  reason: string;
  context: ConversationContext;
}

export interface MessageSendEvent {
  conversationId: string;
  message: string;
  agentType: AgentType;
  timestamp: number;
}