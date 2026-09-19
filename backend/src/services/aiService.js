/**
 * AI Service for PostWise-AI
 * Supports OpenAI API (gpt-4o-mini / gpt-3.5-turbo) with structured JSON generation,
 * and smart contextual mock mode fallback when key is absent or API fails.
 */

const https = require('https');

const PLATFORMS = ['Instagram', 'LinkedIn', 'X'];
const POST_TYPES = ['Educational', 'Promotional', 'Behind-the-Scenes', 'Interactive', 'Thought Leadership'];

const TOPIC_TEMPLATES = [
  { postType: 'Educational', idea: '5 Essential Strategies for Mastering {niche}' },
  { postType: 'Behind-the-Scenes', idea: 'How {brandName} tackles challenges in {industry}' },
  { postType: 'Interactive', idea: 'Poll: What is your #1 bottleneck in {niche} right now?' },
  { postType: 'Thought Leadership', idea: 'The Future of {industry}: Trends every {audience} should prepare for' },
  { postType: 'Promotional', idea: 'Transform your {niche} with {brandName} solutions' },
  { postType: 'Educational', idea: 'Step-by-step guide to optimizing your {niche} workflow' },
  { postType: 'Thought Leadership', idea: 'Unpopular Opinion: Why traditional approaches to {niche} fail' },
  { postType: 'Behind-the-Scenes', idea: 'A day in the life building {brandName}' },
  { postType: 'Interactive', idea: 'Drop your biggest question about {niche} below! 👇' },
  { postType: 'Promotional', idea: 'Case Study: How we helped {audience} double their {niche} results' }
];

const CAPTION_GEN = {
  Instagram: (brand, idea, niche, audience) =>
    `✨ ${idea} ✨\n\nAt ${brand}, we know how important ${niche} is for every ${audience}. Here is your daily dose of actionable value:\n\n1️⃣ Keep it simple\n2️⃣ Focus on consistency\n3️⃣ Measure real impact\n\nWhat is your go-to method? Drop a comment below and tag a friend! 👇💬`,

  LinkedIn: (brand, idea, niche, audience) =>
    `In today's fast-moving ${niche} landscape, leaders must prioritize strategic execution.\n\n${idea}\n\nKey takeaways for ${audience}:\n• Benchmark your progress regularly\n• Automate repetitive tasks\n• Deliver authentic value at scale\n\nHow is your organization approaching ${niche} this quarter? Let's connect in the comments.`,

  X: (brand, idea, niche, audience) =>
    `🔥 Quick thought on ${niche}:\n\n${idea}.\n\nIf you are a ${audience}, focus on consistency over perfection. 🚀\n\nRepost if you agree!`,
};

