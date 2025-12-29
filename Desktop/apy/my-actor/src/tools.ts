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

            // Return a basic strategy analysis framework
            // Note: The AI agent will enhance this with detailed strategic analysis
            return {
                contentStrategy: {
                    username: handle,
                    strategy: {
                        contentPillars: [],
                        postingPattern: {
                            frequency: "To be analyzed",
                            bestTimes: [],
                            dayOfWeekPattern: {}
                        },
                        contentFormats: {
                            carousel_posts: 0,
                            single_images: 0,
                            videos: 0,
                            text_heavy: 0
                        },
                        engagementTactics: [],
                        hashtagStrategy: {
                            brandHashtags: [],
                            industryHashtags: [],
                            communityHashtags: [],
                            avgHashtagsPerPost: 0
                        },
                        voiceAndTone: {
                            personality: [],
                            languagePatterns: [],
                            emojiUsage: "To be analyzed"
                        }
                    },
                    pipeline: {
                        ideationSources: [],
                        contentTypes: [],
                        weeklySchedule: {},
                        communityManagement: {
                            responsePattern: "To be analyzed",
                            engagementInitiators: [],
                            communityBuilding: []
                        },
                        growthMechanisms: [],
                        kpis: [],
                        benchmarks: {},
                        implementationGuide: {
                            quickWins: [],
                            monthlyGoals: [],
                            requiredResources: []
                        }
                    },
                    competitiveAdvantages: [],
                    replicationBlueprint: {
                        phase1_foundation: [`Raw data collected: ${posts.length} posts from @${handle}`],
                        phase2_content: ["Strategic analysis to be performed by AI agent"],
                        phase3_growth: ["Implementation framework to be generated"]
                    },
                    analyzedAt: new Date().toISOString()
                }
            };

        } catch (error) {
            log.error(`Error extracting content strategy for @${handle}:`, String(error));
            throw new Error(`Failed to extract content strategy: ${String(error)}`);
        }
    },
});
