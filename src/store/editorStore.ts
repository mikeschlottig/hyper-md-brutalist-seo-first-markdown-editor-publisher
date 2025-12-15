import { create } from 'zustand';
type EditorState = {
  markdown: string;
  title: string;
  description: string;
  keywords: string;
  setMarkdown: (markdown: string) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setKeywords: (keywords: string) => void;
  reset: () => void;
};
const initialState = {
  markdown: '# Hello, Brutalist World!\n\nStart typing your SEO-optimized content here.',
  title: '',
  description: '',
  keywords: '',
};
export const useEditorStore = create<EditorState>((set) => ({
  ...initialState,
  setMarkdown: (markdown) => set({ markdown }),
  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),
  setKeywords: (keywords) => set({ keywords }),
  reset: () => set(initialState),
}));