import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { topic, tone, format, language } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: "Le sujet est requis" },
        { status: 400 }
      );
    }

    const prompt = `Tu es un expert en création de contenu LinkedIn. Génère un post LinkedIn professionnel.

Sujet : ${topic}
Ton : ${tone || "professionnel"}
Format : ${format || "standard"}
Langue : ${language || "français"}

Règles :
- Le post doit être engageant et adapté à LinkedIn
- Utilise des emojis de manière modérée et pertinente
- Structure le post avec des sauts de ligne pour la lisibilité
- Inclus un call-to-action à la fin
- Adapte le style au ton demandé
- Si le format est "story", commence par une accroche personnelle
- Si le format est "tips", utilise une liste numérotée
- Si le format est "opinion", prends une position claire
- Le post doit faire entre 150 et 300 mots
- Ne mets PAS de titre en gras au début, commence directement par le contenu
- Génère UNIQUEMENT le texte du post, sans commentaire ni explication`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: prompt,
    });

    const text = response.text;

    return NextResponse.json({ post: text });
  } catch (error) {
    console.error("Error generating post:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du post" },
      { status: 500 }
    );
  }
}
