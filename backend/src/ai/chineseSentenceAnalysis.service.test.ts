import { describe, it, expect, vi, beforeEach } from "vitest";
import { HttpError } from "@/lib/HttpError";
import type { SentenceAnalysis } from "@shared";

// Replaces the real client, so no network call and no API key is needed.
const generateContent = vi.fn();
vi.mock("@/ai/geminiClient", () => ({
  gemini: { models: { generateContent: (...args: unknown[]) => generateContent(...args) } },
}));

const { analyzeChineseSentence } = await import("@/ai/chineseSentenceAnalysis.service");

/** A response that satisfies the schema, used as the baseline for edits. */
function validAnalysis(): SentenceAnalysis {
  return {
    sentence: "我爱中文",
    translation: "I love Chinese.",
    example_context: "Said when expressing enthusiasm for studying Chinese.",
    structures: [],
    tokens: [
      {
        text: "我",
        pinyin: "wǒ",
        zhuyin: "ㄨㄛˇ",
        role: "pronoun",
        english: "I",
        usage_tags: [],
      },
    ],
  };
}

function respondWith(text: string | undefined) {
  generateContent.mockResolvedValue({ text });
}

describe("analyzeChineseSentence", () => {
  beforeEach(() => {
    generateContent.mockReset();
    // The service logs schema violations on purpose; keep it out of test output.
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("request", () => {
    it("constrains generation with the shared schema rather than trusting the prompt", async () => {
      respondWith(JSON.stringify(validAnalysis()));
      await analyzeChineseSentence("我爱中文");

      const config = generateContent.mock.calls[0][0].config;
      expect(config.responseMimeType).toBe("application/json");
      expect(config.responseJsonSchema).toMatchObject({
        type: "object",
        properties: expect.objectContaining({
          tokens: expect.any(Object),
          translation: expect.any(Object),
        }),
      });
    });

    it("passes the sentence through to the model", async () => {
      respondWith(JSON.stringify(validAnalysis()));
      await analyzeChineseSentence("我爱中文");

      expect(generateContent.mock.calls[0][0].contents).toContain("我爱中文");
    });
  });

  describe("bad responses", () => {
    it("rejects an empty response as a gateway error", async () => {
      respondWith("");
      await expect(analyzeChineseSentence("我爱中文")).rejects.toMatchObject({
        status: 502,
      });
    });

    it("rejects a missing response body", async () => {
      respondWith(undefined);
      await expect(analyzeChineseSentence("我爱中文")).rejects.toBeInstanceOf(
        HttpError
      );
    });

    it("rejects output that is not JSON", async () => {
      respondWith("Sure! Here is your analysis:");
      await expect(analyzeChineseSentence("我爱中文")).rejects.toMatchObject({
        status: 502,
        message: expect.stringContaining("invalid JSON"),
      });
    });

    it("rejects JSON that does not satisfy the schema", async () => {
      const missingTranslation: Record<string, unknown> = validAnalysis();
      delete missingTranslation.translation;
      respondWith(JSON.stringify(missingTranslation));

      await expect(analyzeChineseSentence("我爱中文")).rejects.toMatchObject({
        status: 502,
      });
    });

    it("rejects a token whose role is outside the enum", async () => {
      const analysis = validAnalysis();
      // The model inventing its own part of speech must not reach the client.
      (analysis.tokens[0] as unknown as Record<string, unknown>).role = "gerund";
      respondWith(JSON.stringify(analysis));

      await expect(analyzeChineseSentence("我爱中文")).rejects.toMatchObject({
        status: 502,
      });
    });

    it("never leaks the raw model output in the error message", async () => {
      respondWith('{"sentence": "leaked secret content"}');
      await expect(analyzeChineseSentence("我爱中文")).rejects.toMatchObject({
        message: expect.not.stringContaining("leaked secret content"),
      });
    });
  });

  describe("good responses", () => {
    it("returns the parsed analysis", async () => {
      respondWith(JSON.stringify(validAnalysis()));
      const result = await analyzeChineseSentence("我爱中文");

      expect(result.sentence).toBe("我爱中文");
      expect(result.tokens).toHaveLength(1);
      expect(result.tokens[0].pinyin).toBe("wǒ");
    });

    it("tolerates surrounding whitespace in the response", async () => {
      respondWith(`\n  ${JSON.stringify(validAnalysis())}  \n`);
      await expect(analyzeChineseSentence("我爱中文")).resolves.toMatchObject({
        sentence: "我爱中文",
      });
    });

    it("strips keys the schema does not declare", async () => {
      const withExtra = { ...validAnalysis(), hallucinated_field: "drop me" };
      respondWith(JSON.stringify(withExtra));

      const result = await analyzeChineseSentence("我爱中文");
      expect(result).not.toHaveProperty("hallucinated_field");
    });
  });
});
