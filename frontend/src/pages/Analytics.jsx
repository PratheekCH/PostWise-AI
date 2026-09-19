import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Share2, 
  Heart, 
  MessageCircle, 
  Eye, 
  Instagram, 
  Linkedin, 
  Twitter,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { ANALYTICS_DATA } from '../services/mockData';
import { useAuth } from '../context/AuthContext';

const Analytics = () => {
  const { activeBrand } = useAuth();
  const data = ANALYTICS_DATA;

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-bold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            Predicted AI Performance Insights
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Content Analytics & Engagement Forecasting
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active Workspace: <strong className="text-slate-800">{activeBrand?.name || 'EcoGlow Wellness'}</strong> • Last 30 Days Forecast
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2 rounded-2xl">
          <Clock className="w-4 h-4 text-indigo-600" />
          <div className="text-xs">
            <span className="text-slate-400 block text-[10px]">Optimal Timing</span>
            <strong className="text-slate-800">{data.kpis.bestTimeToPost}</strong>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Estimated Impressions</span>
            <Eye className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {data.kpis.totalImpressions.toLocaleString()}
          </div>
          <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +24% vs previous month
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Engagement Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">
            {data.kpis.avgEngagementRate}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Across 30 scheduled posts
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Interactions</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {data.kpis.totalEngagement.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Likes, comments & reposts
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Top Performing Platform</span>
            <Instagram className="w-4 h-4 text-pink-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 truncate">
            Instagram
          </div>
          <p className="text-xs text-pink-600 font-bold mt-2">
            62% of total audience reach
          </p>
        </div>
      </div>

      {/* Charts & Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Platform Breakdown (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Platform Performance Breakdown</h3>
                <p className="text-xs text-slate-500">Impressions & engagement rate per channel</p>
              </div>
              <BarChart3 className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-4">
              {data.platformBreakdown.map((item) => (
                <div key={item.platform} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.platform} ({item.posts} posts)
                    </span>
                    <span className="text-indigo-600">{item.engagementRate} eng.</span>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-1">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: item.color,
                        width: `${(item.impressions / 35000) * 100}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Forecast: {item.impressions.toLocaleString()} impressions</span>
                    <span>Target: +15% QoQ</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
            Instagram drives the highest comment velocity, while LinkedIn generates superior B2B decision-maker clicks.
          </div>
        </div>

        {/* Right: Best Days Heatmap / Bar Chart (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Engagement by Day of the Week</h3>
                <p className="text-xs text-slate-500">Relative audience activity index</p>
              </div>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>

            <div className="grid grid-cols-7 gap-2 pt-6 pb-2 items-end h-44">
              {data.dayOfWeekPerformance.map((d) => (
                <div key={d.day} className="flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-bold text-slate-500">{d.score}%</span>
                  <div
                    className={`w-full max-w-[32px] rounded-t-xl transition-all duration-500 ${
                      d.best
                        ? 'bg-gradient-to-t from-indigo-600 to-violet-500 shadow-md shadow-indigo-500/20'
                        : 'bg-slate-200 hover:bg-slate-300'
                    }`}
                    style={{ height: `${d.score}%` }}
                  />
                  <span className={`text-xs font-bold ${d.best ? 'text-indigo-600' : 'text-slate-600'}`}>
                    {d.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>AI Suggestion: Schedule key product launches and announcement posts on <strong>Tuesday & Thursday mornings</strong>.</span>
          </div>
        </div>
      </div>

      {/* Top Performing Posts Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4">
          Top Predicted Viral Posts
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Post Title</th>
                <th className="pb-3">Platform</th>
                <th className="pb-3">Impressions</th>
                <th className="pb-3">Eng. Rate</th>
                <th className="pb-3">Predicted Likes</th>
                <th className="pb-3">Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.topPosts.map((post, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 font-bold text-slate-900 max-w-xs truncate pr-4">
                    {post.title}
                  </td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-slate-100 text-slate-700">
                      {post.platform}
                    </span>
                  </td>
                  <td className="py-3.5 font-semibold text-slate-700">
                    {post.impressions.toLocaleString()}
                  </td>
                  <td className="py-3.5 font-bold text-emerald-600">
                    {post.engagement}
                  </td>
                  <td className="py-3.5 text-slate-600">
                    {post.likes}
                  </td>
                  <td className="py-3.5 text-slate-600">
                    {post.comments}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
