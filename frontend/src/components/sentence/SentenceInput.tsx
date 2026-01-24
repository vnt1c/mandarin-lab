import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles } from 'lucide-react';

interface SentenceInputProps {
  onAnalyze: (text: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export const SentenceInput = ({ 
  onAnalyze, 
  placeholder = 'Enter Chinese text...',
  isLoading = false 
}: SentenceInputProps) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAnalyze(input.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className="flex-1 text-lg h-12 glass-strong focus:ring-2 focus:ring-primary"
        disabled={isLoading}
      />
      <Button 
        type="submit" 
        size="lg" 
        disabled={!input.trim() || isLoading}
        className="px-6"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Analyze
      </Button>
    </form>
  );
};
