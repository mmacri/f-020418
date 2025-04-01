
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@/services/blog';
import { analyzeReadability } from '@/services/blog/analysis';

interface SeoAnalyzerProps {
  content: string;
  onAnalysisComplete?: (score: number) => void;
}

const SeoAnalyzer: React.FC<SeoAnalyzerProps> = ({ content, onAnalysisComplete }) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      // Create a temporary blog post object to analyze
      const tempPost = {
        id: 0,
        title: '',
        slug: '',
        excerpt: '',
        content: content,
        published: false
      } as BlogPost;
      
      const results = analyzeReadability(content);
      setAnalysis(results);
      if (onAnalysisComplete) {
        onAnalysisComplete(results.readabilityScore);
      }
      setIsAnalyzing(false);
    }, 500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Content Readability Analysis</span>
          <Button 
            onClick={runAnalysis} 
            disabled={isAnalyzing || !content}
            size="sm"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {analysis ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded p-3">
                <div className="text-sm text-muted-foreground">Word Count</div>
                <div className="text-xl font-bold">{analysis.wordCount}</div>
              </div>
              <div className="border rounded p-3">
                <div className="text-sm text-muted-foreground">Reading Time</div>
                <div className="text-xl font-bold">{analysis.readTime}</div>
              </div>
            </div>
            
            <div className="border rounded p-3">
              <div className="text-sm text-muted-foreground">Readability Score</div>
              <div className="flex items-center">
                <div className="text-xl font-bold mr-2">{Math.round(analysis.readabilityScore)}</div>
                <div className="text-sm px-2 py-1 rounded bg-gray-100">
                  {analysis.readabilityLevel}
                </div>
              </div>
            </div>
            
            {analysis.feedback && analysis.feedback.length > 0 && (
              <div className="border rounded p-3">
                <div className="text-sm text-muted-foreground mb-2">Suggestions</div>
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.feedback.map((item: string, index: number) => (
                    <li key={index} className="text-sm">{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {content ? 'Click "Analyze Content" to check readability metrics.' : 'Add content to analyze readability.'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SeoAnalyzer;
