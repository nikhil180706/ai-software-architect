"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // --- Animated Text Logic (Typewriter Effect) ---
  const [animatedText, setAnimatedText] = useState("");
  const phrases = ["a CRM with Payments.", "an E-commerce Dashboard.", "a Secure Auth System.", "an AI SaaS Platform."];
  
  useEffect(() => {
    let currentPhraseIndex = 0;
    let isDeleting = false;
    let text = "";
    let timer: NodeJS.Timeout;

    const type = () => {
      const fullPhrase = phrases[currentPhraseIndex];
      if (isDeleting) {
        text = fullPhrase.substring(0, text.length - 1);
      } else {
        text = fullPhrase.substring(0, text.length + 1);
      }
      setAnimatedText(text);

      let speed = isDeleting ? 50 : 100;
      if (!isDeleting && text === fullPhrase) {
        speed = 2000; // Pause at the end of the word
        isDeleting = true;
      } else if (isDeleting && text === "") {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        speed = 500; // Pause before typing next word
      }
      timer = setTimeout(type, speed);
    };

    timer = setTimeout(type, 100);
    return () => clearTimeout(timer);
  }, []);

  // --- API Call Logic ---
  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setOutput("Engineering architecture...\nConnecting to LLM...");
    
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      
      if (!res.ok) throw new Error("API Route failed.");
      const data = await res.json();
      setOutput(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setOutput(`Error: ${error.message}\nMake sure your Groq API key is in Vercel!`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center py-20 px-6 font-sans">
      
      {/* Header with Animated Text */}
      <div className="max-w-3xl w-full text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">
          Design <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            {animatedText}
          </span>
          <span className="animate-pulse">|</span>
        </h1>
        <p className="text-slate-400 text-lg">
          Describe your application in plain text. Our multi-stage AI pipeline instantly drafts a strict, deployment-ready backend blueprint.
        </p>
      </div>

      {/* Input Section */}
      <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <textarea
          className="w-full h-32 bg-slate-950 text-slate-100 border border-slate-700 rounded-xl p-4 focus:outline-none focus:border-blue-500 transition-colors resize-none mb-4"
          placeholder="e.g., Build a CRM with login, contacts, role-based access, and a premium plan with payments..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        
        <button 
          onClick={handleGenerate}
          disabled={isLoading || !prompt}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            isLoading ? "bg-slate-700 text-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]"
          }`}
        >
          {isLoading ? "Compiling Architecture..." : "Generate Technical Blueprint"}
        </button>
      </div>

      {/* Output Section */}
      {output && (
        <div className="max-w-3xl w-full mt-8 bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
          <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-slate-500 text-xs ml-2 font-mono">architecture.json</span>
          </div>
          <pre className="p-6 text-emerald-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}