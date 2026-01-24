import { useEffect, useMemo, useState } from "react";
import type { SentenceAnalysis } from "@shared";
import { Button } from "@/components/ui/button";
import { Volume2, Square } from "lucide-react";

interface SentencePanelProps {
  analysis: SentenceAnalysis;
}

const pickPreferredZhVoice = (voices: SpeechSynthesisVoice[]) => {
  const zhCN = voices.filter((v) => (v.lang || "").toLowerCase() === "zh-cn");
  if (zhCN.length === 0) return null;

  // Best options on your machine (based on your list)
  const preferredNames = [
    "Tingting",
    "Google 普通话（中国大陆）",
  ];

  for (const name of preferredNames) {
    const hit = zhCN.find((v) => v.name === name);
    if (hit) return hit;
  }

  // Avoid "character" voices if possible
  const avoid = ["Eddy", "Flo", "Grandma", "Grandpa", "Reed", "Rocko", "Sandy", "Shelley"];
  const nonCharacter = zhCN.find((v) => !avoid.some((a) => v.name.includes(a)));
  if (nonCharacter) return nonCharacter;

  // Last resort
  return zhCN[0];
};


export const SentencePanel = ({ analysis }: SentencePanelProps) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (!supported) return;

    const load = () => setVoices(window.speechSynthesis.getVoices() || []);
    load();
    window.speechSynthesis.onvoiceschanged = load;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, [supported]);

  const zhVoice = useMemo(() => pickPreferredZhVoice(voices), [voices]);

  const toggleSpeak = () => {
    if (!supported) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = (analysis.sentence || "").trim();
    if (!text) return;

    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(text);
    u.lang = zhVoice?.lang ?? "zh-CN";
    if (zhVoice) u.voice = zhVoice;

    u.rate = 1.0;
    u.pitch = 1.0;
    u.volume = 1.0;

    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(u);
  };

  const sentenceText = (analysis.sentence || "").trim();

  return (
    <div className="space-y-6 mt-8">
      <div className="glass-strong rounded-2xl p-6 mb-6">
        {/* Sentence + Translation + Speak */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 min-w-0">
            <h2 className="text-2xl font-serif font-semibold break-words">
              {analysis.sentence}
            </h2>

            <p className="text-muted-foreground text-base">
              {analysis.translation}
            </p>
          </div>

          <div className="shrink-0">
            <Button
              type="button"
              variant={isSpeaking ? "outline" : "secondary"}
              size="sm"
              onClick={toggleSpeak}
              disabled={!supported || !sentenceText}
              title={supported ? (isSpeaking ? "Stop" : "Speak sentence") : "Speech not supported"}
            >
              {isSpeaking ? (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4 mr-2" />
                  Speak
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Context */}
        {analysis.example_context && (
          <div className="mt-4 text-sm">
            <span className="font-semibold text-muted-foreground uppercase tracking-wide mr-2">
              Context
            </span>
            <span className="text-muted-foreground">{analysis.example_context}</span>
          </div>
        )}

        {/* Additional Notes */}
        {analysis.additional_notes && analysis.additional_notes.length > 0 && (
          <div className="mt-4 pt-4 border-t text-sm">
            <span className="font-semibold text-muted-foreground uppercase tracking-wide mr-2">
              Notes
            </span>
            <ul className="space-y-2 mt-3">
              {analysis.additional_notes.map((note, idx) => (
                <li key={idx} className="text-sm flex gap-2">
                  <span className="text-primary">•</span>
                  <span className="text-muted-foreground">{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!supported && (
          <div className="mt-4 text-sm text-muted-foreground">
            Speech synthesis isn’t available in this browser.
          </div>
        )}
      </div>
    </div>
  );
};
