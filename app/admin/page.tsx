'use client';

import { useState, useEffect } from 'react';
import { FileText, ImageIcon, MessageSquare, DollarSign } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ pages: 0, posts: 0, testimonials: 0, pricing: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app we would have an /api/admin/analytics endpoint.
    // For now, we simulate loading the initial counts by making dummy fetches or hardcoding.
    const fetchStats = async () => {
      try {
        // Fetch pages and navs and sum them up
        setStats({ pages: 5, posts: 2, testimonials: 4, pricing: 3 });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-400 mt-1">Welcome back. Here is your site at a glance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Total Pages" value={stats.pages} loading={isLoading} color="bg-brand-purple/20 text-brand-purple" />
        <StatCard icon={MessageSquare} label="Testimonials" value={stats.testimonials} loading={isLoading} color="bg-blue-500/20 text-blue-500" />
        <StatCard icon={DollarSign} label="Pricing Plans" value={stats.pricing} loading={isLoading} color="bg-green-500/20 text-green-500" />
        <StatCard icon={ImageIcon} label="Gallery Items" value={stats.posts} loading={isLoading} color="bg-orange-500/20 text-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <ActivityItem message="Hero section updated on Home page" time="2 hours ago" />
            <ActivityItem message="Site Settings primary color changed" time="5 hours ago" />
            <ActivityItem message="New Testimonial added" time="1 day ago" />
            <ActivityItem message="Navigation reordered" time="3 days ago" />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-gray-300">Real-time Sync</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">Active</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-gray-300">Database Connection</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">Healthy</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Next.js Framework</span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">v15 Serverless</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, loading, color }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div>
        {loading ? (
          <div className="w-16 h-8 bg-white/10 animate-pulse rounded mb-1"></div>
        ) : (
          <h3 className="text-3xl font-bold">{value}</h3>
        )}
        <p className="text-gray-400 text-sm mt-1">{label}</p>
      </div>
    </div>
  );
}

function ActivityItem({ message, time }: { message: string, time: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1.5 w-2 h-2 rounded-full bg-brand-purple"></div>
      <div>
        <p className="text-sm text-gray-200">{message}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
}
