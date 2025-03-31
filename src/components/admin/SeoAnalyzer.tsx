
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { analyzeReadability, generateSeoSuggestions } from '@/services/blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Check, Info } from 'lucide-react';

interface SeoAnalyzerProps {
  title: string;
  content: string;
  excerpt: string;
  tags?: string[];
  onApplySuggestions: (suggestions: { title?: string; description?: string; keywords?: string[] }) => void;
}

const SeoAnalyzer: React.FC<SeoAnalyzerProps> = ({ 
  title, 
  content, 
  excerpt,
  tags = [],
  onApplySuggestions 
}) => {
  const [seoTitle, setSeoTitle] = useState(title);
  const [seoDescription, setSeoDescription] = useState(excerpt.substring(0, 160));
  const [seoKeywords, setSeoKeywords] = useState<string[]>(tags);
  const [readabilityScore, setReadabilityScore] = useState(0);
  const [readabilityFeedback, setReadabilityFeedback] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('seo');
  const [readingTime, setReadingTime] = useState('');

  useEffect(() => {
    // Re-analyze when content changes
    if (content) {
      const { score, feedback } = analyzeReadability(content);
      setReadabilityScore(score);
      setReadabilityFeedback(feedback);
      
      // Calculate reading time
      const wordsPerMinute = 200;
      const wordCount = content.split(/\s+/).length;
      const minutes = Math.ceil(wordCount / wordsPerMinute);
      setReadingTime(`${minutes} min read`);
    }
    
    // Generate SEO suggestions
    const { title: suggestedTitle, description, keywords } = generateSeoSuggestions({
      id: 0,
      title,
      slug: '',
      excerpt,
      content,
      category: '',
      published: false,
      createdAt: '',
      updatedAt: ''
    });
    
    setSeoTitle(suggestedTitle);
    setSeoDescription(description);
    setSeoKeywords(keywords);
  }, [title, content, excerpt, tags]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleApplySuggestions = () => {
    onApplySuggestions({
      title: seoTitle,
      description: seoDescription,
      keywords: seoKeywords
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Content Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="seo" className="flex-1">SEO</TabsTrigger>
            <TabsTrigger value="readability" className="flex-1">Readability</TabsTrigger>
          </TabsList>
          
          <TabsContent value="seo" className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">SEO Title ({seoTitle.length}/60)</label>
              <Input 
                value={seoTitle} 
                onChange={(e) => setSeoTitle(e.target.value)}
                className={seoTitle.length > 60 ? 'border-red-500' : ''}
              />
              {seoTitle.length > 60 && (
                <p className="text-xs text-red-500">Title is too long</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Meta Description ({seoDescription.length}/160)</label>
              <Textarea 
                value={seoDescription} 
                onChange={(e) => setSeoDescription(e.target.value)}
                className={seoDescription.length > 160 ? 'border-red-500' : ''}
                rows={3}
              />
              {seoDescription.length > 160 && (
                <p className="text-xs text-red-500">Description is too long</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Keywords</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {seoKeywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {keyword}
                    <button 
                      onClick={() => setSeoKeywords(keywords => keywords.filter((_, i) => i !== index))}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input 
                  id="new-keyword" 
                  placeholder="Add keyword"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                      setSeoKeywords([...seoKeywords, (e.target as HTMLInputElement).value.trim()]);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
              </div>
            </div>
            
            <Button onClick={handleApplySuggestions} className="w-full mt-4">
              Apply SEO Suggestions
            </Button>
          </TabsContent>
          
          <TabsContent value="readability" className="mt-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Readability Score</label>
                <span className="text-sm font-bold">{readabilityScore}/100</span>
              </div>
              <Progress value={readabilityScore} className={getScoreColor(readabilityScore)} />
              
              <div className="flex items-center gap-2 text-sm mt-2">
                <Info size={16} />
                <span>Estimated reading time: {readingTime}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Suggestions</label>
              {readabilityFeedback.length > 0 ? (
                <div className="space-y-2">
                  {readabilityFeedback.map((suggestion, index) => (
                    <Alert key={index}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{suggestion}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              ) : (
                <Alert>
                  <Check className="h-4 w-4 text-green-500" />
                  <AlertDescription>No readability issues found!</AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SeoAnalyzer;
