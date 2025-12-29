import { z } from 'zod';

// Enhanced Instagram post schema with complete data
export const InstagramPostSchema = z.object({
    id: z.string(),
    url: z.string(),
    caption: z.string().optional(),
    timestamp: z.string(),
    likesCount: z.number().optional(),
    commentsCount: z.number().optional(),
    type: z.enum(['photo', 'video', 'carousel']).optional(),
    hashtags: z.array(z.string()).optional(),
    mentions: z.array(z.string()).optional(),
    location: z.string().optional(),
});

export type InstagramPost = z.infer<typeof InstagramPostSchema>;

// Content Strategy Framework Schema
export const ContentStrategySchema = z.object({
    // Core Strategy Elements
    contentPillars: z.array(z.object({
        theme: z.string(),
        percentage: z.number(),
        examples: z.array(z.string()),
        engagement_performance: z.string()
    })),

    postingPattern: z.object({
        frequency: z.string(), // "daily", "3x/week", etc.
        bestTimes: z.array(z.string()),
        dayOfWeekPattern: z.record(z.string(), z.number()) // Monday: 2, Tuesday: 1, etc.
    }),

    contentFormats: z.object({
        carousel_posts: z.number(),
        single_images: z.number(),
        videos: z.number(),
        text_heavy: z.number()
    }),

    engagementTactics: z.array(z.object({
        tactic: z.string(),
        frequency: z.string(),
        effectiveness: z.string()
    })),

    hashtagStrategy: z.object({
        brandHashtags: z.array(z.string()),
        industryHashtags: z.array(z.string()),
        communityHashtags: z.array(z.string()),
        avgHashtagsPerPost: z.number()
    }),

    voiceAndTone: z.object({
        personality: z.array(z.string()), // ["professional", "friendly", "authoritative"]
        languagePatterns: z.array(z.string()),
        emojiUsage: z.string()
    })
});

// Actionable Content Pipeline Schema
export const ContentPipelineSchema = z.object({
    // Content Creation Framework
    ideationSources: z.array(z.string()),
    contentTypes: z.array(z.object({
        type: z.string(),
        purpose: z.string(),
        frequency: z.string(),
        template: z.string()
    })),

    // Publishing Schedule
    weeklySchedule: z.record(z.string(), z.array(z.string())), // "Monday": ["product_update", "behind_scenes"]

    // Engagement Framework
    communityManagement: z.object({
        responsePattern: z.string(),
        engagementInitiators: z.array(z.string()),
        communityBuilding: z.array(z.string())
    }),

    // Growth Tactics
    growthMechanisms: z.array(z.object({
        mechanism: z.string(),
        implementation: z.string(),
        frequency: z.string()
    })),

    // Performance Framework
    kpis: z.array(z.string()),
    benchmarks: z.record(z.string(), z.number()),

    // Replicable Framework
    implementationGuide: z.object({
        quickWins: z.array(z.string()),
        monthlyGoals: z.array(z.string()),
        requiredResources: z.array(z.string())
    })
});

// Complete Strategic Analysis
export const ContentStrategyAnalysisSchema = z.object({
    username: z.string(),
    strategy: ContentStrategySchema,
    pipeline: ContentPipelineSchema,
    competitiveAdvantages: z.array(z.string()),
    replicationBlueprint: z.object({
        phase1_foundation: z.array(z.string()),
        phase2_content: z.array(z.string()),
        phase3_growth: z.array(z.string())
    }),
    analyzedAt: z.string()
});

export type ContentStrategyAnalysis = z.infer<typeof ContentStrategyAnalysisSchema>;
export type ContentStrategy = z.infer<typeof ContentStrategySchema>;
export type ContentPipeline = z.infer<typeof ContentPipelineSchema>;

export const InstagramPostsSchema = z.object({
    root: z.array(InstagramPostSchema),
});

export type InstagramPosts = z.infer<typeof InstagramPostsSchema>;

export const InstagramPosts = {
    fromRaw: (data: unknown[]): InstagramPosts => {
        const validated = InstagramPostsSchema.parse({ root: data });
        return validated;
    },
};

// Helper functions for enhanced data processing
export const InstagramDataProcessor = {
    extractHashtags: (caption: string): string[] => {
        const hashtagRegex = /#[a-zA-Z0-9_]+/g;
        return caption.match(hashtagRegex) || [];
    },

    extractMentions: (caption: string): string[] => {
        const mentionRegex = /@[a-zA-Z0-9._]+/g;
        return caption.match(mentionRegex) || [];
    },

    calculateEngagementRate: (avgLikes: number, avgComments: number, followers: number): number => {
        if (followers === 0) return 0;
        return ((avgLikes + avgComments) / followers) * 100;
    }
};
