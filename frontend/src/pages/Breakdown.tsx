// src/pages/Breakdown.tsx
import { useState } from "react";
import { SideNav } from "@/components/layout/SideNav";
import { SentenceInput } from "@/components/sentence/SentenceInput";
import { BreakdownPanel } from "@/components/sentence/BreakdownPanel";
import { analyzeSentence } from "@/services/analysisService";
import { fetchSaved } from "@/services/savedApi";
import { ApiError } from "@/lib/apiClient";
import { useAppStore } from "@/stores/appStore";
import { Loader2 } from "lucide-react";
import { SentencePanel } from "@/components/sentence/SentencePanel";
import { toast } from "@/hooks/use-toast";

export default function Breakdown() {
  const { currentAnalysis, setCurrentAnalysis } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleAnalyze = async (text: string) => {
    setIsLoading(true);
    try {
      // Reuse a previous analysis if this sentence is already saved. Analysis
      // does not require auth, so a failure here must not block it.
      const hit = await fetchSaved()
        .then((saved) => saved.find((s) => s.sentence === text))
        .catch(() => undefined);

      if (hit) {
        setCurrentAnalysis(hit.analysis);
        return;
      }

      const analysis = await analyzeSentence(text);
      setCurrentAnalysis(analysis);
    } catch (error) {
      console.error("Error analyzing sentence:", error);

      // The backend validates in validateSentence.ts and returns 400 with a
      // specific reason; anything else is ours to apologise for.
      if (error instanceof ApiError && error.isClientError) {
        toast({
          title: "Invalid sentence",
          description: error.message,
        });
      } else {
        toast({
          title: "Server Error",
          description: "Please try again later",
        });
      }
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
        </div>
      </main>
    </div>
  );
}
