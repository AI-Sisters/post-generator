import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { topic, style } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: "Le sujet est requis" },
        { status: 400 }
      );
    }

    const prompt = `Create a professional, modern illustration for a LinkedIn post about: "${topic}".
Style: ${style || "modern and clean"}.
The image should be visually striking, use a pink/magenta color palette as accent, and feel professional.
No text in the image. Abstract or conceptual visuals preferred.
16:9 aspect ratio, suitable for a LinkedIn post banner.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: prompt,
    });

    // Extract image from response parts
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      return NextResponse.json(
        { error: "Aucune image générée" },
        { status: 500 }
      );
    }

    const parts = candidates[0].content?.parts;
    if (!parts) {
      return NextResponse.json(
        { error: "Aucune image générée" },
        { status: 500 }
      );
    }

    for (const part of parts) {
      if (part.inlineData) {
        return NextResponse.json({
          image: part.inlineData.data,
          mimeType: part.inlineData.mimeType || "image/png",
        });
      }
    }

    return NextResponse.json(
      { error: "Aucune image dans la réponse" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération de l'image" },
      { status: 500 }
    );
  }
}
