/**
 * AI Service for PostWise-AI
 * Strictly uses Groq API (llama-3.3-70b-versatile) or OpenAI API (gpt-4o-mini)
 * with structured JSON generation.
 */

const https = require('https');

const PLATFORMS = ['Instagram', 'LinkedIn', 'X'];

function formatDateString(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Call LLM API (Groq API or OpenAI API)
async function callLLM({ prompt, groqApiKey, openAiApiKey }) {
  let hostname = 'api.groq.com';
  let path = '/openai/v1/chat/completions';
  let apiKey = groqApiKey;
  let model = 'openai/gpt-oss-120b';

  if (!groqApiKey && openAiApiKey) {
    hostname = 'api.openai.com';
    path = '/v1/chat/completions';
    apiKey = openAiApiKey;
    model = 'gpt-4o-mini';
  }

  if (!apiKey) {
    throw new Error('API Key missing: Please set GROQ_API or OPENAI_API_KEY in backend/.env file');
  }

  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert social media manager. Respond ONLY with a valid, clean JSON object matching the requested schema.'
        },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7
    });

    const options = {
      hostname: hostname,
      path: path,
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
            reject(new Error(`Failed to parse API JSON response: ${e.message}`));
          }
        } else {
          reject(new Error(`API returned status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(payload);
    req.end();
  });
}

/**
 * Main function: Generate ~30 posts directly via Groq API
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

  const groqApiKey = (process.env.GROQ_API || process.env.GROQ_API_KEY || '').trim();
  const openAiApiKey = (process.env.OPENAI_API_KEY || '').trim();

  if (!groqApiKey && !openAiApiKey) {
    throw new Error('API Key missing: Please set GROQ_API or OPENAI_API_KEY in backend/.env');
  }

  const apiProvider = groqApiKey ? 'Groq API (llama-3.3-70b-versatile)' : 'OpenAI API (gpt-4o-mini)';
  console.log(`[AI Service] Generating 30 posts directly via ${apiProvider}...`);

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

  const aiResponse = await callLLM({ prompt, groqApiKey, openAiApiKey });
  if (aiResponse && Array.isArray(aiResponse.posts) && aiResponse.posts.length > 0) {
    console.log(`[AI Service Success] Successfully generated ${aiResponse.posts.length} posts via API!`);
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

  throw new Error('AI API returned an invalid or empty response payload');
};

/**
 * Regenerate single post directly via Groq API
 */
const regenerateSinglePost = async ({ post, brand, customInstruction }) => {
  const brandName = brand.brandName || brand.name || 'Brand';
  const industry = brand.industry || 'Industry';
  const audience = brand.targetAudience || 'Audience';
  const platform = post.platform || 'Instagram';

  const groqApiKey = (process.env.GROQ_API || process.env.GROQ_API_KEY || '').trim();
  const openAiApiKey = (process.env.OPENAI_API_KEY || '').trim();

  if (!groqApiKey && !openAiApiKey) {
    throw new Error('API Key missing: Please set GROQ_API or OPENAI_API_KEY in backend/.env');
  }

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

  const aiResponse = await callLLM({ prompt, groqApiKey, openAiApiKey });
  if (aiResponse && aiResponse.caption) {
    return {
      idea: aiResponse.idea || `[Updated] ${post.idea}`,
      caption: aiResponse.caption,
      hashtags: Array.isArray(aiResponse.hashtags) ? aiResponse.hashtags : post.hashtags,
    };
  }

  throw new Error('AI API failed to regenerate post caption');
};

module.exports = {
  generateCalendarPosts,
  regenerateSinglePost,
};
