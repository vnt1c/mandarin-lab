import { Request, Response } from "express";
import { analyzeChineseSentence } from "../ai";

export async function analyzeSentence(
    req: Request,
    res: Response
) {
    const { sentence } = req.body;

    if (!sentence || typeof sentence !== "string") {
        return res.status(400).json({ error: "sentence must be a string" });
    }

    if (sentence.length > 30) {
        return res.status(400).json({ error: "sentence must be 30 characters or less" });
    }

    try {
        const geminiResult = await analyzeChineseSentence(sentence);
        
        // Return the Gemini result directly - it already matches the schema
        const result = {
            sentence: geminiResult.sentence,
            translation: geminiResult.translation,
            tokens: geminiResult.tokens,
            example_context: geminiResult.example_context,
            additional_notes: geminiResult.additional_notes,
        };
        
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to analyze sentence" });
    }
} 