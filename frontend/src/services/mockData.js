// Realistic Mock Data & AI Generation Engine for PostWise-AI

export const DEFAULT_USER = {
  _id: 'usr_demo_101',
  name: 'Alex Morgan',
  email: 'alex@ecoglow.io',
  role: 'Content Strategist',
  company: 'EcoGlow Wellness',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

export const INITIAL_BRANDS = [
  {
    _id: 'brand_ecoglow_1',
    name: 'EcoGlow Wellness',
    niche: 'Sustainable Living & Mindful Yoga',
    targetAudience: 'Health-conscious professionals, eco-minded millennials, mindfulness practitioners (ages 24-42)',
    tone: 'Inspirational, warm, grounded, empowering',
    postingGoals: 'Build high-trust community, share practical daily wellness routines, promote eco-friendly cork mats, drive webinar signups',
    platforms: ['Instagram', 'LinkedIn', 'X/Twitter'],
    handles: {
      instagram: '@ecoglow.wellness',
      linkedin: 'EcoGlow Global',
      twitter: '@EcoGlowLife',
    },
    color: '#059669', // Emerald
    badge: 'Eco Living',
  },
  {
    _id: 'brand_nexus_2',
    name: 'NexusAI Cloud',
    niche: 'Developer Tools & Cloud Infrastructure',
    targetAudience: 'Full-stack developers, engineering leads, DevOps teams building microservices',
    tone: 'Authoritative, witty, analytical, builder-first',
    postingGoals: 'Share architecture benchmarks, highlight latency optimizations, build hype for v2 API launch',
    platforms: ['LinkedIn', 'X/Twitter'],
    handles: {
      instagram: '@nexusai_hq',
      linkedin: 'NexusAI Systems',
      twitter: '@nexusai_dev',
    },
    color: '#4f46e5', // Indigo
    badge: 'B2B SaaS',
  },
  {
    _id: 'brand_velvet_3',
    name: 'Velvet Bean Roasters',
    niche: 'Artisanal Specialty Coffee & Cold Brew',
    targetAudience: 'Coffee connoisseurs, remote creatives, boutique cafe visitors',
    tone: 'Playful, sensory-rich, cozy, authentic',
    postingGoals: 'Educate on pour-over ratios, spotlight ethically sourced single-origin farmers, drive roast club subscriptions',
    platforms: ['Instagram', 'X/Twitter'],
    handles: {
      instagram: '@velvetbeancoffee',
      linkedin: 'Velvet Bean Specialty Roasters',
      twitter: '@VelvetBeanCo',
    },
    color: '#d97706', // Amber
    badge: 'Lifestyle & D2C',
  },
];

// Helper to format ISO date YYYY-MM-DD
export const getMonthDate = (year, monthIndex, day) => {
  const d = new Date(year, monthIndex, day);
  return d.toISOString().split('T')[0];
};

// Preset Content Templates for different platforms
const INSTAGRAM_IDEAS = [
  {
    title: '5-Minute Morning Reset Habit',
    caption: `Stop checking your emails before your feet touch the floor. 🧘‍♀️✨\n\nHere's a 3-step morning ritual that will transform your focus today:\n1. 60 seconds of box breathing (in 4, hold 4, out 4)\n2. A glass of lukewarm water with lemon\n3. 3 quick gratitude bullets written on paper\n\nSmall mindful pauses compound into massive peace of mind. Have you taken your first deep breath today?\n\nSave this for tomorrow morning! 🌿`,
    hashtags: ['#MorningRoutine', '#MindfulLiving', '#WellnessJourney', '#HolisticHealth', '#InnerCalm'],
    postType: 'Carousel',
    imagePrompt: 'A serene minimalist wooden bedside table with a steam cup of herbal tea, open notebook, and morning sunlight.',
    engagementTip: 'Ask followers in your Stories which habit is hardest for them to stick to.',
  },
  {
    title: 'Behind the Scenes: Sustainable Cork Studio Mats',
    caption: `Ever wonder what goes into making 100% biodegradable yoga gear? 🌍📦\n\nFrom FSC-certified organic rubber to laser-etched alignment guides—no toxic PVCs, zero harmful glues. Just pure nature under your palms.\n\nSwipe through to see our local artisans in Portugal hand-inspecting the latest harvest batch! Which colorway is your favorite? 👇`,
    hashtags: ['#SustainableDesign', '#ZeroWasteLiving', '#EcoFriendlyProducts', '#YogaCommunity', '#ConsciousConsumer'],
    postType: 'Single Image',
    imagePrompt: 'Close up textured shot of organic Portuguese cork yoga mat rolled beside eucalyptus sprigs in bright natural studio.',
    engagementTip: 'Tag the artisan in the post and use product tag stickers for direct shopping.',
  },
  {
    title: 'Myth Busted: You Don’t Need Flexibility for Yoga',
    caption: `Saying "I'm not flexible enough for yoga" is like saying "I'm too dirty to take a bath." 🛁😂\n\nYoga isn't about touching your toes—it's about what you discover on the way down.\n\nDrop a ❤️ if you needed this reminder to unroll your mat today!`,
    hashtags: ['#YogaMythBusters', '#YogaForBeginners', '#MovementIsMedicine', '#DailyMovement', '#YogaEveryDay'],
    postType: 'Reel / Short Video',
    imagePrompt: 'A friendly instructor laughing warmly while holding an accessible child pose using supportive blocks.',
    engagementTip: 'Add an audio trending sound under 30 seconds for viral algorithmic reach.',
  },
  {
    title: 'Weekend Digital Detox Challenge',
    caption: `Challenge accepted? 📵 Sunday afternoon: 3 hours with ZERO screens.\n\nInstead:\n📖 Read a chapter in physical print\n🚶 Take an unplugged walk in nature\n🍵 Brew a slow tea and just listen to the rain\n\nComment "I'M IN" below to hold yourself accountable! 👇`,
    hashtags: ['#DigitalDetox', '#SlowLiving', '#Unplugged', '#MentalHealthMatters', '#MindfulnessPractice'],
    postType: 'Single Image',
    imagePrompt: 'A cozy reading nook by a rain-streaked window with wool blanket and acoustic guitar resting nearby.',
    engagementTip: 'Pin the best participant comments to build community camaraderie.',
  },
  {
    title: 'Breathwork Technique for Instant Stress Relief',
    caption: `Feeling overwhelmed right now? Try physiological sighing (backed by Stanford neuroscience):\n\n💨 Two quick sharp inhales through your nose\n💨 One long, slow exhale through your mouth\n\nRepeat 3 times. Notice your heart rate dropping immediately. Save this reel for when work gets hectic! 🫁`,
    hashtags: ['#Breathwork', '#StressReliefTips', '#NeuroscienceHacks', '#CalmMind', '#SelfCareTips'],
    postType: 'Reel / Short Video',
    imagePrompt: 'Clean visual infographic showing lung expansion with soothing sage green color palette.',
    engagementTip: 'Put the step-by-step instructions in the caption so users save and re-read.',
  },
];

const LINKEDIN_IDEAS = [
  {
    title: 'The Hidden ROI of Corporate Wellness Programs',
    caption: `Burnout isn't a badge of honor. It's an executive balance sheet leak.\n\nOver the past 6 months, our team partnered with 14 tech firms to track employee retention before and after introducing 15-minute guided mindfulness breaks:\n\n• 28% drop in reported afternoon fatigue\n• 19% reduction in unplanned sick leaves\n• 4.2x higher peer-to-peer appreciation notes\n\nHigh performance isn't about working 70-hour weeks. It's about sustainable energy management.\n\nLeaders: how does your organization encourage real cognitive recovery during crunch quarters?`,
    hashtags: ['#Leadership', '#WorkplaceWellness', '#EmployeeRetention', '#CompanyCulture', '#MentalHealthAtWork'],
    postType: 'Text Article',
    imagePrompt: 'Professional executive team having an open collaborative discussion in a sunlit airy modern office.',
    engagementTip: 'Tag 2-3 HR leaders in the comments to start a constructive debate.',
  },
  {
    title: 'Why Sustainable Supply Chains Win in 2026',
    caption: `A common myth in consumer goods: "Eco-friendly materials always destroy your profit margins."\n\nHere is the real financial breakdown from our cork sourcing switch:\n\n1. Initial raw material cost was +14% higher.\n2. But customer return rates dropped by 62% due to premium tactile durability.\n3. Organic word-of-mouth referral CAC plummeted from $48 to $11.\n\nSustainability is no longer a PR talking point—it's a competitive moat.\n\nWhat sustainable supplier shifts has your business piloted recently?`,
    hashtags: ['#Sustainability', '#SupplyChain', '#BusinessStrategy', '#EcommerceGrowth', '#GreenBusiness'],
    postType: 'Carousel',
    imagePrompt: 'Clean clean chart comparing traditional PVC supply chain costs against renewable organic cork lifecycle.',
    engagementTip: 'Use a 5-slide PDF carousel document for maximum LinkedIn algorithm dwell time.',
  },
  {
    title: 'Framework: How to Transition from Reactive to Proactive Work',
    caption: `Most founders don't have a time problem. They have an attention prioritization problem.\n\nHere is the simple "Focus Matrix" we use every Monday:\n\n1. Deep Blocks (9:00 AM - 11:30 AM): No Slack, zero meetings, single-threaded strategic execution.\n2. Collaboration Window (1:00 PM - 3:00 PM): Syncs, design critiques, unblocking teammates.\n3. Asynchronous Close (4:00 PM - 5:00 PM): Review deliverables, triage inbox to zero.\n\nProtect your deep focus hours like you protect your venture capital.`,
    hashtags: ['#Productivity', '#FoundersJourney', '#RemoteWork', '#TimeManagement', '#DeepWork'],
    postType: 'Text Article',
    imagePrompt: 'Minimalist organized desk with dual monitor setup, analog mechanical timer, and clear notebook.',
    engagementTip: 'Offer a downloadable Notion template link in the comments for lead capture.',
  },
  {
    title: 'Case Study: From Zero to 10k Community Members',
    caption: `We didn't spend $1 on Meta ads to grow our initial wellness community. Here’s the playbook:\n\n1. We hosted free Saturday morning virtual breathwork sessions.\n2. We asked every attendee to invite 1 colleague who seemed stressed.\n3. We spotlighted member stories in our weekly digest without pitching products.\n\nWhen you solve a genuine emotional friction before asking for a credit card, loyalty happens naturally.\n\nWhat is your #1 grassroots community tactic?`,
    hashtags: ['#CommunityBuilding', '#GrowthStrategy', '#MarketingTips', '#CustomerSuccess', '#B2BGrowth'],
    postType: 'Single Image',
    imagePrompt: 'Virtual Zoom gallery mosaic of 100+ smiling people meditating together online.',
    engagementTip: 'Reply to every single comment within the first 60 minutes of posting.',
  },
];

const TWITTER_IDEAS = [
  {
    title: 'Hot Take on Hustle Culture',
    caption: `Unpopular opinion: If your business model requires you to work 16 hours a day for 5 years straight, you didn't build an asset.\n\nYou built a grueling job where the boss never lets you sleep.\n\nOptimize for leverage, clarity, and rest. 🧘‍♂️⚡`,
    hashtags: ['#Founders', '#BuildInPublic', '#Productivity'],
    postType: 'Text Article',
    imagePrompt: 'Simple black and white high contrast typography quote card.',
    engagementTip: 'Retweet with quote after 6 hours to capture evening US timezone traffic.',
  },
  {
    title: 'Quick Poll: Morning Caffeine Timing',
    caption: `Do you drink coffee within 10 minutes of waking up or wait 90 minutes for natural cortisol to peak?\n\nNeuroscientists say waiting prevents the 2 PM afternoon crash.\n\nRT for "Instant Coffee" ☕\nLike for "90-Min Delay" ⏱️`,
    hashtags: ['#HealthHacks', '#Wellness', '#Habits'],
    postType: 'Poll / Question',
    imagePrompt: 'Freshly pulled espresso shot beside an elegant hourglass timer.',
    engagementTip: 'Engage with quote-tweets to trigger secondary algorithmic velocity.',
  },
  {
    title: '3 Micro-Habits for Crazy Mental Clarity',
    caption: `3 micro-habits that save me 10+ hours of brain fog every week:\n\n1. 10-min sunlight in eyes before 9 AM\n2. Phone on airplane mode until 10 AM\n3. Cold water splash on face at 3 PM\n\nWhat is your non-negotiable?`,
    hashtags: ['#Productivity', '#MentalClarity', '#Biohacking'],
    postType: 'Text Article',
    imagePrompt: 'Golden hour sunshine illuminating green pine trees.',
    engagementTip: 'Reply to every respondent with a personalized micro-tip.',
  },
  {
    title: 'The Simplest Rule for Content Creators',
    caption: `Write for 1 specific person having 1 specific problem.\n\nDon't write for "everyone who wants to be healthy."\n\nWrite for the 32-year-old remote worker whose lower back aches after 4 hours on Zoom.\n\nSpecificity creates resonance.`,
    hashtags: ['#ContentStrategy', '#CreatorEconomy', '#Copywriting'],
    postType: 'Text Article',
    imagePrompt: 'Close up of fountain pen tip writing crisp ink on cream parchment paper.',
    engagementTip: 'Bookmark worthy post—ask readers to bookmark for their next content sprint.',
  },
  {
    title: 'Building Sustainable Habits in 2026',
    caption: `If you want to read 30 books this year, read 10 pages a day.\nIf you want to run a marathon, jog 2 miles today.\nIf you want 100k audience, write 1 high-signal post every day.\n\nDiscipline is just momentum wearing everyday clothes.`,
    hashtags: ['#Discipline', '#SelfImprovement', '#GrowthMindset'],
    postType: 'Text Article',
    imagePrompt: 'Runner shoes lacing up on an outdoor gravel trail at sunrise.',
    engagementTip: 'Quote tweet with an actionable thread expanding on each habit.',
  },
];

// Generates 30 realistic posts distributed across the current month
export const generate30DayPosts = (brandId = 'brand_ecoglow_1', calendarId = 'cal_demo_1', targetMonth = null) => {
  const now = targetMonth ? new Date(targetMonth) : new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const posts = [];
  const platforms = ['Instagram', 'LinkedIn', 'X/Twitter'];
  const timeSlots = ['08:30 AM', '11:15 AM', '01:45 PM', '05:30 PM', '07:15 PM'];

  let postCount = 0;
  // Generate approximately 1 post per day for 30 days
  for (let day = 1; day <= Math.min(30, daysInMonth); day++) {
    const platform = platforms[postCount % platforms.length];
    let pool;
    if (platform === 'Instagram') pool = INSTAGRAM_IDEAS;
    else if (platform === 'LinkedIn') pool = LINKEDIN_IDEAS;
    else pool = TWITTER_IDEAS;

    const baseIdea = pool[postCount % pool.length];
    const postDate = getMonthDate(year, month, day);
    const timeSlot = timeSlots[postCount % timeSlots.length];

    // Status: past days = published, next 7 days = scheduled, rest = draft
    const todayDay = new Date().getDate();
    let status = 'scheduled';
    if (day < todayDay - 1) {
      status = 'published';
    } else if (day > todayDay + 8) {
      status = 'draft';
    }

    posts.push({
      _id: `post_${calendarId}_day_${day}_${postCount}`,
      calendar: calendarId,
      user: DEFAULT_USER._id,
      brand: brandId,
      date: postDate,
      timeSlot,
      platform,
      title: `Day ${day}: ${baseIdea.title}`,
      caption: baseIdea.caption,
      hashtags: baseIdea.hashtags,
      postType: baseIdea.postType,
      imagePrompt: baseIdea.imagePrompt,
      engagementTip: baseIdea.engagementTip,
      status,
      metrics: {
        likes: Math.floor(Math.random() * 450) + 50,
        comments: Math.floor(Math.random() * 45) + 5,
        shares: Math.floor(Math.random() * 30) + 2,
        impressions: Math.floor(Math.random() * 3500) + 800,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    postCount++;
  }

  return posts;
};

// Initial default calendar
export const INITIAL_CALENDAR = {
  _id: 'cal_demo_1',
  user: DEFAULT_USER._id,
  brand: 'brand_ecoglow_1',
  month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
  topic: 'Mindful Morning Habits & Sustainable Wellness Q3 Campaign',
  targetPlatforms: ['Instagram', 'LinkedIn', 'X/Twitter'],
  postCount: 30,
  createdAt: new Date().toISOString(),
};

export const INITIAL_POSTS = generate30DayPosts('brand_ecoglow_1', 'cal_demo_1');

// Single post regenerator
export const regenerateMockPost = (post, instruction = '') => {
  const platform = post.platform;
  const alternatives = {
    Instagram: [
      {
        title: 'Breathe In, Stress Out: 3-Minute Quick Desk Yoga',
        caption: `Shoulders up by your ears? Let's fix that right now. 💆‍♀️✨\n\n1. Interlace your fingers behind your back & pull downwards gently.\n2. Inhale deeply, look up toward the ceiling.\n3. Hold for 3 counts and sigh it all out.\n\nDo this twice before your next meeting. Your spine will thank you! 🌿 Drop a 🧘 in comments if you did it!`,
        hashtags: ['#DeskYoga', '#PostureCorrection', '#MindfulWork', '#WellnessTips', '#SelfCareFirst'],
        postType: 'Reel / Short Video',
        imagePrompt: 'A smiling remote worker doing gentle neck stretch by a sun-drenched wooden desk with green succulent.',
        engagementTip: 'Add an animated countdown timer in the video reel to boost completion rate.',
      },
      {
        title: 'The Sunday Night Wind-Down Routine for Deep Sleep',
        caption: `Sunday Scaries don't stand a chance against this ritual 🌙✨\n\n• 8:00 PM: Chamomile & lavender tea brew\n• 8:30 PM: Phone docks in living room charging station\n• 9:00 PM: 10 minutes of gentle restorative legs-up-the-wall pose\n• 9:30 PM: Lights out with soft ambient rainfall soundscape\n\nSave this post for Sunday evening! How do you protect your sleep? 👇`,
        hashtags: ['#SleepHygiene', '#SundayScaries', '#WindDownRoutine', '#BedtimeRituals', '#RestWell'],
        postType: 'Carousel',
        imagePrompt: 'Warm dimly lit bedroom with linen bedding, ceramic tea mug on nightstand, and glowing salt lamp.',
        engagementTip: 'Ask your audience what time they usually head to bed on Sundays.',
      },
    ],
    LinkedIn: [
      {
        title: 'Why Cognitive Rest is a Strategic Advantage for Tech Teams',
        caption: `We often praise engineers who "grind 14 hours until the bug is fixed."\n\nHere is what neuroscience actually shows: after 4 hours of intense programming, cognitive error rates increase by 240%.\n\nIn our latest engineering sprint, we piloted mandatory 10-minute movement breaks between complex pull requests. The result?\n\n• 34% reduction in syntax refactoring cycles\n• Higher sprint velocity with zero weekend hotfixes\n• 100% team satisfaction score\n\nRest is not the absence of work; it is the foundation of clarity. How does your engineering org combat fatigue?`,
        hashtags: ['#EngineeringLeadership', '#DeepWork', '#MentalHealthInTech', '#TeamProductivity', '#DevOpsCulture'],
        postType: 'Text Article',
        imagePrompt: 'Clean graph showing bug rate escalation vs cognitive fatigue curve over 8 hours.',
        engagementTip: 'Poll your audience on whether they take scheduled breaks during work hours.',
      },
      {
        title: 'The Death of Vanity Metrics: Focus on Customer Life-Time Health',
        caption: `Stop obsessing over top-of-funnel viral reach if your 90-day cohort retention is sub-20%.\n\n3 lessons from building sustainable lifestyle brands:\n\n1. High engagement without advocacy is just expensive noise.\n2. Products that genuinely solve customer daily habits create sticky organic growth.\n3. Authentic micro-communities outperform generic ad campaigns every single time.\n\nBuild things people genuinely miss when they aren't around.`,
        hashtags: ['#MarketingStrategy', '#ProductLedGrowth', '#SaaSMetrics', '#CustomerObsession', '#StartupGrowth'],
        postType: 'Text Article',
        imagePrompt: 'Minimalist white paper sketch comparing retention curves of transactional vs community-led brands.',
        engagementTip: 'Tag your head of growth in comments to start a discussion on retention.',
      },
    ],
    'X/Twitter': [
      {
        title: 'Daily Micro-Philosophy',
        caption: `Your calendar is your actual priority list, not your to-do list.\n\nIf wellness isn't on the calendar, it's just a wish.\n\nBlock 20 minutes today. Treat it like a meeting with your board of directors. 🧘‍♂️`,
        hashtags: ['#Productivity', '#Mindset', '#SelfLeadership'],
        postType: 'Text Article',
        imagePrompt: 'Black and white analog clock hanging on exposed concrete wall.',
        engagementTip: 'Post at 8:15 AM EST when executives check notifications between morning coffee.',
      },
      {
        title: 'Short Truth About Creativity',
        caption: `You cannot pour water from an empty jug.\nYou cannot create high-signal ideas from an exhausted nervous system.\n\nGo outside for 15 minutes. Look at trees. Leave the phone inside.\n\nThe breakthrough comes in the quiet. 🍃`,
        hashtags: ['#Creativity', '#MentalHealth', '#Rest'],
        postType: 'Text Article',
        imagePrompt: 'Close up of morning dew drops on an emerald green monstera leaf.',
        engagementTip: 'Encourage followers to quote tweet with their favorite offline hobby.',
      },
    ],
  };

  const pool = alternatives[platform] || alternatives.Instagram;
  const picked = pool[Math.floor(Math.random() * pool.length)];

  let customNote = '';
  if (instruction) {
    customNote = ` (Tailored with AI instruction: "${instruction}")`;
  }

  return {
    ...post,
    title: picked.title + customNote,
    caption: picked.caption,
    hashtags: picked.hashtags,
    postType: picked.postType,
    imagePrompt: picked.imagePrompt,
    engagementTip: picked.engagementTip,
    updatedAt: new Date().toISOString(),
  };
};

// Analytics Mock Dataset
export const ANALYTICS_DATA = {
  kpis: {
    totalPosts: 30,
    scheduledCount: 18,
    publishedCount: 9,
    draftCount: 3,
    totalImpressions: 58420,
    totalEngagement: 4890,
    avgEngagementRate: '5.8%',
    topPlatform: 'Instagram (62% engagement)',
    bestTimeToPost: 'Tuesday & Thursday at 11:15 AM',
  },
  platformBreakdown: [
    { platform: 'Instagram', posts: 12, engagementRate: '6.4%', impressions: 32400, color: '#E1306C' },
    { platform: 'LinkedIn', posts: 10, engagementRate: '5.2%', impressions: 18200, color: '#0A66C2' },
    { platform: 'X/Twitter', posts: 8, engagementRate: '4.7%', impressions: 7820, color: '#0F1419' },
  ],
  dayOfWeekPerformance: [
    { day: 'Mon', score: 68, active: true },
    { day: 'Tue', score: 94, active: true, best: true },
    { day: 'Wed', score: 76, active: true },
    { day: 'Thu', score: 91, active: true, best: true },
    { day: 'Fri', score: 82, active: true },
    { day: 'Sat', score: 64, active: false },
    { day: 'Sun', score: 79, active: true },
  ],
  topPosts: [
    {
      title: '5-Minute Morning Reset Habit',
      platform: 'Instagram',
      impressions: 4890,
      engagement: '8.4%',
      likes: 412,
      comments: 63,
    },
    {
      title: 'The Hidden ROI of Corporate Wellness Programs',
      platform: 'LinkedIn',
      impressions: 3950,
      engagement: '7.1%',
      likes: 295,
      comments: 48,
    },
    {
      title: 'Hot Take on Hustle Culture',
      platform: 'X/Twitter',
      impressions: 2840,
      engagement: '6.2%',
      likes: 184,
      comments: 39,
    },
  ],
};
