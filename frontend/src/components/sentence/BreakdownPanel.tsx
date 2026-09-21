import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { TokenChip } from "./TokenChip";
import type { SentenceAnalysis } from "@shared";
import { Copy, Share2, Bookmark } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSavedList, useSaveAnalysis, useDeleteSaved } from "@/hooks/useSaved";
import { ApiError } from "@/lib/apiClient";

interface BreakdownPanelProps {
  analysis: SentenceAnalysis;
}

export const BreakdownPanel = ({ analysis }: BreakdownPanelProps) => {
  const [selectedTokenIdx, setSelectedTokenIdx] = useState<number | null>(
    analysis.tokens && analysis.tokens.length > 0 ? 0 : null
  );

  // Derived from the shared cache rather than fetched again here.
  const { data: saved = [] } = useSavedList();
  const savedId =
    saved.find((x) => x.sentence === analysis.sentence)?.id ?? null;
  const isSaved = savedId !== null;

  const saveAnalysis = useSaveAnalysis();
  const removeSaved = useDeleteSaved();

  const selectedToken = useMemo(() => {
    if (selectedTokenIdx === null) return null;
    return analysis.tokens[selectedTokenIdx] ?? null;
  }, [analysis.tokens, selectedTokenIdx]);

  const handleCopyPinyin = () => {
    const pinyin = analysis.tokens.map((t) => t.pinyin).join(" ");
    navigator.clipboard.writeText(pinyin);
    toast({ title: "Pinyin copied to clipboard" });
  };

  const handleShare = () => {
    const text = `${analysis.sentence}\n${analysis.tokens
      .map((t) => t.pinyin)
      .join(" ")}`;
    navigator.clipboard.writeText(text);
    toast({ title: "Sentence copied to clipboard" });
  };

  const handleToggleSave = () => {
    const onError = (error: unknown) =>
      toast({
        title: savedId ? "Delete failed" : "Save failed",
        description:
          error instanceof ApiError && error.isClientError
            ? error.message
            : undefined,
        variant: "destructive",
      });

    if (savedId) {
      removeSaved.mutate(savedId, {
        onSuccess: () => toast({ title: "Sentence removed from saved list" }),
        onError,
      });
    } else {
      saveAnalysis.mutate(analysis, {
        onSuccess: () => toast({ title: "Sentence saved successfully" }),
        onError,
      });
    }
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
            <Button
              variant={isSaved ? "secondary" : "default"}
              size="sm"
              onClick={handleToggleSave}
            >
              <Bookmark
                className={"h-4 w-4 mr-2" + (isSaved ? " fill-current" : "")}
                fill={isSaved ? "currentColor" : "none"}
              />
              {isSaved ? "Saved" : "Save"}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-2">
          {analysis.tokens.map((token, idx) => (
            <TokenChip
              key={idx}
              token={token}
              isSelected={idx === selectedTokenIdx}
              onSelect={() => setSelectedTokenIdx(idx)}
            />
          ))}
        </div>

        <div className="pt-6">
          {!selectedToken && (
            <p className="text-sm text-muted-foreground">
              Click a word above to see its definition.
            </p>
          )}

          {selectedToken && (
            <div className="rounded-xl border bg-background/40 p-4 space-y-2">
              <div className="flex items-baseline justify-between gap-4">
                <div className="flex items-baseline gap-4">
                  <div className="text-2xl font-serif">{selectedToken.text}</div>
                  <div className="text-base text-muted-foreground">
                    {selectedToken.pinyin}
                  </div>
                  <div className="text-sm px-2 py-0.5 rounded-full bg-secondary/30 text-secondary-foreground font-semibold">
                    {selectedToken.role}
                  </div>

                  {selectedToken.formality && (
                    <span
                      className={
                        "text-sm px-2 py-0.5 rounded-full font-semibold " +
                        (selectedToken.formality === "formal"
                          ? "bg-blue-100 text-blue-800"
                          : selectedToken.formality === "informal"
                          ? "bg-green-100 text-green-800"
                          : selectedToken.formality === "very_informal"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-200 text-gray-800")
                      }
                    >
                      {selectedToken.formality
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  )}

                  {selectedToken.usage_tags &&
                    selectedToken.usage_tags.length > 0 &&
                    selectedToken.usage_tags.map((tag, idx) => (
                      <span
                        key={tag + idx}
                        className={
                          "text-sm px-2 py-0.5 rounded-full font-semibold " +
                          (tag === "slang"
                            ? "bg-yellow-100 text-yellow-800"
                            : tag === "vulgar"
                            ? "bg-rose-100 text-rose-800"
                            : tag === "derogatory"
                            ? "bg-pink-100 text-pink-800"
                            : tag === "offensive"
                            ? "bg-orange-100 text-orange-800"
                            : tag === "archaic"
                            ? "bg-sky-100 text-sky-800"
                            : "bg-gray-200 text-gray-800")
                        }
                      >
                        {tag.charAt(0).toUpperCase() + tag.slice(1)}
                      </span>
                    ))}
                </div>
              </div>

              <div className="text-base mt-2">
                <div className="font-semibold">Definition</div>
                <div className="text-muted-foreground text-base">
                  {selectedToken.english || "No definition available."}
                </div>

                {selectedToken.role_in_sentence && (
                  <ul className="list-disc ml-5 mt-3">
                    <li className="text-muted-foreground text-sm">
                      {selectedToken.role_in_sentence}
                    </li>
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
