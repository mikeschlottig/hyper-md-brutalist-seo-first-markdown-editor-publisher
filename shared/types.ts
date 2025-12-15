export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// Minimal real-world chat example types (shared by frontend and worker)
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number; // epoch millis
}
// HYPER.MD Project Type
export interface Project {
  id: string;
  title: string;
  markdown: string;
  description: string;
  keywords: string;
  updatedAt: number; // epoch millis
  layout?: string[];
}

// HYPER.MD Analytics Type
export interface AnalyticsData {
  totalVisitors: number;
  pageViews: number;
  bounceRate: number;
  traffic: { name: string; uv: number }[];
  lighthouseScores: { name: string; score: number }[];
  topPages: { path: string; views: number }[];
  trafficSources: { name: string; value: number }[];
}