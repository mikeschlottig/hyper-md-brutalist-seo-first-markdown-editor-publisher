import { create } from 'zustand';
import type { Project } from '@shared/types';
export type EditorState = {
  projectId: string | null;
  markdown: string;
  title: string;
  description: string;
  keywords: string;
  setMarkdown: (markdown: string) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setKeywords: (keywords: string) => void;
  setProject: (project: Project) => void;
  reset: () => void;
};
const initialState = {
  projectId: null,
  markdown: '# Hello, Brutalist World!\n\nStart typing your SEO-optimized content here.',
  title: 'New Project',
  description: '',
  keywords: '',
};
export const useEditorStore = create<EditorState>((set) => ({
  ...initialState,
  setMarkdown: (markdown) => set({ markdown }),
  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),
  setKeywords: (keywords) => set({ keywords }),
  setProject: (project) => set({
    projectId: project.id,
    markdown: project.markdown,
    title: project.title,
    description: project.description,
    keywords: project.keywords,
  }),
  reset: () => set(initialState),
}));