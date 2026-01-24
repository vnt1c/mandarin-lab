import { useState } from 'react';
import { SideNav } from '@/components/layout/SideNav';
import { DictionarySearch } from '@/components/dictionary/DictionarySearch';
import { EntryCard } from '@/components/dictionary/EntryCard';
import { lookupDictionary } from '@/services/dictionaryService';
import type { DictionaryEntry } from '@shared';
import { Loader2 } from 'lucide-react';

export default function Dictionary() {
  const [results, setResults] = useState<DictionaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const entries = await lookupDictionary(query);
      setResults(entries);
    } catch (error) {
      console.error('Error looking up word:', error);
      setResults([]);
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
            <h1 className="text-4xl font-serif font-bold mb-2">Dictionary</h1>
            <p className="text-muted-foreground">
              Search for Chinese words with definitions, examples, and HSK levels
            </p>
          </div>

          <DictionarySearch onSearch={handleSearch} isLoading={isLoading} />

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && hasSearched && results.length === 0 && (
            <div className="glass-strong rounded-2xl p-12 text-center mt-8">
              <p className="text-muted-foreground">No results found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Try searching for: 学习, 中文, 天气, or 爱
              </p>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="grid gap-6 mt-8">
              {results.map((entry, idx) => (
                <EntryCard key={idx} entry={entry} />
              ))}
            </div>
          )}

          {!isLoading && !hasSearched && (
            <div className="glass-strong rounded-2xl p-12 text-center mt-8">
              <p className="text-muted-foreground">
                Search for a word to get started
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Try: 学习, 中文, 天气, or 爱
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
