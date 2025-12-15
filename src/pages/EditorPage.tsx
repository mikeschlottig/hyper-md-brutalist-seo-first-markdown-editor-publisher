import React, { useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useEditorStore } from '@/store/editorStore';
import { analyzeSeo, SeoAnalysis } from '@/lib/seo-analyzer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '@/hooks/use-theme';
import { useDropzone } from 'react-dropzone';
import { CheckCircle, AlertCircle, Loader2, Save, UploadCloud, File, Rocket, FolderArchive } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Project } from '@shared/types';
import { useDebounce } from 'react-use';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generatePublishConfig } from '@/lib/publish-generator';
const fetchProject = (id: string) => api<Project>(`/api/projects/${id}`);
const updateProject = (project: Partial<Project> & { id: string }) => api<Project>(`/api/projects/${project.id}`, {
  method: 'PATCH',
  body: JSON.stringify(project),
});
const SeoIndicator = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-bold">{value}</span>
  </div>
);
const FeedbackItem = ({ text, ok }: { text: string; ok: boolean }) => (
  <div className="flex items-start gap-2 text-sm">
    {ok ? <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" /> : <AlertCircle className="h-4 w-4 mt-0.5 text-red-500 flex-shrink-0" />}
    <span>{text}</span>
  </div>
);
const CodeBlock = ({ language, value }: { language?: string; value: string }) => {
  const { isDark } = useTheme();
  return (
    <SyntaxHighlighter language={language} style={isDark ? vscDarkPlus : vs} PreTag="div">
      {String(value).replace(/\n$/, '')}
    </SyntaxHighlighter>
  );
};
export function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const markdown = useEditorStore(state => state.markdown);
  const title = useEditorStore(state => state.title);
  const description = useEditorStore(state => state.description);
  const keywords = useEditorStore(state => state.keywords);
  const setMarkdown = useEditorStore(state => state.setMarkdown);
  const setTitle = useEditorStore(state => state.setTitle);
  const setDescription = useEditorStore(state => state.setDescription);
  const setKeywords = useEditorStore(state => state.setKeywords);
  const setProject = useEditorStore(state => state.setProject);
  const reset = useEditorStore(state => state.reset);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { data: projectData, isLoading, isError } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProject(id!),
    enabled: !!id && id !== 'new',
  });
  useEffect(() => {
    if (projectData) setProject(projectData);
    return () => { if (id !== projectData?.id) reset(); };
  }, [projectData, id, setProject, reset]);
  const saveMutation = useMutation({
    mutationFn: updateProject,
    onSuccess: (updatedProject) => {
      queryClient.setQueryData(['project', updatedProject.id], updatedProject);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
  const debouncedState = useMemo(() => ({ markdown, title, description, keywords }), [markdown, title, description, keywords]);
  useDebounce(() => {
    if (id && id !== 'new' && projectData && (
      debouncedState.markdown !== projectData.markdown ||
      debouncedState.title !== projectData.title ||
      debouncedState.description !== projectData.description ||
      debouncedState.keywords !== projectData.keywords
    )) {
      saveMutation.mutate({ id, ...debouncedState });
    }
  }, 1500, [debouncedState, id, projectData]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && textareaRef.current) {
      const cursorPosition = textareaRef.current.selectionStart;
      const textToInsert = `\n![${file.name}](https://your-r2-bucket.com/${file.name})\n`;
      const newMarkdown = markdown.slice(0, cursorPosition) + textToInsert + markdown.slice(cursorPosition);
      setMarkdown(newMarkdown);
    }
  }, [markdown, setMarkdown]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] } });
  const analysis: SeoAnalysis = useMemo(() => analyzeSeo(markdown, title, description, keywords), [markdown, title, description, keywords]);
  const publishConfig = useMemo(() => projectData ? generatePublishConfig(projectData) : null, [projectData]);
  if (isLoading) return <div className="flex items-center justify-center h-full"><Loader2 className="h-12 w-12 animate-spin text-hyper-lime" /></div>;
  if (isError) return <div className="flex items-center justify-center h-full text-red-500">Error loading project.</div>;
  return (
    <div className="h-full flex flex-col">
      <div className="h-16 flex-shrink-0 border-b-2 border-foreground flex items-center px-6 justify-between">
        <h2 className="font-bold text-lg">{title}</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {saveMutation.isPending && <><Loader2 className="h-4 w-4 animate-spin" /><span>Saving...</span></>}
            {saveMutation.isSuccess && <><CheckCircle className="h-4 w-4 text-green-500" /><span>Saved</span></>}
            {saveMutation.isError && <><AlertCircle className="h-4 w-4 text-red-500" /><span>Error</span></>}
          </div>
          <Sheet>
            <SheetTrigger asChild><Button variant="outline" className="btn-brutal"><FolderArchive className="mr-2 h-4 w-4" /> Media</Button></SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] border-l-2 border-foreground bg-background">
              <SheetHeader><SheetTitle className="text-2xl font-bold">Media Manager (R2)</SheetTitle></SheetHeader>
              <div {...getRootProps()} className="mt-8 border-2 border-dashed border-foreground p-12 text-center cursor-pointer hover:border-hyper-lime hover:bg-muted">
                <input {...getInputProps()} />
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
              </div>
            </SheetContent>
          </Sheet>
          <Dialog>
            <DialogTrigger asChild><Button className="btn-brutal btn-brutal-primary"><Rocket className="mr-2 h-4 w-4" /> Publish</Button></DialogTrigger>
            <DialogContent className="max-w-4xl border-2 border-foreground bg-background shadow-neo-brutal">
              <DialogHeader><DialogTitle className="text-2xl font-bold">Publish Configuration</DialogTitle></DialogHeader>
              {publishConfig && (
                <Tabs defaultValue="wrangler" className="mt-4">
                  <TabsList className="border-2 border-foreground"><TabsTrigger value="wrangler">wrangler.toml</TabsTrigger><TabsTrigger value="sitemap">sitemap.xml</TabsTrigger><TabsTrigger value="robots">robots.txt</TabsTrigger><TabsTrigger value="llm">llm.txt</TabsTrigger></TabsList>
                  <TabsContent value="wrangler"><pre className="bg-muted p-4 mt-2 overflow-auto text-sm"><code>{publishConfig.wranglerToml}</code></pre></TabsContent>
                  <TabsContent value="sitemap"><pre className="bg-muted p-4 mt-2 overflow-auto text-sm"><code>{publishConfig.sitemapXml}</code></pre></TabsContent>
                  <TabsContent value="robots"><pre className="bg-muted p-4 mt-2 overflow-auto text-sm"><code>{publishConfig.robotsTxt}</code></pre></TabsContent>
                  <TabsContent value="llm"><pre className="bg-muted p-4 mt-2 overflow-auto text-sm"><code>{publishConfig.llmTxt}</code></pre></TabsContent>
                </Tabs>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={50}>
          <Textarea ref={textareaRef} value={markdown} onChange={(e) => setMarkdown(e.target.value)} className="h-full w-full resize-none border-0 border-r-2 border-foreground p-6 font-mono text-base focus-visible:ring-0" placeholder="Write your markdown here..." />
        </ResizablePanel>
        <ResizableHandle withHandle className="bg-foreground" />
        <ResizablePanel defaultSize={50}>
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-auto p-6">
              <article className="prose prose-stone dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={{ code: ({ node, className, children, ...props }) => { const match = /language-(\w+)/.exec(className || ''); return match ? (<CodeBlock language={match[1]} value={String(children)} />) : (<code className={className} {...props}>{children}</code>); } }}>{markdown}</ReactMarkdown>
              </article>
            </div>
            <div className="h-72 border-t-2 border-foreground p-4 overflow-auto bg-muted/30">
              <h3 className="font-bold text-lg mb-2 uppercase">SEO Command Center</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div><Label htmlFor="title">Meta Title</Label><Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Your Page Title" /></div>
                  <div><Label htmlFor="description">Meta Description</Label><Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A brief summary of your page." className="h-24" /></div>
                  <div><Label htmlFor="keywords">Keywords</Label><Input id="keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="seo, markdown, editor" /></div>
                </div>
                <div className="space-y-3 card-brutal !shadow-none border p-3 bg-background">
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline"><h4 className="font-bold">SEO Score</h4><span className="font-bold text-lg">{analysis.score}/100</span></div>
                    <Progress value={analysis.score} className="h-3 bg-hyper-lime/20 [&>div]:bg-hyper-lime" />
                  </div>
                  <div className="space-y-2 pt-2"><SeoIndicator label="Word Count" value={analysis.wordCount} /><SeoIndicator label="Title Length" value={analysis.titleLength} /><SeoIndicator label="Desc. Length" value={analysis.descriptionLength} /></div>
                  <div className="space-y-1 pt-2 border-t border-dashed">
                    <FeedbackItem text={analysis.feedback.title} ok={analysis.feedback.title === 'Looks good.'} />
                    <FeedbackItem text={analysis.feedback.description} ok={analysis.feedback.description === 'Looks good.'} />
                    <FeedbackItem text={analysis.feedback.content} ok={analysis.feedback.content === 'Looks good.'} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}