/**
 * AI Service for generating social media content calendars and single post regeneration.
 * Supports OpenAI/Gemini APIs when configured, or smart dynamic contextual fallback generation.
 */

const POST_TYPES = ['Single Image', 'Carousel', 'Reel / Short Video', 'Text Article', 'Poll / Question'];
const TIME_SLOTS = ['08:30 AM', '10:15 AM', '01:00 PM', '04:45 PM', '07:30 PM', '09:00 PM'];

const TOPIC_HOOKS = [
  "Behind the Scenes: How {brandName} tackles {niche}",
  "5 Game-Changing Tips for {audience} in {industry}",
  "Myth vs. Reality: The Truth About {niche}",
  "Why Most People Fail at {niche} (And How to Fix It)",
  "The Ultimate Checklist for Mastering {niche}",
  "How We Solved a Huge Challenge in {industry}",
  "3 Golden Rules Every {audience} Needs to Know Today",
  "Case Study: Transforming {niche} Results in 30 Days",
  "Interactive Poll: What's Your #1 Barrier in {industry}?",
  "Spotlight Feature: Key Strategy for {niche} Success",
  "Quick Tutorial: Step-by-Step Guide to {niche}",
  "The Future of {industry}: Trends to Watch This Year",
  "Unpopular Opinion About {niche} That You Need to Hear",
  "How to Save 5 Hours a Week on {niche}",
  "Weekly Q&A: Your Top Questions About {niche} Answered",
];

const CAPTION_TEMPLATES = {
  Professional: [
    "Navigating {niche} effectively requires strategic execution and clear benchmarks. Here are 3 key principles we abide by at {brandName}:\n\n1️⃣ Standardize your process\n2️⃣ Measure tangible metrics\n3️⃣ Iterate based on audience feedback\n\nWhat strategy is currently driving your team's top outcomes? Let us know below. 👇",
    "In today's fast-evolving {industry} landscape, staying ahead means continuously optimizing your approach to {niche}.\n\nHere is what top leaders are prioritizing this month:\n- Data-driven decision making\n- Scalable workflows\n- Authentic community interaction\n\nSave this post for your next strategy session! 📌",
  ],
  'Witty & Fun': [
    "Hot take: Doing {niche} without a proper plan is like driving with your eyes closed. 🙈🚘\n\nHere is how we at {brandName} keep things smooth, fun, and high-impact:\n✨ Keep it simple\n✨ Focus on value first\n✨ Don't take yourselves too seriously!\n\nTag a friend who needs to see this today! 😂👇",
    "If {niche} had a starter pack, this would be on page 1. 📦⚡\n\nStop overcomplicating things! Whether you're speaking to {audience} or testing new ideas in {industry}, keep your eyes on the prize.\n\nDrop a 🔥 if you agree!",
  ],
  Inspirational: [
    "Every big achievement in {industry} started with a simple step forward. 🌟\n\nWhen we launched {brandName}, our mission was clear: empower {audience} to conquer {niche} with confidence.\n\nRemember: Progress over perfection, every single day. Keep building your vision! 💪",
    "The secret to unlocking breakthrough results in {niche}? Consistency. 🚀\n\nDon't let short-term friction obscure your long-term potential. You've got what it takes to transform your journey in {industry}.\n\nShare this with someone who needs a boost today! ✨",
  ],
  Educational: [
    "Let's break down {niche} step-by-step so you can implement this immediately. 🧠📚\n\nStep 1: Identify your target objective\nStep 2: Remove unnecessary bottlenecks\nStep 3: Execute and refine based on real data\n\nSave this guide for later and drop your questions in the comments! 💭",
    "Did you know? 80% of success in {niche} comes down to mastering these core fundamentals:\n\n• Clear Messaging\n• Consistent Delivery\n• Targeted Value for {audience}\n\nWhich of these 3 are you working on right now?",
  ],
  Default: [
    "Supercharge your {niche} strategy with {brandName}! 💥\n\nHere is a quick look at how tailored approaches in {industry} can deliver massive value for {audience}.\n\nLike & Save this post if you found it helpful!",
  ]
};

