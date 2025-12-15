import type { User, Chat, ChatMessage, Project } from './types';
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'User A' },
  { id: 'u2', name: 'User B' }
];
export const MOCK_CHATS: Chat[] = [
  { id: 'c1', title: 'General' },
];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', chatId: 'c1', userId: 'u1', text: 'Hello', ts: Date.now() },
];
export const MOCK_PROJECTS: Project[] = [
  {
    id: 'blog-2024',
    title: 'Blog 2024',
    markdown: '# Welcome to the 2024 Blog\n\nThis is the first post. More to come!',
    description: 'The official blog for the year 2024, covering all the latest updates.',
    keywords: 'blog, 2024, updates',
    updatedAt: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
  },
  {
    id: 'landing-v2',
    title: 'Landing Page v2',
    markdown: '# New Landing Page\n\n- Faster\n- More Brutalist\n- Better SEO',
    description: 'The second version of our main landing page, with improved performance and design.',
    keywords: 'landing page, v2, performance',
    updatedAt: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
  },
  {
    id: 'docs-api',
    title: 'API Documentation',
    markdown: '## API Endpoints\n\n- `GET /api/projects`\n- `POST /api/projects`',
    description: 'Complete documentation for our public API.',
    keywords: 'api, docs, documentation, endpoints',
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
  },
];