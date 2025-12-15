import { create } from 'zustand';
import type { Project } from '@shared/types';

const BRICK_MARKDOWN = {
  HERO: (title: string) => `# ${title}\n\nA powerful hero section to grab attention.`,
  TEXT: () => `## A Catchy Subheading\n\nThis is a paragraph of text. You can write about your features, services, or any other information you want to share. Make it informative and engaging.`,
  GRID: () => `### Feature One\n\nDescription for feature one.\n\n### Feature Two\n\nDescription for feature two.\n\n### Feature Three\n\nDescription for feature three.`,
};

export type EditorState = {
  projectId: string | null;
  markdown: string;
  title: string;
  description: string;
  keywords: string;
  layout: string[];
  setMarkdown: (markdown: string) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setKeywords: (keywords: string) => void;
  setLayout: (layout: string[]) => void;
  generateMarkdownFromLayout: () => string;
  setProject: (project: Project) => void;
  reset: () => void;
};
const initialState = {
  projectId: null,
  markdown: '# Hello, Brutalist World!\n\nStart typing your SEO-optimized content here.',
  title: 'New Project',
  description: '',
  keywords: '',
  layout: [],
};
export const useEditorStore = create<EditorState>((set, get) => ({
  ...initialState,
  setMarkdown: (markdown) => set({ markdown }),
  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),
  setKeywords: (keywords) => set({ keywords }),
  setLayout: (layout) => set({ layout }),
  generateMarkdownFromLayout: () => {
    const { layout, title } = get();
    return layout.map(brickId => {
      const type = brickId.split('_')[0] as keyof typeof BRICK_MARKDOWN;
      if (BRICK_MARKDOWN[type]) {
        return BRICK_MARKDOWN[type](title);
      }
      return '';
    }).join('\n\n---\n\n');
  },
  setProject: (project) => set({
    projectId: project.id,
    markdown: project.markdown,
    title: project.title,
    description: project.description,
    keywords: project.keywords,
    layout: project.layout || [],
  }),
  reset: () => set(initialState),
}));