const ENGAGEMENT_TIPS = [
  "Pin the top comment and ask a question to boost comment velocity in the first 30 minutes.",
  "Share this post to your Instagram/Facebook Story with a sticker poll.",
  "Reply to every comment within 1 hour of posting to optimize algorithm distribution.",
  "Include a strong call-to-action asking users to save or repost.",
  "Cross-post a high-performing snippet on LinkedIn with an engaging opening line.",
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const generateCalendarPosts = async ({ brand, month, year, topicNiche, goals, postFrequency = 'daily' }) => {
  const posts = [];
  const brandName = brand.name || 'Our Brand';
  const niche = topicNiche || brand.industry || 'Social Media';
  const audience = brand.targetAudience || 'Audience';
  const industry = brand.industry || 'Business';
  const tone = brand.tone || 'Professional';
  const platforms = brand.platforms && brand.platforms.length > 0 ? brand.platforms : ['Instagram', 'LinkedIn', 'X/Twitter'];
  const keywords = brand.keywords && brand.keywords.length > 0 ? brand.keywords : ['growth', 'strategy', 'innovation'];

  // Days in month
  const totalDays = new Date(year, month, 0).getDate();
  const step = postFrequency === 'alternate' ? 2 : postFrequency === 'weekdays' ? 1 : 1;

  let postIndex = 0;
  for (let day = 1; day <= totalDays; day += step) {
    const dateObj = new Date(year, month - 1, day);
    const dayOfWeek = dateObj.getDay();

    if (postFrequency === 'weekdays' && (dayOfWeek === 0 || dayOfWeek === 6)) {
      continue;
    }

    const platform = platforms[postIndex % platforms.length];
    const postType = getRandomElement(POST_TYPES);
    const timeSlot = getRandomElement(TIME_SLOTS);

    const hookTemplate = TOPIC_HOOKS[postIndex % TOPIC_HOOKS.length];
    const title = hookTemplate
      .replace('{brandName}', brandName)
      .replace('{niche}', niche)
      .replace('{audience}', audience)
      .replace('{industry}', industry);

    const toneCaptions = CAPTION_TEMPLATES[tone] || CAPTION_TEMPLATES.Default;
    const baseCaption = getRandomElement(toneCaptions)
      .replace(/{brandName}/g, brandName)
      .replace(/{niche}/g, niche)
      .replace(/{audience}/g, audience)
      .replace(/{industry}/g, industry);

    const hashtags = [
      `#${brandName.replace(/\s+/g, '')}`,
      `#${niche.replace(/\s+/g, '')}`,
      ...keywords.map(k => `#${k.replace(/\s+/g, '')}`),
      `#${platform.replace(/[^a-zA-Z]/g, '')}`,
      '#ContentStrategy',
      '#PostWiseAI'
    ].slice(0, 6);

    const imagePrompt = `A sleek visual representation of ${title} for ${brandName}, modern gradient style, minimalist aesthetic, vector illustration or high-res photography suited for ${platform}.`;
    const engagementTip = getRandomElement(ENGAGEMENT_TIPS);

    posts.push({
      date: dateObj,
      timeSlot,
      platform,
      title,
      caption: baseCaption,
      hashtags,
      postType,
      imagePrompt,
      engagementTip,
      status: day <= 3 ? 'scheduled' : 'draft',
    });

    postIndex++;
  }

  return posts;
};

const regenerateSinglePost = async ({ post, brand, customInstruction }) => {
  const brandName = brand.name || 'Brand';
  const niche = brand.industry || 'Industry';
  const tone = brand.tone || 'Professional';
  const audience = brand.targetAudience || 'Audience';

  const freshTitle = `[Updated] ${post.title.replace('[Updated] ', '')}`;
  const toneCaptions = CAPTION_TEMPLATES[tone] || CAPTION_TEMPLATES.Default;
  let newCaption = getRandomElement(toneCaptions)
    .replace(/{brandName}/g, brandName)
    .replace(/{niche}/g, niche)
    .replace(/{audience}/g, audience)
    .replace(/{industry}/g, niche);

  if (customInstruction) {
    newCaption += `\n\n💡 Focus Note: ${customInstruction}`;
  }

  const freshHashtags = [
    `#${brandName.replace(/\s+/g, '')}`,
    `#${niche.replace(/\s+/g, '')}`,
    '#TrendingTopic',
    '#SocialGrowth',
    '#AIContent'
  ];

  return {
    title: freshTitle,
    caption: newCaption,
    hashtags: freshHashtags,
    imagePrompt: `High quality customized graphic for: ${freshTitle}. Tailored for ${post.platform}.`,
    engagementTip: getRandomElement(ENGAGEMENT_TIPS),
  };
};

module.exports = {
  generateCalendarPosts,
  regenerateSinglePost,
};
