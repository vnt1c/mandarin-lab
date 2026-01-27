import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles } from 'lucide-react';

interface SentenceInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: (text: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export const SentenceInput = ({ 
  value,
  onChange,
  onAnalyze, 
  placeholder = 'Enter Chinese text...',
  isLoading = false 
}: SentenceInputProps) => {
  const CHAR_LIMIT = 50;
  const remaining = CHAR_LIMIT - value.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onAnalyze(value.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 relative">
      <div className="flex-1 relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="text-lg h-14 glass-strong focus:ring-2 focus:ring-primary pr-16"
          disabled={isLoading}
        />
        <span
          className={`absolute right-3 bottom-2 text-xs select-none ${remaining < 0 ? 'text-red-500' : 'text-muted-foreground'}`}
        >
          {remaining}
        </span>
      </div>
      <Button 
        type="submit" 
        disabled={!value.trim() || isLoading}
        className="px-6 h-14"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Analyze
      </Button>
    </form>
  );
};
