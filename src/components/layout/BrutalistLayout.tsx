import React from 'react';
import { Link, NavLink, Outlet, useParams } from 'react-router-dom';
import { LayoutDashboard, Pencil, BarChart2, Settings, FileText, Brush } from 'lucide-react';
import { cn } from '@/lib/utils';

const getNavItems = (projectId?: string) => {
  const id = projectId || 'new';
  return [
    { to: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: `/app/editor/${id}`, icon: Pencil, label: 'Editor', end: false },
    { to: `/app/builder/${id}`, icon: Brush, label: 'Builder', end: false },
    { to: `/app/analytics/${id}`, icon: BarChart2, label: 'Analytics', end: false },
    { to: '/app/settings', icon: Settings, label: 'Settings', end: false },
  ];
};

export function BrutalistLayout() {
  const { id } = useParams<{ id: string }>();
  const navItems = getNavItems(id);
  return (
    <div className="min-h-screen w-full flex bg-background text-foreground font-mono">
      <aside className="w-16 md:w-64 border-r-2 border-foreground flex flex-col">
        <div className="h-16 border-b-2 border-foreground flex items-center justify-center md:justify-start p-4">
          <Link to="/" className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-hyper-lime" />
            <span className="hidden md:inline font-bold text-xl tracking-tighter">HYPER.MD</span>
          </Link>
        </div>
        <nav className="flex-1 flex flex-col p-2 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-4 p-3 border-2 border-transparent hover:border-foreground hover:bg-muted transition-colors',
                  isActive && 'bg-hyper-lime text-black border-foreground'
                )
              }
            >
              <item.icon className="h-6 w-6" />
              <span className="hidden md:inline font-bold uppercase tracking-wider">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t-2 border-foreground text-center text-xs text-muted-foreground">
          <p className="hidden md:block">Built with ❤️ at Cloudflare</p>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b-2 border-foreground flex items-center justify-between px-6">
          <h1 className="text-lg font-bold uppercase">Command Center</h1>
          {/* Add user profile/actions here later */}
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}