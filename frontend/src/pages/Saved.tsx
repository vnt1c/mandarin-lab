import { SavedList } from '@/components/saved/SavedList';
import { useAppStore } from '@/stores/appStore';
import { useNavigate } from 'react-router-dom';
import { SavedAnalysis } from '@shared';

import { toast } from '@/hooks/use-toast';

export default function Saved() {
  const navigate = useNavigate();
  const setCurrentAnalysis = useAppStore((state) => state.setCurrentAnalysis);

  const handleReanalyze = (item: SavedAnalysis) => {
    if (!item.analysis || !item.analysis.tokens) {
      toast({
        title: "Cannot re-analyze",
        description: "This saved item is missing analysis data.",
        variant: "destructive",
      });
      return;
    }
    setCurrentAnalysis({
      ...item.analysis,
      sentence: item.sentence,
      translation: item.translation,
      tokens: item.analysis.tokens,
    });
    navigate('/breakdown');
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold mb-2">Saved Sentences</h1>
        <p className="text-muted-foreground">
          Review your saved sentences and their analyses
        </p>
      </div>

      <SavedList onReanalyze={handleReanalyze} />
    </>
  );
}
