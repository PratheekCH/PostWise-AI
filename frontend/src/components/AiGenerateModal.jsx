import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Calendar, 
  Layers, 
  Target, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Loader2,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCalendar } from '../context/CalendarContext';

const CAMPAIGN_PRESETS = [
  {
    id: 'launch',
    title: 'Product / Feature Launch',
    desc: 'Build anticipation, release teasers, feature deep-dives, and social proof.',
    color: 'from-amber-500 to-rose-500',
  },
  {
    id: 'community',
    title: 'Community & Engagement',
    desc: 'Polls, discussion starters, user stories, and daily thought leadership.',
    color: 'from-indigo-500 to-cyan-500',
  },
  {
    id: 'growth',
    title: 'Educational & Authority',
    desc: 'Actionable step-by-step guides, myth-busters, frameworks, and cheat sheets.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'holiday',
    title: 'Seasonal / Holiday Sprint',
    desc: 'Festive promos, limited-time announcements, behind-the-scenes celebrations.',
    color: 'from-violet-500 to-pink-500',
  },
];

const AiGenerateModal = ({ isOpen, onClose, onGenerated }) => {
  const { brands, activeBrand } = useAuth();
  const { generateNewCalendar } = useCalendar();

  const [step, setStep] = useState(1);
  const [selectedBrandId, setSelectedBrandId] = useState(
    activeBrand ? activeBrand._id : (brands[0] ? brands[0]._id : 'brand_ecoglow_1')
  );
  const [campaignType, setCampaignType] = useState('launch');
  const [customTopic, setCustomTopic] = useState('');
  const [targetPlatforms, setTargetPlatforms] = useState(['Instagram', 'LinkedIn', 'X/Twitter']);
  const [month, setMonth] = useState('September 2026');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStageText, setGenerationStageText] = useState('Analyzing brand voice...');

  if (!isOpen) return null;

  const togglePlatform = (p) => {
    if (targetPlatforms.includes(p)) {
      if (targetPlatforms.length > 1) {
        setTargetPlatforms(targetPlatforms.filter((item) => item !== p));
      }
    } else {
      setTargetPlatforms([...targetPlatforms, p]);
    }
  };

  const handleStartGeneration = async () => {
    setIsGenerating(true);
    setStep(3); // Progress screen

    // Realistic multi-stage generation progress
    const stages = [
      { progress: 15, text: 'Extracting audience persona and tone rules...' },
      { progress: 35, text: 'Engineering platform-specific prompts (IG, LinkedIn, X)...' },
      { progress: 60, text: 'Synthesizing 30 unique content hooks & hashtag batches...' },
      { progress: 85, text: 'Optimizing scheduling distribution across 30 days...' },
      { progress: 100, text: 'Content calendar ready! Launching workspace...' },
    ];

    for (const stage of stages) {
      setGenerationProgress(stage.progress);
      setGenerationStageText(stage.text);
      await new Promise((r) => setTimeout(r, 600));
    }

    try {
      const brand = brands.find((b) => b._id === selectedBrandId) || brands[0];
      const res = await generateNewCalendar({
        brandId: selectedBrandId,
        topic: customTopic || `${brand?.name || 'Brand'} - ${CAMPAIGN_PRESETS.find(c => c.id === campaignType)?.title || 'Campaign'}`,
        month,
        platforms: targetPlatforms,
      });

      if (onGenerated) {
        onGenerated(res.calendar);
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
      setStep(1);
      setGenerationProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                AI 30-Day Calendar Generator
              </h3>
              <p className="text-xs text-slate-500">
                Step {step} of 2 • Multi-Platform Content Engine
              </p>
            </div>
          </div>

          {!isGenerating && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step 1: Brand & Campaign Objectives */}
        {step === 1 && (
          <div className="p-6 flex flex-col gap-5">
            {/* Brand Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Brand Workspace
              </label>
              <select
                value={selectedBrandId}
                onChange={(e) => setSelectedBrandId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {brands && brands.length > 0 ? (
                  brands.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name} — {b.niche || b.industry} ({b.tone})
                    </option>
                  ))
                ) : (
                  <option value="brand_ecoglow_1">EcoGlow Wellness</option>
                )}
              </select>
            </div>

            {/* Campaign Pillar Presets */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Primary Campaign Goal
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CAMPAIGN_PRESETS.map((preset) => {
                  const isSelected = campaignType === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => setCampaignType(preset.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/60 shadow-xs ring-1 ring-indigo-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900">{preset.title}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{preset.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Optional Custom Topic / Angle */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Custom Angle or Keyword Focus (Optional)
              </label>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="e.g. Sustainable Cork Yoga Mats & Morning Breathwork Routines"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none shadow-xs"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <span>Continue to Platforms & Timing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Target Platforms & Calendar Scheduling */}
        {step === 2 && (
          <div className="p-6 flex flex-col gap-5">
            {/* Platforms Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Target Platforms (Multi-Platform Voice Adaptation)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {/* Instagram */}
                <div
                  onClick={() => togglePlatform('Instagram')}
                  className={`p-3.5 rounded-2xl border text-center cursor-pointer transition-all ${
                    targetPlatforms.includes('Instagram')
                      ? 'border-pink-500 bg-pink-50/50 shadow-xs ring-1 ring-pink-500'
                      : 'border-slate-200 bg-white opacity-60'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-amber-500 flex items-center justify-center text-white mx-auto mb-1.5 shadow-xs">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-xs text-slate-900">Instagram</div>
                  <div className="text-[10px] text-pink-600 font-semibold mt-0.5">Visual & Emojis</div>
                </div>

                {/* LinkedIn */}
                <div
                  onClick={() => togglePlatform('LinkedIn')}
                  className={`p-3.5 rounded-2xl border text-center cursor-pointer transition-all ${
                    targetPlatforms.includes('LinkedIn')
                      ? 'border-[#0A66C2] bg-blue-50/50 shadow-xs ring-1 ring-[#0A66C2]'
                      : 'border-slate-200 bg-white opacity-60'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-[#0A66C2] flex items-center justify-center text-white mx-auto mb-1.5 shadow-xs">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-xs text-slate-900">LinkedIn</div>
                  <div className="text-[10px] text-[#0A66C2] font-semibold mt-0.5">Professional Value</div>
                </div>

                {/* X */}
                <div
                  onClick={() => togglePlatform('X/Twitter')}
                  className={`p-3.5 rounded-2xl border text-center cursor-pointer transition-all ${
                    targetPlatforms.includes('X/Twitter')
                      ? 'border-slate-900 bg-slate-100 shadow-xs ring-1 ring-slate-900'
                      : 'border-slate-200 bg-white opacity-60'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white mx-auto mb-1.5 shadow-xs">
                    <Twitter className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-xs text-slate-900">X / Twitter</div>
                  <div className="text-[10px] text-slate-600 font-semibold mt-0.5">Concise & Punchy</div>
                </div>
              </div>
            </div>

            {/* Target Month & Frequency */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Target Calendar Month
                </label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="September 2026">September 2026</option>
                  <option value="October 2026">October 2026</option>
                  <option value="November 2026">November 2026</option>
                  <option value="December 2026">December 2026</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Generated Posts Count
                </label>
                <div className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>30 Posts (1 Daily)</span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                    Full Month
                  </span>
                </div>
              </div>
            </div>

            {/* AI Engine Info Box */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-xs text-slate-600">
                <p className="font-bold text-slate-900">Cross-Platform Prompt Adaptation Active</p>
                <p className="mt-0.5 text-[11px] leading-relaxed">
                  The AI crafts identical core brand messages adapted with distinct hooks: emojis & lifestyle storytelling for Instagram, high-signal ROI takeaways for LinkedIn, and snappy conversational one-liners for X.
                </p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <button
                type="button"
                onClick={handleStartGeneration}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-md shadow-indigo-500/25 transition-all transform active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate 30-Day Calendar</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Progressive Generation Simulation */}
        {step === 3 && (
          <div className="p-10 flex flex-col items-center justify-center text-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              </div>
              <Sparkles className="w-5 h-5 text-amber-400 absolute -top-1 -right-1 animate-bounce" />
            </div>

            <div className="max-w-md">
              <h4 className="text-base font-bold text-slate-900">
                Crafting Your 30-Day Content Roadmap
              </h4>
              <p className="text-xs text-slate-500 mt-1">{generationStageText}</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-sm bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
              <div
                className="bg-gradient-to-r from-indigo-600 to-violet-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${generationProgress}%` }}
              />
            </div>

            <div className="text-[11px] font-semibold text-slate-400">
              {generationProgress}% completed
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiGenerateModal;
