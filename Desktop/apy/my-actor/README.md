## TypeScript Mastra agent template

<!-- This is an Apify template readme -->

A template for [Mastra](https://mastra.ai/) projects in TypeScript for building AI agents with [Apify Actors](https://apify.com/actors). The template provides a basic structure and an example [agent](https://mastra.ai/docs/agents/00-overview) that calls [Actors](https://apify.com/actors) as tools in a workflow.

## How it works

An [agent](https://blog.apify.com/what-are-ai-agents/) is created and given a set of tools to accomplish a task. The agent receives a query from the user and decides which tools to use and in what order to complete the task. In this case, the agent is provided with an [Instagram Scraper Actor](https://apify.com/apify/instagram-scraper) to scrape Instagram profile posts. The agent produces textual output, which is saved to a dataset.

## How to use

Add or modify the agent tools in the `src/tools.ts` file, and make sure to include new tools in the agent tools list in `src/agents.ts`. Additionally, you can update the agent prompts in `src/agents.ts`. For more information, refer to the [Mastra agent documentation](https://mastra.ai/docs/agents/00-overview) and the [Mastra tools documentation](https://mastra.ai/docs/agents/02-adding-tools).

#### Pay Per Event

This template uses the [Pay Per Event (PPE)](https://docs.apify.com/platform/actors/publishing/monetize#pay-per-event-pricing-model) monetization model, which provides flexible pricing based on defined events.

To charge users, define events in JSON format and save them on the Apify platform. Here is an example schema with the `task-completed` event:

```json
[
    {
        "task-completed": {
            "eventTitle": "Task completed",
            "eventDescription": "Cost per query answered.",
            "eventPriceUsd": 0.1
        }
    }
]
```

In the Actor, trigger the event with:

```typescript
await Actor.charge({ eventName: 'task-completed' });
```

This approach allows you to programmatically charge users directly from your Actor, covering the costs of execution and related services, such as LLM input/output tokens.

To set up the PPE model for this Actor:

- **Configure the OpenAI API key environment variable**: provide your OpenAI API key to the `OPENAI_API_KEY` in the Actor's **Environment variables**.
- **Configure Pay Per Event**: establish the Pay Per Event pricing schema in the Actor's **Monetization settings**. First, set the **Pricing model** to `Pay per event` and add the schema. An example schema can be found in [pay_per_event.json](.actor/pay_per_event.json).

## Included features

- **[Apify SDK](https://docs.apify.com/sdk/js/)** for JavaScript - a toolkit for building Apify [Actors](https://apify.com/actors) and scrapers in JavaScript
- **[Input schema](https://docs.apify.com/platform/actors/development/input-schema)** - define and easily validate a schema for your Actor's input
- **[Dataset](https://docs.apify.com/sdk/js/docs/guides/result-storage#dataset)** - store structured data where each object stored has the same attributes
- **[Key-value store](https://docs.apify.com/platform/storage/key-value-store)** - store any kind of data, such as JSON documents, images, or text files

## Resources

- [What are AI agents?](https://blog.apify.com/what-are-ai-agents/)
- [TypeScript tutorials in Academy](https://docs.apify.com/academy/node-js)
- [Apify SDK documentation](https://docs.apify.com/sdk/js/)
- [Mastra documentation](https://mastra.ai/docs)
- [Integration with Make, GitHub, Zapier, Google Drive, and other apps](https://apify.com/integrations)


## Getting started

For complete information [see this article](https://docs.apify.com/platform/actors/development#build-actor-at-apify-console). In short, you will:

1. Build the Actor
2. Run the Actor

## Pull the Actor for local development

If you would like to develop locally, you can pull the existing Actor from Apify console using Apify CLI:

1. Install `apify-cli`

    **Using Homebrew**

    ```bash
    brew install apify-cli
    ```

    **Using NPM**

    ```bash
    npm -g install apify-cli
    ```

2. Pull the Actor by its unique `<ActorId>`, which is one of the following:
    - unique name of the Actor to pull (e.g. "apify/hello-world")
    - or ID of the Actor to pull (e.g. "E2jjCZBezvAZnX8Rb")

    You can find both by clicking on the Actor title at the top of the page, which will open a modal containing both Actor unique name and Actor ID.

    This command will copy the Actor into the current directory on your local machine.

    ```bash
    apify pull <ActorId>
    ```

## Documentation reference

To learn more about Apify and Actors, take a look at the following resources:

- [Apify SDK for JavaScript documentation](https://docs.apify.com/sdk/js)
- [Apify SDK for Python documentation](https://docs.apify.com/sdk/python)
- [Apify Platform documentation](https://docs.apify.com/platform)
- [Join our developer community on Discord](https://discord.com/invite/jyEM2PRvMU)
