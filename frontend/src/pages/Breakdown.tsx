import { useState } from 'react';
import { SideNav } from '@/components/layout/SideNav';
import { SentenceInput } from '@/components/sentence/SentenceInput';
import { BreakdownPanel } from '@/components/sentence/BreakdownPanel';
import { analyzeSentence } from '@/services/analysisService';
import { useAppStore } from '@/stores/appStore';
import type { SentenceAnalysis } from '@shared';
import { Loader2 } from 'lucide-react';
import { SentencePanel } from '@/components/sentence/SentencePanel';
import { toast } from '@/hooks/use-toast';

export default function Breakdown() {
  const { currentAnalysis, setCurrentAnalysis } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async (text: string) => {
    setIsLoading(true);
    try {
      const analysis = await analyzeSentence(text);
      setCurrentAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing sentence:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze sentence';
      
      if (errorMessage.includes('30') || text.length > 30) {
        toast({ title: 'Sentence is too long', description: 'Please use 30 characters or less' });
      } else {
        toast({ title: 'Error', description: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <SideNav />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-serif font-bold mb-2">Sentence Breakdown</h1>
            <p className="text-muted-foreground">
              Enter a Chinese sentence to see detailed analysis with grammar notes
            </p>
          </div>

          <SentenceInput onAnalyze={handleAnalyze} isLoading={isLoading} />

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && currentAnalysis && (
            <>
              <SentencePanel analysis={currentAnalysis} />
              <BreakdownPanel analysis={currentAnalysis} />
            </>
          )}

          {!isLoading && !currentAnalysis && (
            <div className="glass-strong rounded-2xl p-12 text-center mt-8">
              <p className="text-muted-foreground">
                Enter a sentence above to get started
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Try: "我爱学中文" or "今天天气很好"
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
