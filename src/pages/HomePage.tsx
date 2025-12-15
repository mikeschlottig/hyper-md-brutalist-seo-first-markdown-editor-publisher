import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
const MarqueeText = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative flex overflow-x-hidden font-bold uppercase ${className}`}>
    <div className="animate-marquee whitespace-nowrap">
      {children}
    </div>
    <div className="absolute top-0 animate-marquee2 whitespace-nowrap">
      {children}
    </div>
  </div>
);
export function HomePage() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col overflow-hidden">
      <header className="w-full p-4 border-b-2 border-foreground">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold font-mono tracking-tighter">HYPER.MD</h1>
          <Link to="/app" className="btn-brutal btn-brutal-primary px-4 py-2 text-sm">
            Launch Editor
          </Link>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-4">
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-extrabold font-display tracking-tighter leading-none">
              BRUTALIST.
              <br />
              SEO-FIRST.
              <br />
              MARKDOWN.
            </h2>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-mono">
              A raw, high-performance Markdown editor that fuses content creation with technical SEO optimization. No fluff. Just speed and power.
            </p>
          </div>
          <Link to="/app" className="btn-brutal btn-brutal-primary text-xl">
            Initialize System <ArrowRight className="ml-2 h-6 w-6" />
          </Link>
        </div>
      </main>
      <footer className="w-full border-t-2 border-foreground bg-hyper-lime text-black">
        <MarqueeText className="py-4 text-2xl md:text-4xl">
          <span className="mx-4">95+ LIGHTHOUSE SCORE</span>
          <span className="mx-4">&bull;</span>
          <span className="mx-4">META TAGS</span>
          <span className="mx-4">&bull;</span>
          <span className="mx-4">OPEN GRAPH</span>
          <span className="mx-4">&bull;</span>
          <span className="mx-4">KEYWORD ANALYSIS</span>
          <span className="mx-4">&bull;</span>
          <span className="mx-4">PUBLISH TO WORKERS</span>
          <span className="mx-4">&bull;</span>
        </MarqueeText>
      </footer>
    </div>
  );
}