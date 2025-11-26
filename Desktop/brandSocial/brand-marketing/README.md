# Brand Marketing Skill

A comprehensive Claude skill for creating and managing brand marketing profiles to maintain consistency across all marketing materials.

## Quick Start

### 1. Activate the Skill

In Claude Code, use the skill by typing:
```
/skill brand-marketing
```

### 2. Create Your Brand Profile

You have two options:

**Option A: Start from Template**
- Copy `brand-profile-template.json` and customize it for your brand
- Save it as `your-brand-name.json` in your project

**Option B: Generate with Claude**
- Activate the skill and ask: "Create a brand profile for [your brand name]"
- Answer Claude's questions about your brand
- Claude will generate a complete JSON profile

### 3. Use Your Brand Profile

Once you have your brand profile, you can:

#### Generate Marketing Content
```
"Using the [brand-name] profile, create a social media post about [topic]"
"Generate email campaign for our new product launch"
"Write ad copy for [campaign] targeting [audience segment]"
```

#### Maintain Brand Consistency
```
"Check if this content aligns with our brand values"
"Review this copy for brand voice consistency"
"Suggest improvements to match our brand tone"
```

#### Plan Marketing Campaigns
```
"Create a content calendar for next month"
"Develop a campaign strategy for [objective]"
"Generate content ideas for our [content pillar]"
```

## Brand Profile Structure

Your brand profile JSON includes:

- **Brand Basics**: Name, tagline, mission, vision
- **Core Values**: What your brand stands for and how it's expressed
- **Brand Voice**: Tone, personality, do's and don'ts
- **Target Audience**: Demographics, psychographics, pain points, aspirations
- **Offers**: Products/services, pricing strategy, differentiators
- **Messaging**: Key messages, elevator pitch, brand story
- **Visual Identity**: Colors, typography, imagery guidelines
- **Competitive Positioning**: USP, market position, competitors
- **Channels**: Primary and secondary marketing channels
- **Content Pillars**: Themes for content creation
- **Campaigns**: Active or planned marketing campaigns

## Example Use Cases

### Social Media Management
```
"Create 5 Instagram posts for this week based on our content pillars"
"Write a LinkedIn thought leadership post about [industry topic]"
"Generate TikTok video scripts that match our brand voice"
```

### Email Marketing
```
"Draft a welcome email sequence for new subscribers"
"Create an abandoned cart email using our brand story"
"Write a re-engagement campaign for inactive customers"
```

### Content Marketing
```
"Outline a blog post about [topic] incorporating our core values"
"Create a landing page for [product] highlighting our differentiators"
"Write product descriptions that appeal to our target audience"
```

### Advertising
```
"Generate Google Ads copy for [campaign]"
"Create Facebook ad variations for A/B testing"
"Write a video ad script for [product launch]"
```

## Best Practices

1. **Keep Your Profile Updated**: Review and update your brand profile quarterly or when strategy changes
2. **Reference Specific Elements**: When requesting content, mention which part of the profile to emphasize
3. **A/B Test Messaging**: Generate multiple versions to test different approaches within your brand guidelines
4. **Channel Adaptation**: Same message, different formats - adapt your content while maintaining voice
5. **Save Successful Content**: Keep examples of high-performing content to inform future profile updates

## Tips for Better Results

- **Be Specific**: "Create an Instagram carousel about sustainability" is better than "make a social post"
- **Provide Context**: Mention the campaign, audience segment, or marketing objective
- **Request Variations**: Ask for multiple options to choose from
- **Iterate**: Refine content by asking for adjustments while staying within brand guidelines
- **Combine Elements**: Reference multiple profile sections for richer content (e.g., "using core values and target audience pain points")

## Profile Maintenance

### When to Update Your Profile

- Launching new products or services
- Rebranding or refreshing brand identity
- Entering new markets or targeting new audiences
- Shifts in competitive landscape
- Evolution of brand values or mission
- After major campaigns (incorporate learnings)

### How to Update

1. Open your brand profile JSON
2. Update relevant sections
3. Test new content generation with updated profile
4. Ensure consistency across all active campaigns

## Advanced Usage

### Multi-Brand Management
If managing multiple brands, create separate JSON profiles:
```
brand-profiles/
  ├── brand-a.json
  ├── brand-b.json
  └── brand-c.json
```

Reference specific profiles: "Using brand-a profile, create..."

### Campaign-Specific Profiles
Create focused profiles for specific campaigns by copying and customizing sections:
```
campaigns/
  ├── summer-launch-2024.json
  └── holiday-campaign-2024.json
```

### Integration with Other Tools
- Export generated content to your marketing tools
- Use the profile as a single source of truth for all teams
- Share with agencies or contractors for alignment

## Support

For questions or issues:
- Check the skill documentation: `brand-marketing.md`
- Review the template structure: `brand-profile-template.json`
- Ask Claude: "How do I [specific task] with the brand marketing skill?"

## Examples Folder Structure

Recommended organization:
```
your-project/
  ├── .claude/
  │   └── skills/
  │       ├── brand-marketing.md
  │       ├── brand-profile-template.json
  │       └── README.md
  ├── brand-profiles/
  │   └── your-brand.json
  ├── generated-content/
  │   ├── social-media/
  │   ├── email-campaigns/
  │   └── ad-copy/
  └── campaigns/
      └── [campaign-name]/
```

---

**Ready to get started?** Copy the template, customize it for your brand, and start creating consistent, on-brand marketing content with Claude!
