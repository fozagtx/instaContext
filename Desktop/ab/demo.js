#!/usr/bin/env node

/**
 * Demo Script for AI Customer Support System
 *
 * This script demonstrates the multi-agent customer support system
 * by sending test messages and showing the agent handoff flow.
 */

const BASE_URL = 'http://localhost:3000';

async function sendMessage(customerId, message, sessionId = null) {
  const payload = {
    customerId,
    message,
    ...(sessionId && { sessionId })
  };

  try {
    const response = await fetch(`${BASE_URL}/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (response.ok) {
      console.log(`✅ Message sent successfully`);
      console.log(`📧 Customer ${customerId}: ${message}`);
      console.log(`🆔 Conversation ID: ${result.conversationId}`);
      console.log('---');
      return result.conversationId;
    } else {
      console.error('❌ Error sending message:', result);
      return null;
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
    return null;
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function demoScenario1() {
  console.log('🎬 Demo Scenario 1: Sales → Tech Handoff');
  console.log('=====================================');

  const customerId = 'demo1';

  // Initial sales inquiry
  const conversationId = await sendMessage(customerId, 'I want to upgrade my plan to get more features');
  if (!conversationId) return;

  await sleep(3000); // Wait for processing

  // Technical question that should trigger handoff
  await sendMessage(customerId, 'Will my data migrate automatically during the upgrade?', conversationId);

  await sleep(2000);
  console.log('✨ Expected: Sales agent → Technical agent handoff\n');
}

async function demoScenario2() {
  console.log('🎬 Demo Scenario 2: Billing → Sales Loop');
  console.log('======================================');

  const customerId = 'demo2';

  // Initial billing inquiry
  const conversationId = await sendMessage(customerId, 'I have a question about my invoice this month');
  if (!conversationId) return;

  await sleep(3000);

  // Sales opportunity
  await sendMessage(customerId, 'Actually, I want to upgrade to get more storage space', conversationId);

  await sleep(2000);
  console.log('✨ Expected: Billing agent → Sales agent handoff\n');
}

async function demoScenario3() {
  console.log('🎬 Demo Scenario 3: Complex Multi-Agent Flow');
  console.log('===========================================');

  const customerId = 'demo3';

  // Billing issue
  const conversationId = await sendMessage(customerId, 'I was charged twice for my subscription this month');
  if (!conversationId) return;

  await sleep(3000);

  // Technical problem
  await sendMessage(customerId, 'Also, the billing dashboard won\'t load for me', conversationId);

  await sleep(3000);

  // Sales opportunity
  await sendMessage(customerId, 'Once this is resolved, I\'d like to discuss upgrading my plan', conversationId);

  await sleep(2000);
  console.log('✨ Expected: Billing → Technical → Sales agent flow\n');
}

async function demoIntent() {
  console.log('🎬 Demo: Intent Classification');
  console.log('=============================');

  const testMessages = [
    { customer: 'intent1', message: 'How much does the Pro plan cost?', expected: 'Sales' },
    { customer: 'intent2', message: 'My app keeps crashing when I try to sync', expected: 'Technical' },
    { customer: 'intent3', message: 'I need a refund for my last payment', expected: 'Billing' },
    { customer: 'intent4', message: 'Hello, what does your company do?', expected: 'Sales/General' }
  ];

  for (const test of testMessages) {
    console.log(`📧 Customer ${test.customer}: ${test.message}`);
    console.log(`🔮 Expected route: ${test.expected}`);

    await sendMessage(test.customer, test.message);
    await sleep(1500);
    console.log('---');
  }
  console.log('');
}

async function main() {
  console.log('🤖 AI Customer Support System - Demo Script');
  console.log('===========================================');
  console.log(`📡 Testing server at: ${BASE_URL}`);
  console.log('');

  // Check if server is running
  try {
    const response = await fetch(`${BASE_URL}/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId: 'test', message: 'health check' })
    });
    console.log('✅ Server is running and responding');
  } catch (error) {
    console.log('❌ Server is not responding. Please start the server with: bun run dev');
    process.exit(1);
  }

  console.log('');
  console.log('💡 Tip: Open http://localhost:3000/workbench to monitor agent interactions');
  console.log('');

  // Run demo scenarios
  await demoIntent();
  await sleep(2000);

  await demoScenario1();
  await sleep(3000);

  await demoScenario2();
  await sleep(3000);

  await demoScenario3();

  console.log('🎉 Demo completed!');
  console.log('');
  console.log('📊 Check the Motia Workbench for detailed conversation flows:');
  console.log('   http://localhost:3000/workbench');
  console.log('');
  console.log('🔧 Logs will show agent responses and handoff decisions in your terminal');
}

// Run the demo
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { sendMessage, demoScenario1, demoScenario2, demoScenario3 };