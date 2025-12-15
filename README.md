# HYPER.MD - Brutalist SEO-First Markdown Editor & Publisher

[![[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/mikeschlottig/hyper-md-brutalist-seo-first-markdown-editor-publisher)]](https://deploy.workers.cloudflare.com/?url=${repositoryUrl})

HYPER.MD is a high-performance, visually striking Markdown editing and publishing platform designed with a raw Brutalist aesthetic. It bridges the gap between content creation and technical SEO optimization.

The core component is a split-pane 'Live Preview' editor that treats SEO metadata (Titles, Descriptions, OG Tags) as first-class citizens alongside content. It includes a real-time 'SEO Score' analyzer that checks keyword density, heading structure, and meta tag completeness.

The application features a 'Multi-Site Dashboard' where users can manage multiple projects. The 'Site Builder' allows users to arrange content blocks using drag-and-drop (via dnd-kit), enabling the creation of complex layouts beyond simple prose.

Advanced features include a 'Publishing Configuration' generator for Cloudflare Workers (generating wrangler.toml snippets), an 'Analytics' view (mocking Cloudflare GraphQL analytics), and a 'Media Manager' interface for R2 bucket interactions.

The aesthetic is uncompromisingly brutalist: high contrast, thick borders, hard shadows, monospaced typography, and neobrutalist interactive states.

## ✨ Key Features

- **Brutalist Live Preview Editor**: Split-pane Markdown editor with real-time HTML rendering and SEO analysis
- **Multi-Site Dashboard**: Manage multiple projects with high-contrast status indicators
- **SEO Command Center**: Real-time scoring for keywords, headings, meta tags, and structured data
- **Drag-and-Drop Site Builder**: Visual layout tool using dnd-kit with pre-built content bricks
- **Cloudflare Integration**: Publish config generator for Workers, R2 media manager (mocked), Analytics console
- **Responsive Neo-Brutalism**: Mobile-first design with 4px black borders, hard shadows, and mechanical interactions
- **Persistent Storage**: Cloudflare Durable Objects for project persistence across sessions
- **Production-Ready**: Zero-config deployment, SEO-optimized, Lighthouse 95+ scores

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS 3, shadcn/ui, Framer Motion
- **State Management**: Zustand
- **Routing**: React Router 6
- **Markdown**: react-markdown + remark-gfm + rehype-raw + react-syntax-highlighter
- **UI Interactions**: @dnd-kit/core, react-resizable-panels, lucide-react icons
- **Backend**: Hono, Cloudflare Workers, Durable Objects (via custom entity library)
- **Data Fetching**: TanStack Query
- **Forms & Validation**: React Hook Form + Zod
- **Charts**: Recharts
- **Notifications**: Sonner
- **Deployment**: Cloudflare Workers (wrangler)

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) (package manager)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (for deployment)

### Installation
```bash
bun install
```

### Development
```bash
bun dev
```
Opens at `http://localhost:3000` (or configured PORT).

### Build for Production
```bash
bun build
```

## 💻 Usage

### Views & Navigation
- **Landing Page** (`/`): High-impact introduction with "Initialize System" CTA
- **Dashboard** (`/dashboard`): Project grid with create/edit/analytics actions
- **Editor** (`/editor/:projectId`): Split-pane Markdown workspace + SEO sidebar
- **Site Builder** (`/builder/:projectId`): Drag-and-drop layout canvas
- **Analytics** (`/analytics/:projectId`): Performance metrics and Lighthouse scores

### Core Workflow
1. Create a new project from Dashboard
2. Edit Markdown in split-pane with live preview
3. Optimize SEO via Command Center (real-time scoring)
4. Build layouts visually or insert media
5. Generate Workers publish config and deploy

All projects persist via Durable Objects. API endpoints at `/api/projects`, `/api/seo`, etc.

## 🧪 Development Instructions

### Scripts
| Command | Description |
|---------|-------------|
| `bun dev` | Start dev server |
| `bun lint` | Run ESLint |
| `bun build` | Production build |
| `bun preview` | Local preview server |
| `wrangler types` | Generate Worker types (`cf-typegen`) |
| `bun deploy` | Build + deploy to Cloudflare |

### Environment
- **Theme**: Toggle light/dark mode (persists in localStorage)
- **API**: All endpoints under `/api/*` (CORS-enabled)
- **Storage**: Single Durable Object binding (`GlobalDurableObject`)
- **Routing**: React Router with error boundaries

### Custom Entities
Extend `worker/entities.ts`:
```typescript
export class ProjectEntity extends IndexedEntity<Project> {
  static readonly entityName = "project";
  static readonly indexName = "projects";
  static readonly initialState: Project = { id: "", title: "", content: "" };
}
```
Register routes in `worker/user-routes.ts`.

### Frontend State
Use Zustand stores (`src/stores/editorStore.ts`, etc.) with primitive selectors only:
```typescript
const content = useEditorStore(s => s.content);
```

## ☁️ Deployment

Deploy to Cloudflare Workers with full-stack persistence:

1. **Login** (if needed): `wrangler login`
2. **Deploy**: `bun deploy` (builds frontend + deploys Worker)
3. **Custom Domain**: Edit `wrangler.jsonc` → `wrangler deploy`
4. **Preview**: `wrangler deploy --name preview-branch`

Bindings auto-configured (Durable Object ready). Assets served as SPA.

[![[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/mikeschlottig/hyper-md-brutalist-seo-first-markdown-editor-publisher)]](https://deploy.workers.cloudflare.com/?url=${repositoryUrl})

## 📱 Responsive Design
- Mobile-first: Stacks vertically, 60px+ touch targets
- Breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px)
- Neo-Brutalist: 2-4px solid black borders, `shadow-[4px_4px_0px_0px_#000]`

## 🔒 Security & Best Practices
- Type-safe APIs (shared types)
- Error boundaries + client error reporting
- Input validation (Zod)
- No direct Durable Object access (entity abstraction)
- CSP-ready, no unsafe-eval

## 🤝 Contributing
1. Fork & clone
2. `bun install`
3. `bun dev`
4. Submit PR with tests

## 📄 License
MIT License - see [LICENSE](LICENSE) for details.

## 🙌 Support
Built with ❤️ by Cloudflare Workers. Questions? [Cloudflare Developers Discord](https://discord.gg/cloudflaredev)

---

⭐ **Star on GitHub** · 🚀 **Deploy instantly** · 📖 **Full docs above**