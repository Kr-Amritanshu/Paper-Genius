import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, FileText, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import type { ResearchPaper } from "@shared/schema";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [citationStyle, setCitationStyle] = useState<"APA" | "IEEE" | "MLA">("APA");
  const [generatedPaper, setGeneratedPaper] = useState<ResearchPaper | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    abstract: true,
    introduction: true,
    methods: false,
    results: false,
    discussion: false,
    conclusion: false,
  });
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/generate", {
        topic,
        citationStyle,
      });
      return await response.json() as ResearchPaper;
    },
    onSuccess: (data) => {
      setGeneratedPaper(data);
      queryClient.invalidateQueries({ queryKey: ["/api/papers"] });
      toast({
        title: "Paper Generated!",
        description: "Your research paper is ready to preview and download.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate research paper. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a research topic to generate a paper.",
        variant: "destructive",
      });
      return;
    }
    setGeneratedPaper(null);
    generateMutation.mutate();
  };

  const handleDownloadPDF = () => {
    if (generatedPaper) {
      window.open(`/api/papers/${generatedPaper.id}/pdf`, '_blank');
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderSection = (title: string, content: string, sectionKey: string) => {
    const isExpanded = expandedSections[sectionKey];
    return (
      <Collapsible open={isExpanded} onOpenChange={() => toggleSection(sectionKey)}>
        <Card className="mb-4">
          <CollapsibleTrigger className="w-full" data-testid={`button-toggle-${sectionKey}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
              <CardTitle className="text-xl">{title}</CardTitle>
              {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <p className="text-base leading-relaxed whitespace-pre-wrap" data-testid={`text-${sectionKey}`}>
                {content}
              </p>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-title">
            AI Research Paper Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-subtitle">
            Generate comprehensive, academically rigorous research papers with authentic references
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Research Topic
              </CardTitle>
              <CardDescription>
                Enter your research topic and select your preferred citation style
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Textarea
                  placeholder="Enter your research topic... (e.g., 'Impact of quantum computing on cryptographic security')"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="min-h-32"
                  data-testid="input-topic"
                />
                <p className="text-sm text-muted-foreground text-right mt-2">
                  {topic.length} characters
                </p>
              </div>

              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Citation Style</label>
                  <Select value={citationStyle} onValueChange={(v) => setCitationStyle(v as any)}>
                    <SelectTrigger data-testid="select-citation-style">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="APA">APA</SelectItem>
                      <SelectItem value="IEEE">IEEE</SelectItem>
                      <SelectItem value="MLA">MLA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={generateMutation.isPending || !topic.trim()}
                className="w-full"
                size="lg"
                data-testid="button-generate"
              >
                {generateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Paper...
                  </>
                ) : (
                  <>
                    <BookOpen className="mr-2 h-5 w-5" />
                    Generate Research Paper
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {generateMutation.isPending && (
          <div className="max-w-4xl mx-auto mb-8">
            <Card>
              <CardContent className="py-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <p className="text-base font-medium">Analyzing topic and fetching references...</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <p className="text-base font-medium">Generating sections with AI...</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <p className="text-base font-medium">Formatting citations...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {generatedPaper && (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Generated Paper</h2>
              <Button onClick={handleDownloadPDF} size="lg" data-testid="button-download-pdf">
                <Download className="mr-2 h-5 w-5" />
                Download PDF
              </Button>
            </div>

            <Tabs defaultValue="preview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview" data-testid="tab-preview">Preview</TabsTrigger>
                <TabsTrigger value="references" data-testid="tab-references">
                  References ({generatedPaper.references.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-3xl text-center" data-testid="text-paper-title">
                      {generatedPaper.title}
                    </CardTitle>
                  </CardHeader>
                </Card>

                {renderSection("Abstract", generatedPaper.abstract, "abstract")}
                {renderSection("Introduction", generatedPaper.introduction, "introduction")}
                {renderSection("Methods", generatedPaper.methods, "methods")}
                {renderSection("Results", generatedPaper.results, "results")}
                {renderSection("Discussion", generatedPaper.discussion, "discussion")}
                {renderSection("Conclusion", generatedPaper.conclusion, "conclusion")}
              </TabsContent>

              <TabsContent value="references">
                <Card>
                  <CardHeader>
                    <CardTitle>References</CardTitle>
                    <CardDescription>
                      {generatedPaper.references.length} authentic references from Semantic Scholar
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {generatedPaper.references.map((ref, idx) => (
                        <div
                          key={idx}
                          className="border-b last:border-b-0 pb-4 last:pb-0"
                          data-testid={`reference-${idx}`}
                        >
                          <div className="flex gap-3">
                            <span className="font-semibold text-muted-foreground">[{idx + 1}]</span>
                            <div className="flex-1">
                              <p className="font-medium mb-1">{ref.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {ref.authors.join(", ")} ({ref.year})
                              </p>
                              {ref.doi && (
                                <a
                                  href={`https://doi.org/${ref.doi}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary hover:underline"
                                >
                                  DOI: {ref.doi}
                                </a>
                              )}
                              {!ref.doi && ref.url && (
                                <a
                                  href={ref.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary hover:underline"
                                >
                                  View Paper
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
