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
        speed = 2000;
        isDeleting = true;
      } else if (isDeleting && text === "") {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        speed = 500;
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
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans">
      
      {/* 1. NAVIGATION BAR (Header) */}
      <nav className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-md"></div>
          AI Architect
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Sign In</button>
          <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700">
            Log In
          </button>
        </div>
      </nav>

      {/* 2. MAIN APP CONTENT */}
      <main className="flex-grow flex flex-col items-center py-20 px-6">
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
      </main>

      {/* 3. FOOTER (Disclaimer, APIs, Contact, Copyright) */}
      <footer className="w-full border-t border-slate-800 bg-slate-950 py-10 px-6 mt-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 text-center">
          
          <div className="bg-slate-900/50 border border-amber-900/50 p-4 rounded-lg w-full max-w-2xl">
            <p className="text-amber-500/80 text-xs leading-relaxed font-mono">
              <strong>⚠️ LLM Disclaimer:</strong> This application utilizes Large Language Models (LLMs) to generate software architecture schemas. AI can hallucinate or produce logically flawed logic. All generated code and structures must be strictly reviewed by a human engineer before being pushed to production.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-sm text-slate-400">
            <p>Powered by the <span className="font-semibold text-emerald-400">Groq Fast AI API</span></p>
            <p className="hidden md:block text-slate-700">|</p>
            <p>Engineered using <span className="font-semibold text-blue-400">Llama 3.3 70B</span></p>
            <p className="hidden md:block text-slate-700">|</p>
            {/* REPLACE THIS EMAIL ADDRESS WITH YOURS */}
            <p>Contact: <a href="mailto:your.email@example.com" className="text-slate-300 hover:text-white hover:underline transition-colors">your.email@example.com</a></p>
          </div>

          <div className="w-full border-t border-slate-800/50 pt-6 mt-2">
            <p className="text-slate-600 text-xs">
              &copy; {new Date().getFullYear()} AI Software Architect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}