import { useState } from 'react';
import type { Token } from '@shared';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TokenChipProps {
  token: Token;
  isSelected?: boolean;
  onSelect?: () => void;
}

// Map full part of speech names to abbreviations
const roleAbbreviations: Record<string, string> = {
  pronoun: 'pron',
  preposition: 'prep',
  conjunction: 'conj',
  particle: 'part',
  adjective: 'adj',
  adverb: 'adv',
  verb: 'verb',
  noun: 'noun',
  numeral: 'num',
  classifier: 'clas',
  interjection: 'interj',
  onomatopoeia: 'ono',
  idiom: 'idiom',
  expression: 'expr',
  phrase: 'phrase',
  suffix: 'suf',
  prefix: 'pref',
  properNoun: 'pn',
  // Add more as needed
};

function getRoleAbbreviation(role?: string) {
  if (!role) return '';
  // Try direct match, then lowercase match
  return roleAbbreviations[role] || roleAbbreviations[role.toLowerCase()] || role;
}

export const TokenChip = ({ token, isSelected, onSelect }: TokenChipProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TooltipProvider>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {/* OUTER: ring layer */}
        <div
          className={cn(
            "rounded-xl p-[2px]", // space for ring so it doesn't overlap the shadow
            isSelected && "ring-2 ring-primary/60"
          )}
        >
          {/* INNER: shadow + hover animation layer */}
          <div
            role="button"
            tabIndex={0}
            onClick={onSelect}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSelect?.();
            }}
            className={cn(
              "inline-flex flex-col items-center gap-1 p-3 glass rounded-xl border",
              "hover:shadow-soft transition-smooth group outline-none"
            )}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center gap-1 cursor-pointer">
                  <span className="text-2xl font-serif">{token.text}</span>
                  <span className="text-xs text-muted-foreground">{token.pinyin}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/30 text-secondary-foreground">
                    {getRoleAbbreviation(token.role)}
                  </span>
                </div>
              </TooltipTrigger>
            </Tooltip>

            <CollapsibleContent className="text-xs text-center mt-2 text-muted-foreground">
              {getRoleAbbreviation(token.role)}
            </CollapsibleContent>
          </div>
        </div>
      </Collapsible>
    </TooltipProvider>
  );
};
