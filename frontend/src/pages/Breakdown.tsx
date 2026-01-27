// src/pages/Breakdown.tsx
import { useState } from "react";
import { SideNav } from "@/components/layout/SideNav";
import { SentenceInput } from "@/components/sentence/SentenceInput";
import { BreakdownPanel } from "@/components/sentence/BreakdownPanel";
import { analyzeSentence } from "@/services/analysisService";
import { fetchSaved } from "@/services/savedApi";
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
      // Check if sentence is already saved (backend)
      const saved = await fetchSaved();
      const hit = saved.find((s) => s.sentence === text);
      if (hit) {
        setCurrentAnalysis(hit.analysis);
        return;
      }

      const analysis = await analyzeSentence(text);
      setCurrentAnalysis(analysis);
    } catch (error) {
      console.error("Error analyzing sentence:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to analyze sentence";

      if (errorMessage.includes("50") || text.length > 50) {
        toast({
          title: "Sentence is too long",
          description: "Please use 50 characters or less",
        });
      } else if (
        errorMessage.includes("must be a string") ||
        errorMessage.includes("empty") ||
        errorMessage.includes("max length") ||
        errorMessage.includes("unsupported characters") ||
        errorMessage.includes("at least one Chinese character") ||
        errorMessage.includes("repeated punctuation") ||
        errorMessage.includes("contains invisible/control characters")
      ) {
        toast({
          title: "Invalid sentence",
          description: "Please try a different sentence",
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
