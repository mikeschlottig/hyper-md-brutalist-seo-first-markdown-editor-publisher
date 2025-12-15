import React, { useEffect, useMemo } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useEditorStore } from '@/store/editorStore';
import { analyzeSeo, SeoAnalysis } from '@/lib/seo-analyzer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CheckCircle, AlertCircle } from 'lucide-react';
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
export function EditorPage() {
  const markdown = useEditorStore(s => s.markdown);
  const title = useEditorStore(s => s.title);
  const description = useEditorStore(s => s.description);
  const keywords = useEditorStore(s => s.keywords);
  const setMarkdown = useEditorStore(s => s.setMarkdown);
  const setTitle = useEditorStore(s => s.setTitle);
  const setDescription = useEditorStore(s => s.setDescription);
  const setKeywords = useEditorStore(s => s.setKeywords);
  const reset = useEditorStore(s => s.reset);
  useEffect(() => {
    // Reset store on mount/unmount to not carry over state between different "projects"
    return () => {
      reset();
    };
  }, [reset]);
  const analysis: SeoAnalysis = useMemo(
    () => analyzeSeo(markdown, title, description, keywords),
    [markdown, title, description, keywords]
  );
  return (
    <div className="h-full flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={50}>
          <Textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="h-full w-full resize-none border-0 border-r-2 border-foreground p-6 font-mono text-base focus-visible:ring-0"
            placeholder="Write your markdown here..."
          />
        </ResizablePanel>
        <ResizableHandle withHandle className="bg-foreground" />
        <ResizablePanel defaultSize={50}>
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-auto p-6">
              <article className="prose prose-stone dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
              </article>
            </div>
            <div className="h-72 border-t-2 border-foreground p-4 overflow-auto bg-muted/30">
              <h3 className="font-bold text-lg mb-2 uppercase">SEO Command Center</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="title">Meta Title</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Your Page Title" />
                  </div>
                  <div>
                    <Label htmlFor="description">Meta Description</Label>
                    <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A brief summary of your page." className="h-24" />
                  </div>
                  <div>
                    <Label htmlFor="keywords">Keywords</Label>
                    <Input id="keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="seo, markdown, editor" />
                  </div>
                </div>
                <div className="space-y-3 card-brutal !shadow-none border p-3 bg-background">
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-bold">SEO Score</h4>
                      <span className="font-bold text-lg">{analysis.score}/100</span>
                    </div>
                    <Progress value={analysis.score} className="h-3 bg-hyper-lime/20 [&>div]:bg-hyper-lime" />
                  </div>
                  <div className="space-y-2 pt-2">
                    <SeoIndicator label="Word Count" value={analysis.wordCount} />
                    <SeoIndicator label="Title Length" value={analysis.titleLength} />
                    <SeoIndicator label="Desc. Length" value={analysis.descriptionLength} />
                  </div>
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