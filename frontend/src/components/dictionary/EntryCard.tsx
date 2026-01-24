import type { DictionaryEntry } from '@shared';
import { Badge } from '@/components/ui/badge';

interface EntryCardProps {
  entry: DictionaryEntry;
}

export const EntryCard = ({ entry }: EntryCardProps) => {
  return (
    <div className="glass-strong rounded-2xl p-6 shadow-soft hover:shadow-elevated transition-smooth">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-3xl font-serif font-semibold mb-1">{entry.headword}</h3>
          <p className="text-lg text-muted-foreground">{entry.pinyin}</p>
        </div>
        <div className="flex gap-2">
          {entry.hsk && (
            <Badge variant="secondary">HSK {entry.hsk}</Badge>
          )}
          {entry.frequency && (
            <Badge variant="outline">{entry.frequency}</Badge>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {entry.senses.map((sense, idx) => (
          <div key={idx} className="flex gap-3">
            <Badge className="shrink-0">{sense.pos}</Badge>
            <p className="text-sm">{sense.def}</p>
          </div>
        ))}
      </div>

      {entry.examples.length > 0 && (
        <div className="pt-4 border-t">
          <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
            Example Sentences
          </h4>
          <div className="space-y-3">
            {entry.examples.map((example, idx) => (
              <div key={idx} className="text-sm space-y-1">
                <p className="font-serif text-base">{example.hanzi}</p>
                <p className="text-muted-foreground">{example.pinyin}</p>
                <p className="text-muted-foreground italic">{example.gloss}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
