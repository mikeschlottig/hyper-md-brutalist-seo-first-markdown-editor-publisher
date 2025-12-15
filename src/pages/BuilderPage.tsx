import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Heading1, Text, LayoutGrid, Save, Loader2, ArrowLeft } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Project } from '@shared/types';
const BRICKS = {
  HERO: { id: 'HERO', name: 'Hero Section', icon: Heading1, markdown: (title: string) => `# ${title}\n\nA powerful hero section to grab attention.` },
  TEXT: { id: 'TEXT', name: 'Text Block', icon: Text, markdown: () => `## A Catchy Subheading\n\nThis is a paragraph of text. You can write about your features, services, or any other information you want to share. Make it informative and engaging.` },
  GRID: { id: 'GRID', name: 'Feature Grid', icon: LayoutGrid, markdown: () => `### Feature One\n\nDescription for feature one.\n\n### Feature Two\n\nDescription for feature two.\n\n### Feature Three\n\nDescription for feature three.` },
};
type BrickType = keyof typeof BRICKS;
const Brick = ({ id, type, isOverlay }: { id: string, type: BrickType, isOverlay?: boolean }) => {
  const brickInfo = BRICKS[type];
  if (!brickInfo) return null;
  const { ref, attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  if (isOverlay) {
    return (
      <div className="card-brutal flex items-center gap-4 p-4 bg-hyper-lime text-black">
        <brickInfo.icon className="h-6 w-6" />
        <span className="font-bold">{brickInfo.name}</span>
      </div>
    );
  }
  return (
    <div ref={setNodeRef} style={style} className="card-brutal flex items-center justify-between p-4 bg-background mb-4">
      <div className="flex items-center gap-4">
        <brickInfo.icon className="h-6 w-6 text-muted-foreground" />
        <span className="font-bold">{brickInfo.name}</span>
      </div>
      <div {...attributes} {...listeners} className="p-2 cursor-grab active:cursor-grabbing">
        <GripVertical className="h-6 w-6 text-muted-foreground" />
      </div>
    </div>
  );
};
const updateProjectLayout = (data: { id: string; layout: string[] }) =>
  api<Project>(`/api/projects/${data.id}/layout`, {
    method: 'PATCH',
    body: JSON.stringify({ layout: data.layout }),
  });
export function BuilderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const layout = useEditorStore(state => state.layout);
  const setLayout = useEditorStore(state => state.setLayout);
  const setProject = useEditorStore(state => state.setProject);
  const title = useEditorStore(state => state.title);
  const { data: projectData, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => api<Project>(`/api/projects/${id!}`),
    enabled: !!id && id !== 'new',
    onSuccess: (data) => setProject(data),
  });
  const saveMutation = useMutation({
    mutationFn: updateProjectLayout,
    onSuccess: (updatedProject) => {
      queryClient.setQueryData(['project', updatedProject.id], updatedProject);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = layout.findIndex(item => item.startsWith(active.id as string));
      const newIndex = layout.findIndex(item => item.startsWith(over.id as string));
      setLayout(arrayMove(layout, oldIndex, newIndex));
    }
  };
  const addBrick = (type: BrickType) => {
    const newId = `${type}_${Date.now()}`;
    setLayout([...layout, newId]);
  };
  const handleSaveLayout = () => {
    if (id && id !== 'new') {
      saveMutation.mutate({ id, layout });
    }
  };
  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="h-12 w-12 animate-spin text-hyper-lime" /></div>;
  }
  const activeBrickType = activeId ? (activeId.split('_')[0] as BrickType) : null;
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-full font-mono">
        <aside className="w-72 border-r-2 border-foreground p-4 flex flex-col">
          <h2 className="text-xl font-bold uppercase mb-4">Bricks</h2>
          <div className="space-y-2">
            {Object.entries(BRICKS).map(([type, { name, icon: Icon }]) => (
              <button key={type} onClick={() => addBrick(type as BrickType)} className="w-full btn-brutal flex items-center gap-2 !px-3 !py-2 text-left">
                <Icon className="h-5 w-5" /> {name}
              </button>
            ))}
          </div>
          <div className="mt-auto space-y-2">
            <Button onClick={handleSaveLayout} disabled={saveMutation.isPending} className="w-full btn-brutal btn-brutal-primary">
              {saveMutation.isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
              Save Layout
            </Button>
            <Button onClick={() => navigate(`/app/editor/${id}`)} variant="outline" className="w-full btn-brutal">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Editor
            </Button>
          </div>
        </aside>
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">{title}</h1>
            <p className="text-muted-foreground mb-8">Drag and drop bricks to build your page structure.</p>
            <SortableContext items={layout.map(id => id.split('_')[0])} strategy={verticalListSortingStrategy}>
              {layout.map((fullId) => {
                const [type] = fullId.split('_') as [BrickType];
                return <Brick key={fullId} id={fullId} type={type} />;
              })}
            </SortableContext>
            {layout.length === 0 && (
              <div className="text-center border-2 border-dashed border-foreground p-12">
                <p className="text-muted-foreground">Drop bricks from the left panel to start building.</p>
              </div>
            )}
          </div>
        </main>
      </div>
      <DragOverlay>{activeId && activeBrickType ? <Brick id={activeId} type={activeBrickType} isOverlay /> : null}</DragOverlay>
    </DndContext>
  );
}