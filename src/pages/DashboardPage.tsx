import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, FileText, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Project } from '@shared/types';
import { formatDistanceToNow } from 'date-fns';
const fetchProjects = () => api<Project[]>('/api/projects');
const createProject = (title: string) => api<Project>('/api/projects', {
  method: 'POST',
  body: JSON.stringify({ title }),
});
export function DashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: projects, isLoading, isError } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });
  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      navigate(`/app/editor/${newProject.id}`);
    },
  });
  const handleCreateSite = () => {
    const title = prompt('Enter a title for your new site:', 'New Project');
    if (title && title.trim()) {
      createMutation.mutate(title.trim());
    }
  };
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-hyper-lime" />
        </div>
      );
    }
    if (isError) {
      return <div className="text-center text-red-500">Failed to load projects.</div>;
    }
    if (!projects || projects.length === 0) {
      return <div className="text-center text-muted-foreground">No sites found. Create your first one!</div>;
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.sort((a, b) => b.updatedAt - a.updatedAt).map((project) => (
          <Link
            to={`/app/editor/${project.id}`}
            key={project.id}
            className="card-brutal group transition-all duration-200 ease-out hover:shadow-neo-brutal-hover hover:-translate-x-1 hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-4 mb-4">
                <FileText className="h-8 w-8 text-hyper-lime" />
                <h3 className="text-2xl font-bold group-hover:underline">{project.title}</h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
            </p>
          </Link>
        ))}
      </div>
    );
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold uppercase tracking-wider">Sites</h2>
          <button
            onClick={handleCreateSite}
            disabled={createMutation.isPending}
            className="btn-brutal btn-brutal-primary"
          >
            {createMutation.isPending ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <PlusCircle className="mr-2 h-5 w-5" />
            )}
            New Site
          </button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}