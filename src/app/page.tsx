"use client";

import { useState } from "react";

const TONES = [
  { value: "professionnel", label: "Professionnel", emoji: "💼" },
  { value: "inspirant", label: "Inspirant", emoji: "✨" },
  { value: "educatif", label: "Éducatif", emoji: "📚" },
  { value: "humoristique", label: "Humoristique", emoji: "😄" },
  { value: "provocateur", label: "Provocateur", emoji: "🔥" },
];

const FORMATS = [
  { value: "standard", label: "Standard", desc: "Post classique" },
  { value: "story", label: "Storytelling", desc: "Histoire personnelle" },
  { value: "tips", label: "Tips & Astuces", desc: "Liste de conseils" },
  { value: "opinion", label: "Opinion", desc: "Prise de position" },
];

const LANGUAGES = [
  { value: "français", label: "Français" },
  { value: "anglais", label: "English" },
];

export default function Home() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professionnel");
  const [format, setFormat] = useState("standard");
  const [language, setLanguage] = useState("français");
  const [post, setPost] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loadingPost, setLoadingPost] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generatePost() {
    if (!topic.trim()) return;
    setLoadingPost(true);
    setPost("");
    try {
      const res = await fetch("/api/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone, format, language }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPost(data.post);
    } catch (err) {
      setPost(
        `Erreur : ${err instanceof Error ? err.message : "Impossible de générer le post"}`
      );
    } finally {
      setLoadingPost(false);
    }
  }

  async function generateImage() {
    if (!topic.trim()) return;
    setLoadingImage(true);
    setImage(null);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setImage(`data:${data.mimeType};base64,${data.image}`);
    } catch (err) {
      console.error("Image generation error:", err);
      setImage(null);
    } finally {
      setLoadingImage(false);
    }
  }

  function handleGenerate() {
    generatePost();
    generateImage();
  }

  async function copyToClipboard() {
    await navigator.clipboard.writeText(post);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-pink-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              AI
            </div>
            <div>
              <h1 className="text-xl font-bold text-pink-900">AI Sisters</h1>
              <p className="text-xs text-pink-500">LinkedIn Post Generator</p>
            </div>
          </div>
          <span className="text-xs bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-medium">
            Powered by Gemini
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div className="space-y-6">
            {/* Topic */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
              <label className="block text-sm font-semibold text-pink-900 mb-2">
                Sujet du post
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: L'impact de l'IA sur le recrutement en 2026..."
                className="w-full h-28 px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none resize-none text-sm transition-all bg-pink-50/50 placeholder:text-pink-300"
              />
            </div>

            {/* Tone */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
              <label className="block text-sm font-semibold text-pink-900 mb-3">
                Ton
              </label>
              <div className="flex flex-wrap gap-2">
                {TONES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTone(t.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      tone === t.value
                        ? "bg-pink-500 text-white shadow-md shadow-pink-200"
                        : "bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200"
                    }`}
                  >
                    {t.emoji} {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Format */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
              <label className="block text-sm font-semibold text-pink-900 mb-3">
                Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                {FORMATS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFormat(f.value)}
                    className={`px-4 py-3 rounded-xl text-left transition-all ${
                      format === f.value
                        ? "bg-pink-500 text-white shadow-md shadow-pink-200"
                        : "bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200"
                    }`}
                  >
                    <div className="text-sm font-medium">{f.label}</div>
                    <div
                      className={`text-xs mt-0.5 ${format === f.value ? "text-pink-100" : "text-pink-400"}`}
                    >
                      {f.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
              <label className="block text-sm font-semibold text-pink-900 mb-3">
                Langue
              </label>
              <div className="flex gap-2">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLanguage(l.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      language === l.value
                        ? "bg-pink-500 text-white shadow-md shadow-pink-200"
                        : "bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!topic.trim() || loadingPost}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold text-base hover:from-pink-600 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-200 active:scale-[0.98]"
            >
              {loadingPost ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Génération en cours...
                </span>
              ) : (
                "Générer le post"
              )}
            </button>
          </div>

          {/* Right: Preview */}
          <div className="space-y-6">
            {/* Post Preview */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100 min-h-[300px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-pink-900">
                  Aperçu du post
                </h2>
                {post && (
                  <button
                    onClick={copyToClipboard}
                    className="text-xs px-3 py-1.5 rounded-lg bg-pink-50 text-pink-600 hover:bg-pink-100 transition-all font-medium border border-pink-200"
                  >
                    {copied ? "Copié !" : "Copier"}
                  </button>
                )}
              </div>

              {loadingPost ? (
                <div className="space-y-3">
                  <div className="h-4 rounded-full animate-shimmer" />
                  <div className="h-4 rounded-full animate-shimmer w-5/6" />
                  <div className="h-4 rounded-full animate-shimmer w-4/6" />
                  <div className="h-4 rounded-full animate-shimmer w-5/6" />
                  <div className="h-4 rounded-full animate-shimmer w-3/6" />
                </div>
              ) : post ? (
                <div className="animate-fade-in">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-bold">
                      AS
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-gray-900">
                        AI Sisters
                      </div>
                      <div className="text-xs text-gray-500">
                        Juste maintenant
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {post}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-pink-300">
                  <svg
                    className="w-12 h-12 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                    />
                  </svg>
                  <p className="text-sm">Votre post apparaîtra ici</p>
                </div>
              )}
            </div>

            {/* Image Preview */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100 min-h-[200px]">
              <h2 className="text-sm font-semibold text-pink-900 mb-4">
                Image générée
              </h2>

              {loadingImage ? (
                <div className="h-48 rounded-xl animate-shimmer" />
              ) : image ? (
                <div className="animate-fade-in">
                  <img
                    src={image}
                    alt="Image générée pour le post"
                    className="w-full rounded-xl shadow-sm"
                  />
                  <a
                    href={image}
                    download="linkedin-post-image.png"
                    className="inline-block mt-3 text-xs px-3 py-1.5 rounded-lg bg-pink-50 text-pink-600 hover:bg-pink-100 transition-all font-medium border border-pink-200"
                  >
                    Télécharger l&apos;image
                  </a>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-36 text-pink-300">
                  <svg
                    className="w-12 h-12 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                    />
                  </svg>
                  <p className="text-sm">L&apos;image apparaîtra ici</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-pink-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 text-center text-xs text-pink-400">
          Made with love by{" "}
          <span className="font-semibold text-pink-600">AI Sisters</span>{" "}
          &mdash; Powered by Google Gemini
        </div>
      </footer>
    </div>
  );
}
