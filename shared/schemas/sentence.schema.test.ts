import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
  sentenceAnalysisSchema,
  saveAnalysisBodySchema,
  structureSchema,
  tokenSchema,
} from "./sentence.schema";

/**
 * This schema is the contract three things agree on: it constrains Gemini's
 * generation, validates what comes back, and derives the frontend's types. A
 * change that slips through here silently changes all three.
 */

function validToken() {
  return {
    text: "我",
    pinyin: "wǒ",
    zhuyin: "ㄨㄛˇ",
    role: "pronoun",
    english: "I",
  };
}

function validAnalysis() {
  return {
    sentence: "我爱中文",
    translation: "I love Chinese.",
    example_context: "Said when expressing enthusiasm for studying Chinese.",
    tokens: [validToken()],
  };
}

describe("tokenSchema", () => {
  it("accepts a minimal token and defaults usage_tags to empty", () => {
    const parsed = tokenSchema.parse(validToken());
    expect(parsed.usage_tags).toEqual([]);
  });

  it.each(["text", "pinyin", "zhuyin", "role", "english"])(
    "requires %s",
    (field) => {
      const token: Record<string, unknown> = validToken();
      delete token[field];
      expect(tokenSchema.safeParse(token).success).toBe(false);
    }
  );

  it("rejects a part of speech outside the enum", () => {
    expect(
      tokenSchema.safeParse({ ...validToken(), role: "gerund" }).success
    ).toBe(false);
  });

  it("accepts every role the enum declares", () => {
    const roles = [
      "noun", "pronoun", "verb", "adjective", "adverb", "preposition",
      "classifier", "particle", "conjunction", "interjection", "number",
      "idiom", "aspect_marker", "localizer", "modifier",
    ];
    for (const role of roles) {
      expect(tokenSchema.safeParse({ ...validToken(), role }).success).toBe(true);
    }
  });

  it("caps usage_tags at three", () => {
    const tags = ["slang", "vulgar", "derogatory", "offensive"];
    expect(
      tokenSchema.safeParse({ ...validToken(), usage_tags: tags }).success
    ).toBe(false);
  });

  it("rejects an unknown usage tag", () => {
    expect(
      tokenSchema.safeParse({ ...validToken(), usage_tags: ["rude"] }).success
    ).toBe(false);
  });

  it("rejects an unknown formality level", () => {
    expect(
      tokenSchema.safeParse({ ...validToken(), formality: "casual" }).success
    ).toBe(false);
  });
});

describe("structureSchema", () => {
  const structure = {
    title: "Verb + 不 + Verb",
    highlight: "爱不爱",
    rule: "Repeat the verb around 不 to form a yes/no question.",
    examples: [
      { sentence: "你爱不爱他？", translation: "Do you love him?" },
      { sentence: "你去不去？", translation: "Are you going?" },
    ],
  };

  it("accepts exactly two examples", () => {
    expect(structureSchema.safeParse(structure).success).toBe(true);
  });

  it("rejects one example", () => {
    expect(
      structureSchema.safeParse({
        ...structure,
        examples: [structure.examples[0]],
      }).success
    ).toBe(false);
  });

  it("rejects three examples", () => {
    expect(
      structureSchema.safeParse({
        ...structure,
        examples: [...structure.examples, structure.examples[0]],
      }).success
    ).toBe(false);
  });
});

describe("sentenceAnalysisSchema", () => {
  it("accepts a minimal analysis", () => {
    expect(sentenceAnalysisSchema.safeParse(validAnalysis()).success).toBe(true);
  });

  it("defaults structures to an empty array", () => {
    expect(sentenceAnalysisSchema.parse(validAnalysis()).structures).toEqual([]);
  });

  it("requires at least one token", () => {
    expect(
      sentenceAnalysisSchema.safeParse({ ...validAnalysis(), tokens: [] }).success
    ).toBe(false);
  });

  it("caps structures at three", () => {
    const structure = {
      title: "t",
      highlight: "h",
      rule: "r",
      examples: [
        { sentence: "a", translation: "a" },
        { sentence: "b", translation: "b" },
      ],
    };
    expect(
      sentenceAnalysisSchema.safeParse({
        ...validAnalysis(),
        structures: [structure, structure, structure, structure],
      }).success
    ).toBe(false);
  });

  it("treats correction as optional", () => {
    expect(sentenceAnalysisSchema.parse(validAnalysis()).correction).toBeUndefined();
  });

  it("requires both fields when a correction is present", () => {
    expect(
      sentenceAnalysisSchema.safeParse({
        ...validAnalysis(),
        correction: { message: "missing the object" },
      }).success
    ).toBe(false);
  });

  it("strips keys it does not declare", () => {
    const parsed = sentenceAnalysisSchema.parse({
      ...validAnalysis(),
      injected: "should not survive",
    });
    expect(parsed).not.toHaveProperty("injected");
  });
});

describe("the JSON Schema handed to Gemini", () => {
  const json = z.toJSONSchema(sentenceAnalysisSchema) as {
    required: string[];
    properties: Record<string, { description?: string }>;
  };

  it("marks the fields the model must always produce", () => {
    expect(json.required).toEqual(
      expect.arrayContaining([
        "sentence", "translation", "example_context", "tokens", "structures",
      ])
    );
  });

  it("leaves correction out of required, so the model can omit it", () => {
    expect(json.required).not.toContain("correction");
  });

  it("carries the field descriptions the prompt no longer repeats", () => {
    // The prompt was trimmed on the promise that these reach the model.
    expect(json.properties.translation.description).toBeTruthy();
    expect(json.properties.sentence.description).toBeTruthy();
  });
});

describe("saveAnalysisBodySchema", () => {
  it("accepts a body carrying a valid analysis", () => {
    expect(
      saveAnalysisBodySchema.safeParse({ analysis: validAnalysis() }).success
    ).toBe(true);
  });

  it("rejects a body with no analysis", () => {
    expect(saveAnalysisBodySchema.safeParse({}).success).toBe(false);
  });

  it("rejects an analysis that is not an object", () => {
    expect(
      saveAnalysisBodySchema.safeParse({ analysis: "just a string" }).success
    ).toBe(false);
  });

  it("rejects an analysis with a malformed token, so bad rows never persist", () => {
    expect(
      saveAnalysisBodySchema.safeParse({
        analysis: { ...validAnalysis(), tokens: [{ text: "我" }] },
      }).success
    ).toBe(false);
  });
});
