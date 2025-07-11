'use client';

import { summarizeLesson, type SummarizeLessonInput } from '@/ai/flows/summarize-lesson';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface AiSummaryProps {
  lessonContent: string;
}

export function AiSummary({ lessonContent }: AiSummaryProps) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async (summaryLength: 'short' | 'long') => {
    setIsLoading(true);
    setSummary('');

    const input: SummarizeLessonInput = {
      lessonContent,
      summaryLength,
    };

    try {
      const result = await summarizeLesson(input);
      setSummary(result.summary);
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate summary. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Sparkles className="text-accent" />
          AI 摘要
        </CardTitle>
        <CardDescription>
          由 AI 生成的課程快速概覽。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <Button
            onClick={() => handleSummarize('short')}
            disabled={isLoading}
            variant="outline"
          >
            生成短摘要
          </Button>
          <Button
            onClick={() => handleSummarize('long')}
            disabled={isLoading}
            variant="outline"
          >
            生成長摘要
          </Button>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="animate-spin w-5 h-5" />
            <span>Generating summary...</span>
          </div>
        )}
        {summary && (
          <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-muted/50 rounded-lg">
            {summary.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
