// eslint-disable-next-line import/extensions
import type { Tool } from '@mastra/core/tools';
// eslint-disable-next-line import/extensions
import { createTool } from '@mastra/core/tools';
import { ApifyClient, log } from 'apify';
import { z } from 'zod';

import { InstagramPosts, InstagramPostSchema, ContentStrategyAnalysisSchema, InstagramDataProcessor } from './models.js';

const instagramScraperInputSchema = z.object({
    handle: z.string().describe("Instagram handle to analyze for content strategy extraction (without the '@' symbol)."),
    maxPosts: z.number().default(50).describe('Number of recent posts to analyze for strategy patterns (recommended: 30-50).'),
});

const instagramScraperOutputSchema = z.object({
    contentStrategy: ContentStrategyAnalysisSchema.describe('Actionable content strategy framework with replicable implementation blueprint'),
});

// Define the Instagram Scraper Tool
export const instagramScraperTool: Tool<
    'instagram-content-strategy-analyzer',
    typeof instagramScraperInputSchema,
    typeof instagramScraperOutputSchema
> = createTool({
    id: 'instagram-content-strategy-analyzer',
    description: "Strategic content analysis tool that extracts actionable content strategy frameworks, posting patterns, engagement tactics, and replicable implementation blueprints from Instagram accounts.",
    inputSchema: instagramScraperInputSchema,
    outputSchema: instagramScraperOutputSchema,
    execute: async ({ context }) => {
        const token = process.env.APIFY_TOKEN;
        if (!token) {
            throw new Error('APIFY_TOKEN environment variable is missing!');
        }

        const { handle, maxPosts } = context;
        const apifyClient = new ApifyClient({ token });

        log.info(`Extracting content strategy framework from @${handle} using ${maxPosts} posts`);

        try {
            // Get posts for strategy analysis
            const postsRunInput = {
                directUrls: [`https://www.instagram.com/${handle}/`],
                resultsLimit: maxPosts,
                resultsType: 'posts',
                searchLimit: 1,
            };

            const postsRun = await apifyClient.actor('apify/instagram-scraper').call(postsRunInput);
            if (!postsRun) {
                throw new Error('Failed to start the Instagram posts scraper');
            }

            const postsDatasetId = postsRun.defaultDatasetId;
            const postsDataset = await apifyClient.dataset(postsDatasetId).listItems();
            const posts = postsDataset.items || [];

            log.info(`Retrieved ${posts.length} posts for content strategy analysis`);

            // Return raw posts data for AI agent to analyze and extract strategy
            // The AI agent will process this data and extract the strategic framework
            return {
                contentStrategy: {
                    rawPostsData: posts,
                    analysisInstructions: {
                        username: handle,
                        postsCount: posts.length,
                        analysisType: "content_strategy_extraction",
                        extractionGoals: [
                            "content_pillars_and_themes",
                            "posting_patterns_and_frequency",
                            "engagement_tactics",
                            "hashtag_strategies",
                            "voice_and_tone_analysis",
                            "content_pipeline_framework",
                            "replication_blueprint"
                        ]
                    }
                }
            };

        } catch (error) {
            log.error(`Error extracting content strategy for @${handle}:`, error);
            throw new Error(`Failed to extract content strategy: ${error}`);
        }
    },
});
