import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { AnalyticsData } from '@shared/types';
import { Loader2, ArrowUp, Users, MousePointerClick, FileText } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
const COLORS = ['#CCFF00', '#000000', '#FFFFFF', '#8884d8'];
const StatCard = ({ title, value, icon: Icon, change }: { title: string, value: string, icon: React.ElementType, change?: string }) => (
  <div className="card-brutal">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-bold uppercase text-muted-foreground">{title}</h3>
      <Icon className="h-5 w-5 text-muted-foreground" />
    </div>
    <p className="text-4xl font-bold">{value}</p>
    {change && (
      <div className="flex items-center text-sm text-green-500 mt-1">
        <ArrowUp className="h-4 w-4 mr-1" />
        <span>{change}</span>
      </div>
    )}
  </div>
);
export function AnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['analytics', id],
    queryFn: () => api<AnalyticsData>(`/api/analytics/${id || 'default'}`),
  });
  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="h-12 w-12 animate-spin text-hyper-lime" /></div>;
  }
  if (isError || !data) {
    return <div className="p-8 text-center text-red-500">Failed to load analytics data.</div>;
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 font-mono">
        <h2 className="text-3xl font-bold uppercase tracking-wider mb-8">Analytics Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Visitors" value={data.totalVisitors.toLocaleString()} icon={Users} change="+12.5% this month" />
          <StatCard title="Page Views" value={data.pageViews.toLocaleString()} icon={FileText} change="+8.2% this month" />
          <StatCard title="Bounce Rate" value={`${data.bounceRate}%`} icon={MousePointerClick} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card-brutal">
            <h3 className="text-lg font-bold mb-4 uppercase">Traffic Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.traffic}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '2px solid hsl(var(--foreground))' }} />
                <Line type="monotone" dataKey="uv" stroke="#CCFF00" strokeWidth={3} dot={{ r: 4, fill: '#CCFF00' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card-brutal">
            <h3 className="text-lg font-bold mb-4 uppercase">Lighthouse Score</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.lighthouseScores}>
                    <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--foreground))" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '2px solid hsl(var(--foreground))' }} />
                    <Bar dataKey="score" fill="#CCFF00" barSize={30} />
                </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card-brutal">
            <h3 className="text-lg font-bold mb-4 uppercase">Top Pages</h3>
            <ul className="space-y-2">
              {data.topPages.map((page, index) => (
                <li key={index} className="flex justify-between items-center text-sm border-b-2 border-dashed pb-1">
                  <span>{page.path}</span>
                  <span className="font-bold">{page.views.toLocaleString()} views</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2 card-brutal">
            <h3 className="text-lg font-bold mb-4 uppercase">Traffic Sources</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={data.trafficSources} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {data.trafficSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="hsl(var(--foreground))" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '2px solid hsl(var(--foreground))' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}