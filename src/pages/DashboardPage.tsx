import { Link } from 'react-router-dom';
import { PlusCircle, FileText } from 'lucide-react';
// Mock data for now
const mockProjects = [
  { id: 'blog-2024', title: 'Blog 2024', lastUpdated: '2 hours ago' },
  { id: 'landing-v2', title: 'Landing Page v2', lastUpdated: '1 day ago' },
  { id: 'docs-api', title: 'API Documentation', lastUpdated: '3 days ago' },
];
export function DashboardPage() {
  return (
    <div className="p-6 md:p-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold uppercase tracking-wider">Sites</h2>
        <button className="btn-brutal btn-brutal-primary">
          <PlusCircle className="mr-2 h-5 w-5" />
          New Site
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map((project) => (
          <Link
            to={`/app/editor/${project.id}`}
            key={project.id}
            className="card-brutal group transition-all duration-200 ease-out hover:shadow-neo-brutal-hover hover:-translate-x-1 hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-4">
              <FileText className="h-8 w-8 text-hyper-lime" />
              <h3 className="text-2xl font-bold group-hover:underline">{project.title}</h3>
            </div>
            <p className="text-muted-foreground">Last updated: {project.lastUpdated}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}