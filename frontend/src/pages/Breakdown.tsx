// src/pages/Breakdown.tsx
import { useState } from "react";
import { SentenceInput } from "@/components/sentence/SentenceInput";
import { BreakdownPanel } from "@/components/sentence/BreakdownPanel";
import { analyzeSentence } from "@/services/analysisService";
import { useSavedList } from "@/hooks/useSaved";
import { ApiError } from "@/lib/apiClient";
import { useMutation } from "@tanstack/react-query";
import { useAppStore } from "@/stores/appStore";
import { Loader2 } from "lucide-react";
import { SentencePanel } from "@/components/sentence/SentencePanel";
import { toast } from "@/hooks/use-toast";

export default function Breakdown() {
  const currentAnalysis = useAppStore((s) => s.currentAnalysis);
  const setCurrentAnalysis = useAppStore((s) => s.setCurrentAnalysis);
  const [inputValue, setInputValue] = useState("");

  const { data: saved = [] } = useSavedList();

  const analyze = useMutation({
    mutationFn: analyzeSentence,
    onSuccess: setCurrentAnalysis,
    onError: (error) => {
      console.error("Error analyzing sentence:", error);

      // The backend validates in validateSentence.ts and returns 400 with a
      // specific reason; anything else is ours to apologise for.
      if (error instanceof ApiError && error.isClientError) {
        toast({ title: "Invalid sentence", description: error.message });
      } else {
        toast({
          title: "Server Error",
          description: "Please try again later",
        });
      }
    },
  });

  const isLoading = analyze.isPending;

  const handleAnalyze = (text: string) => {
    // Reuse a previous analysis if this sentence is already saved. The list is
    // served from the shared cache, so this costs no request.
    const hit = saved.find((s) => s.sentence === text);
    if (hit) {
      setCurrentAnalysis(hit.analysis);
      return;
    }

    analyze.mutate(text);
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold mb-2">
          Sentence Breakdown
        </h1>
        <p className="text-muted-foreground">
          Enter a Chinese sentence to see detailed analysis with grammar
          notes
        </p>
      </div>

      <SentenceInput
        onAnalyze={handleAnalyze}
        isLoading={isLoading}
        value={inputValue}
        onChange={setInputValue}
      />

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!isLoading && currentAnalysis && (
        <>
          <SentencePanel analysis={currentAnalysis} />
          <BreakdownPanel analysis={currentAnalysis} />
        </>
      )}

      {!isLoading && !currentAnalysis && (
        <div className="glass-strong rounded-2xl p-12 text-center mt-8">
          <p className="text-muted-foreground">
            Enter a sentence above to get started
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Try:{" "}
            <button
              onClick={() => setInputValue("我爱学中文")}
              className="text-primary hover:text-primary/70 cursor-pointer font-medium transition-colors"
            >
              "我爱学中文"
            </button>{" "}
            or{" "}
            <button
              onClick={() => setInputValue("今天天气很好")}
              className="text-primary hover:text-primary/70 cursor-pointer font-medium transition-colors"
            >
              "今天天气很好"
            </button>
          </p>
        </div>
      )}
    </>
  );
}
