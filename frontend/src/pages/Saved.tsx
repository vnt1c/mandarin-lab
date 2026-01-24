import { useNavigate } from 'react-router-dom';
import { SideNav } from '@/components/layout/SideNav';
import { SavedList } from '@/components/saved/SavedList';
import { useAppStore } from '@/stores/appStore';
import type { SentenceAnalysis } from '@shared';

export default function Saved() {
  const navigate = useNavigate();
  const setCurrentAnalysis = useAppStore((state) => state.setCurrentAnalysis);

  const handleReanalyze = (analysis: SentenceAnalysis) => {
    setCurrentAnalysis(analysis);
    navigate('/breakdown');
  };

  return (
    <div className="flex min-h-screen w-full">
      <SideNav />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-serif font-bold mb-2">Saved Sentences</h1>
            <p className="text-muted-foreground">
              Review your saved sentences and their analyses
            </p>
          </div>

          <SavedList onReanalyze={handleReanalyze} />
        </div>
      </main>
    </div>
  );
}
