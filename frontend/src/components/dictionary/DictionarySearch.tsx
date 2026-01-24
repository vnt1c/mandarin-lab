import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface DictionarySearchProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export const DictionarySearch = ({ onSearch, isLoading }: DictionarySearchProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a word (汉字 or pinyin)..."
        className="flex-1 text-lg h-12 glass-strong focus:ring-2 focus:ring-primary"
        disabled={isLoading}
      />
      <Button 
        type="submit" 
        size="lg" 
        disabled={!query.trim() || isLoading}
        className="px-6"
      >
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>
    </form>
  );
};