function formatDateString(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Call OpenAI API via HTTPS request
async function callOpenAI(prompt, apiKey) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert social media manager. Respond ONLY with valid JSON string matching the specified format.'
        },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7
    });

    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(data);
            const contentStr = parsed.choices[0].message.content;
            resolve(JSON.parse(contentStr));
          } catch (e) {
            reject(new Error('Failed to parse OpenAI JSON response'));
          }
        } else {
          reject(new Error(`OpenAI API returned status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(payload);
    req.end();
  });
}

/**
 * Main function: Generate ~30 posts
 */
const generateCalendarPosts = async ({ brand, startDate, month, year }) => {
  const brandName = brand.brandName || brand.name || 'Our Brand';
  const industry = brand.industry || 'General';
  const audience = brand.targetAudience || 'General Audience';
  const tone = brand.tone || 'Professional';
  const goals = brand.postingGoals || brand.goals || 'Growth & Engagement';

  const start = startDate ? new Date(startDate) : new Date();
  if (isNaN(start.getTime())) {
    start = new Date();
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey && apiKey.trim() && apiKey.startsWith('sk-')) {
    try {
      console.log('[AI Service] Generating 30 posts via OpenAI API...');
      const prompt = `
Generate a 30-day social media content calendar for:
Brand Name: "${brandName}"
Industry: "${industry}"
Target Audience: "${audience}"
Tone of Voice: "${tone}"
Posting Goals: "${goals}"
Start Date: "${formatDateString(start)}"

Requirements:
- Generate exactly 30 posts starting from Start Date.
- Platforms to cycle across: "Instagram", "LinkedIn", "X".
- Instagram posts MUST be conversational with emojis and a clear Call-To-Action (CTA).
- LinkedIn posts MUST be professional and value-focused.
- X posts MUST be concise and punchy.
- Return a JSON object with key "posts" which is an array of 30 post objects.
- Each post object format:
{
  "date": "YYYY-MM-DD",
  "platform": "Instagram" | "LinkedIn" | "X",
  "postType": "Educational" | "Promotional" | "Behind-the-Scenes" | "Interactive" | "Thought Leadership",
  "idea": "Short title or post topic idea",
  "caption": "Full post caption text according to platform tone",
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"]
}
`;

      const aiResponse = await callOpenAI(prompt, apiKey);
      if (aiResponse && Array.isArray(aiResponse.posts) && aiResponse.posts.length > 0) {
        return aiResponse.posts.map((p, i) => {
          const postDate = new Date(start);
          postDate.setDate(postDate.getDate() + i);
          return {
            date: postDate,
            platform: p.platform || PLATFORMS[i % PLATFORMS.length],
            postType: p.postType || 'Educational',
            idea: p.idea || `Day ${i + 1} Idea for ${brandName}`,
            caption: p.caption || `Post caption for ${brandName}`,
            hashtags: Array.isArray(p.hashtags) ? p.hashtags : [`#${brandName.replace(/\s+/g, '')}`, '#ContentStrategy'],
            status: i < 3 ? 'scheduled' : 'draft',
          };
        });
      }
    } catch (error) {
      console.warn(`[AI Service Warning] OpenAI API call failed (${error.message}). Switching seamlessly to Mock Mode fallback.`);
    }
  }

  // Fallback Mock Mode (Smart Contextual Generator)
  console.log('[AI Service] Operating in Mock Mode generator...');
  const posts = [];

  for (let i = 0; i < 30; i++) {
    const postDate = new Date(start);
    postDate.setDate(postDate.getDate() + i);

    const platform = PLATFORMS[i % PLATFORMS.length];
    const template = TOPIC_TEMPLATES[i % TOPIC_TEMPLATES.length];

    const idea = template.idea
      .replace('{brandName}', brandName)
      .replace('{niche}', industry)
      .replace('{audience}', audience)
      .replace('{industry}', industry);

    const captionFn = CAPTION_GEN[platform] || CAPTION_GEN.Instagram;
    const caption = captionFn(brandName, idea, industry, audience);

    const hashtags = [
      `#${brandName.replace(/\s+/g, '')}`,
      `#${industry.replace(/\s+/g, '')}`,
      `#${platform.replace(/[^a-zA-Z]/g, '')}`,
      '#ContentStrategy',
      '#PostWiseAI'
    ];

    posts.push({
      date: postDate,
      platform,
      postType: template.postType,
      idea,
      caption,
      hashtags,
      status: i < 3 ? 'scheduled' : 'draft',
    });
  }

  return posts;
};

/**
 * Regenerate single post
 */
const regenerateSinglePost = async ({ post, brand, customInstruction }) => {
  const brandName = brand.brandName || brand.name || 'Brand';
  const industry = brand.industry || 'Industry';
  const audience = brand.targetAudience || 'Audience';
  const platform = post.platform || 'Instagram';

  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey && apiKey.trim() && apiKey.startsWith('sk-')) {
    try {
      const prompt = `
Regenerate a single social media post for:
Brand Name: "${brandName}"
Industry: "${industry}"
Platform: "${platform}"
Existing Idea: "${post.idea}"
Custom Instruction: "${customInstruction || 'Make it fresh and highly engaging'}"

Platform rules:
- Instagram -> conversational, emojis, CTA
- LinkedIn -> professional, value-focused
- X -> concise, punchy

Return JSON:
{
  "idea": "Updated post title/idea",
  "caption": "Fresh regenerated caption",
  "hashtags": ["#tag1", "#tag2", "#tag3"]
}
`;
      const aiResponse = await callOpenAI(prompt, apiKey);
      if (aiResponse && aiResponse.caption) {
        return {
          idea: aiResponse.idea || `[Updated] ${post.idea}`,
          caption: aiResponse.caption,
          hashtags: Array.isArray(aiResponse.hashtags) ? aiResponse.hashtags : post.hashtags,
        };
      }
    } catch (e) {
      console.warn('[AI Service Warning] Single post regeneration via OpenAI failed, using fallback.');
    }
  }

  // Fallback Single Post Generator
  const captionFn = CAPTION_GEN[platform] || CAPTION_GEN.Instagram;
  const newIdea = `[Updated] ${post.idea.replace('[Updated] ', '')}`;
  let newCaption = captionFn(brandName, newIdea, industry, audience);

  if (customInstruction) {
    newCaption += `\n\n💡 Focus Note: ${customInstruction}`;
  }

  return {
    idea: newIdea,
    caption: newCaption,
    hashtags: [`#${brandName.replace(/\s+/g, '')}`, `#${industry.replace(/\s+/g, '')}`, '#PostWiseAI'],
  };
};

module.exports = {
  generateCalendarPosts,
  regenerateSinglePost,
};
