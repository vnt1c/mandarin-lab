import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { TokenChip } from './TokenChip';
import type { SentenceAnalysis, Token } from '@shared';
import { Copy, Share2, Bookmark } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { saveSentence } from '@/services/storageService';

interface BreakdownPanelProps {
  analysis: SentenceAnalysis;
}

export const BreakdownPanel = ({ analysis }: BreakdownPanelProps) => {
  const [selectedTokenIdx, setSelectedTokenIdx] = useState<number | null>(null);

  const selectedToken = useMemo(() => {
    if (selectedTokenIdx === null) return null;
    return analysis.tokens[selectedTokenIdx] ?? null;
  }, [analysis.tokens, selectedTokenIdx]);

  const handleCopyPinyin = () => {
    const pinyin = analysis.tokens.map((t) => t.pinyin).join(' ');
    navigator.clipboard.writeText(pinyin);
    toast({ title: 'Pinyin copied to clipboard' });
  };

  const handleShare = () => {
    const text = `${analysis.sentence}\n${analysis.tokens.map((t) => t.pinyin).join(' ')}`;
    navigator.clipboard.writeText(text);
    toast({ title: 'Sentence copied to clipboard' });
  };

  const handleSave = () => {
    saveSentence(analysis);
    toast({ title: 'Sentence saved successfully' });
  };

  return (
    <div className="space-y-6 mt-8">
      <div className="glass-strong rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-semibold">Analysis</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyPinyin}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Pinyin
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="default" size="sm" onClick={handleSave}>
              <Bookmark className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          {analysis.tokens.map((token, idx) => (
            <TokenChip
              key={idx}
              token={token}
              isSelected={idx === selectedTokenIdx}
              onSelect={() => setSelectedTokenIdx(idx)}
            />
          ))}
        </div>

        {/* Token Definition Panel (replaces Grammar Notes) */}
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
            Word Details
          </h3>

          {!selectedToken && (
            <p className="text-sm text-muted-foreground">
              Click a token above to see its definition.
            </p>
          )}

          {selectedToken && (
            <div className="rounded-xl border bg-background/40 p-4 space-y-2">
              <div className="flex items-baseline justify-between gap-4">
                <div className="flex items-baseline gap-3">
                  <div className="text-3xl font-serif">{selectedToken.text}</div>
                  <div className="text-sm text-muted-foreground">{selectedToken.pinyin}</div>
                  <div className="text-xs px-2 py-0.5 rounded-full bg-secondary/30 text-secondary-foreground">
                    {selectedToken.role}
                  </div>
                </div>
              </div>

              {/* "Definition" – use whatever fields you already have */}
              <div className="text-sm">
                <div className="font-medium">Definition</div>
                <div className="text-muted-foreground">
                  {selectedToken.english || 'No definition available.'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
