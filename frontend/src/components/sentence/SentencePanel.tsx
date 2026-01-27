import { useEffect, useMemo, useState } from "react";
import type { SentenceAnalysis } from "@shared";
import { Button } from "@/components/ui/button";
import { Volume2, Square, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface SentencePanelProps {
  analysis: SentenceAnalysis;
}

const pickPreferredZhVoice = (voices: SpeechSynthesisVoice[]) => {
  const zhCN = voices.filter((v) => (v.lang || "").toLowerCase() === "zh-cn");
  if (zhCN.length === 0) return null;

  // Best options on your machine (based on your list)
  const preferredNames = ["Tingting", "Google 普通话（中国大陆）"];

  for (const name of preferredNames) {
    const hit = zhCN.find((v) => v.name === name);
    if (hit) return hit;
  }

  // Avoid "character" voices if possible
  const avoid = [
    "Eddy",
    "Flo",
    "Grandma",
    "Grandpa",
    "Reed",
    "Rocko",
    "Sandy",
    "Shelley",
  ];
  const nonCharacter = zhCN.find((v) => !avoid.some((a) => v.name.includes(a)));
  if (nonCharacter) return nonCharacter;

  // Last resort
  return zhCN[0];
};

export const SentencePanel = ({ analysis }: SentencePanelProps) => {
  const { toast } = useToast();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;

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

  // Highlight logic for selected structure
  const [openStructure, setOpenStructure] = useState<string | undefined>(
    undefined
  );

  // Collect all unique usage tags from tokens
  const usageTagColors: Record<string, string> = {
    slang: "bg-yellow-100 text-yellow-800", // pastel yellow
    vulgar: "bg-rose-100 text-rose-800", // pastel rose
    derogatory: "bg-pink-100 text-pink-800", // pastel pink
    offensive: "bg-orange-100 text-orange-800", // pastel orange
    archaic: "bg-sky-100 text-sky-800", // pastel blue
  };
  const usageTags = Array.from(
    new Set(
      (analysis.tokens || [])
        .flatMap((t) => t.usage_tags || [])
        .filter(Boolean)
    )
  );

  // Find the highlight for the open structure
  let highlightText: string | undefined = undefined;
  if (analysis.structures && openStructure !== undefined) {
    const idx = parseInt(openStructure, 10);
    if (!isNaN(idx) && analysis.structures[idx]) {
      highlightText = analysis.structures[idx].highlight;
    }
  }

  // ---- Sentence rendering w/ hover pinyin + structure highlight ----

  type Tok = (SentenceAnalysis["tokens"] extends (infer U)[] ? U : never) & {
    text?: string;
    pinyin?: string;
    usage_tags?: string[];
  };

  function computeTokenRanges(sentence: string, tokens: Tok[]) {
    const ranges: Array<{ start: number; end: number }> = [];
    let cursor = 0;

    for (const t of tokens) {
      const piece = t?.text ?? "";
      if (!piece) {
        ranges.push({ start: cursor, end: cursor });
        continue;
      }

      const idx = sentence.indexOf(piece, cursor);
      if (idx === -1) {
        const idx2 = sentence.indexOf(piece);
        if (idx2 === -1) {
          ranges.push({ start: cursor, end: cursor });
          continue;
        }
        ranges.push({ start: idx2, end: idx2 + piece.length });
        cursor = idx2 + piece.length;
        continue;
      }

      ranges.push({ start: idx, end: idx + piece.length });
      cursor = idx + piece.length;
    }

    return ranges;
  }

  function computeHighlightRanges(sentence: string, highlight?: string) {
    const out: Array<{ start: number; end: number }> = [];
    if (!highlight) return out;

    let from = 0;
    while (true) {
      const idx = sentence.indexOf(highlight, from);
      if (idx === -1) break;
      out.push({ start: idx, end: idx + highlight.length });
      from = idx + highlight.length;
    }
    return out;
  }

  function overlaps(
    a: { start: number; end: number },
    b: { start: number; end: number }
  ) {
    return a.start < b.end && b.start < a.end;
  }

  function renderSentenceTokens() {
    const sentence = (analysis.sentence || "").trim();
    const tokens = (analysis.tokens || []) as Tok[];

    const tokenRanges = computeTokenRanges(sentence, tokens);

    // Use only the first occurrence for the open structure highlight.
    // (If you need multiple occurrences later, expand this.)
    const hlRanges = computeHighlightRanges(sentence, highlightText);
    const hl = hlRanges[0]; // { start, end } | undefined

    const renderToken = (t: Tok, i: number) => {
      const text = t?.text ?? "";
      const pinyin = (t?.pinyin ?? "").trim();
      const showTip = !!pinyin && text.trim().length > 0;

      return (
        <span key={`${text}-${i}`} className="relative inline-block group align-baseline">
          {showTip && (!hl || !overlaps(tokenRanges[i] ?? { start: 0, end: 0 }, hl)) && (
            <span
              className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-7 z-50 whitespace-nowrap px-2 py-0.5 text-xs font-semibold text-primary bg-white border border-primary/20 rounded shadow-lg opacity-0 translate-y-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-y-0"
              style={{
                boxShadow: "0 4px 24px 0 rgba(16,30,54,0.10), 0 1.5px 6px rgba(0,0,0,0.10)",
                letterSpacing: "0.01em",
                fontFamily: "inherit",
                minWidth: '1.5rem',
                textAlign: 'center',
              }}
            >
              {pinyin}
              {/* Arrow below tooltip (no border, just white fill for a clean look) */}
              <span
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '100%',
                  transform: 'translateX(-50%)',
                  height: 0,
                  width: 0,
                  zIndex: 1,
                }}
              >
                <span
                  style={{
                    display: 'block',
                    width: 0,
                    height: 0,
                    borderLeft: '7px solid transparent',
                    borderRight: '7px solid transparent',
                    borderTop: '7px solid #fff',
                    margin: 0,
                    position: 'absolute',
                    top: 0,
                    left: '-7px',
                  }}
                />
              </span>
            </span>
          )}
          {text}
        </span>
      );
    };

    const out: React.ReactNode[] = [];
    let i = 0;


    while (i < tokens.length) {
      const r = tokenRanges[i] ?? { start: 0, end: 0 };
      const isInHighlight = !!hl && overlaps(r, hl);

      if (!isInHighlight) {
        out.push(renderToken(tokens[i], i));
        i++;
        continue;
      }

      // start a contiguous highlighted run
      const runStart = i;
      let j = i + 1;
      while (j < tokens.length) {
        const rj = tokenRanges[j] ?? { start: 0, end: 0 };
        if (!hl || !overlaps(rj, hl)) break;
        j++;
      }

      // Gather pinyin for the highlighted run
      const highlightedPinyin = tokens.slice(runStart, j).map(t => (t.pinyin ?? '').trim()).filter(Boolean).join(' ');

      out.push(
        <span key={`hl-run-${hl.start}-${hl.end}-${runStart}`} className="relative hl-sweep">
          {/* Show pinyin tooltip above the highlighted run if pinyin exists */}
          {highlightedPinyin && (
            <span
              className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-7 z-50 whitespace-nowrap px-2 py-0.5 text-xs font-semibold text-primary bg-white border border-primary/20 rounded shadow-lg"
              style={{
                boxShadow: "0 4px 24px 0 rgba(16,30,54,0.10), 0 1.5px 6px rgba(0,0,0,0.10)",
                letterSpacing: "0.01em",
                fontFamily: "inherit",
                minWidth: '1.5rem',
                textAlign: 'center',
              }}
            >
              {highlightedPinyin}
              {/* Arrow below tooltip */}
              <span
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '100%',
                  transform: 'translateX(-50%)',
                  height: 0,
                  width: 0,
                  zIndex: 1,
                }}
              >
                <span
                  style={{
                    display: 'block',
                    width: 0,
                    height: 0,
                    borderLeft: '7px solid transparent',
                    borderRight: '7px solid transparent',
                    borderTop: '7px solid #fff',
                    margin: 0,
                    position: 'absolute',
                    top: 0,
                    left: '-7px',
                  }}
                />
              </span>
            </span>
          )}
          {Array.from({ length: j - runStart }, (_, k) => renderToken(tokens[runStart + k], runStart + k))}
        </span>
      );
      i = j;
    }

    return <span className="inline-block">{out}</span>;
  }

  // Simple fallback for highlighting a substring in the sentence
  function getHighlightedSentence(sentence?: string, highlight?: string) {
    if (!sentence || !highlight) return sentence || "";
    const idx = sentence.indexOf(highlight);
    if (idx === -1) return sentence;
    return (
      <>
        {sentence.slice(0, idx)}
        <span className="hl-sweep">{sentence.slice(idx, idx + highlight.length)}</span>
        {sentence.slice(idx + highlight.length)}
      </>
    );
  }

  return (
    <div className="space-y-6 mt-8">
      <div className="glass-strong rounded-2xl p-6 mb-6">
        {/* Sentence */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 min-w-0">
            <h2 className="text-2xl font-serif font-semibold break-words">
              {analysis.tokens?.length
                ? renderSentenceTokens()
                : getHighlightedSentence(analysis.sentence, highlightText)}
            </h2>

            {usageTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {usageTags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs font-medium px-2 py-0.5 rounded ${
                      usageTagColors[tag] || "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </span>
                ))}
              </div>
            )}

            <p className="text-muted-foreground text-base">
              {analysis.translation}
            </p>
          </div>

          <div className="shrink-0 flex gap-2 items-center">
            {/* Speak/Stop icon-only button */}
            <button
              type="button"
              onClick={toggleSpeak}
              disabled={!supported || !sentenceText}
              title={supported ? (isSpeaking ? "Stop" : "Speak sentence") : "Speech not supported"}
              aria-label={isSpeaking ? "Stop" : "Speak"}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors bg-transparent"
              style={{ background: "none", border: "none" }}
            >
              {isSpeaking ? (
                <Square className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Volume2 className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            {/* Copy icon-only button */}
            <button
              type="button"
              onClick={() => {
                if (sentenceText) {
                  navigator.clipboard.writeText(sentenceText);
                  toast({
                    title: "Sentence Copied!",
                    duration: 2000,
                  });
                }
              }}
              disabled={!sentenceText}
              title="Copy sentence"
              aria-label="Copy"
              className="p-1 rounded-full hover:bg-gray-100 transition-colors bg-transparent"
              style={{ background: "none", border: "none" }}
            >
              <Copy className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Example Context */}
        {analysis.example_context && (
          <div className="mt-4">
            <span className="font-semibold text-muted-foreground uppercase tracking-wide mr-2">
              Example Context
            </span>
            <span className="text-muted-foreground text-base">
              {analysis.example_context}
            </span>
          </div>
        )}

        {/* Corrections/Suggestions */}
        {analysis.correction && (
          <div className="text-base pt-4">
            <span className="font-semibold text-muted-foreground uppercase tracking-wide mr-2">
              Correction / Suggestion
            </span>
            <div className="mt-2">
              <div className="mb-1 text-muted-foreground text-base">
                {analysis.correction.message}
              </div>
              <div className="font-serif text-lg">
                {analysis.correction.corrected_sentence}
              </div>
            </div>
          </div>
        )}

        {/* Sentence Structures Dropdown */}
        {analysis.structures && analysis.structures.length > 0 && (
          <div className="mt-8 flex flex-col gap-4 w-full">
            {analysis.structures.map((structure, idx) => {
              const isOpen = openStructure === String(idx);

              return (
                <div
                  key={idx}
                  className={
                    `rounded-xl p-[2px] w-full` +
                    (isOpen ? " ring-2 ring-primary/60" : "")
                  }
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      setOpenStructure(isOpen ? undefined : String(idx))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        setOpenStructure(isOpen ? undefined : String(idx));
                    }}
                    className={
                      `w-full glass rounded-xl border transition-smooth group outline-none flex flex-col items-start p-4 cursor-pointer` +
                      (isOpen ? " bg-background/90" : "") +
                      " hover:shadow-soft"
                    }
                  >
                    <div className="flex items-center gap-2 w-full">
                      <span className="font-serif text-base text-foreground flex-1 font-semibold">
                        {structure.title}
                      </span>
                      <span
                        className={`transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      >
                        <svg
                          className="h-4 w-4 text-muted-foreground"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </span>
                    </div>

                    {/* animated dropdown */}
                    <div
                      className={`collapse w-full ${
                        isOpen ? "collapse-open mt-3" : "collapse-closed"
                      }`}
                      aria-hidden={!isOpen}
                    >
                      <div className="collapse-inner">
                        <div className="collapse-content">
                          <div className="mb-2">
                            <span className="font-semibold">Rule: </span>
                            <span>{structure.rule}</span>
                          </div>
                          <div className="mb-2">
                            <span className="font-semibold">Examples:</span>
                            <ul className="list-disc ml-6 mt-1">
                              {structure.examples.map((ex, exIdx) => (
                                <li key={exIdx} className="mb-1">
                                  <span className="font-serif">
                                    {ex.sentence}
                                  </span>
                                  <span className="ml-2 text-muted-foreground">
                                    {ex.translation}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end animated dropdown */}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Additional Notes (optional, not in new design but kept for reference) */}
        {analysis.additional_notes &&
          analysis.additional_notes.length > 0 && (
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
