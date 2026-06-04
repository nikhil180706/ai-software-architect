"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // --- Animated Text Logic (Typewriter Effect) ---
  const [animatedText, setAnimatedText] = useState("");
  const phrases = [
    "a CRM with Payments.", 
    "an E-commerce Dashboard.", 
    "a Secure Auth System.", 
    "an AI SaaS Platform."
  ];
  
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

      let speed = isDeleting ? 40 : 80;
      if (!isDeleting && text === fullPhrase) {
        speed = 2500;
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
    setOutput("Engineering architecture...\nConnecting to AI logic engine...");
    
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
      setOutput(`Error: ${error.message}\nPlease check your server logs.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-200 selection:text-blue-900">
      
      {/* 1. NAVIGATION BAR */}
      <nav className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="font-extrabold text-xl tracking-tight text-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-inner flex items-center justify-center">
            <span className="text-white text-sm font-black">AI</span>
          </div>
          Architect<span className="text-blue-600">.</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-semibold">
          <a href="#features" className="hidden md:block text-slate-500 hover:text-blue-600 transition-colors">Features</a>
          <a href="#pricing" className="hidden md:block text-slate-500 hover:text-blue-600 transition-colors">Pricing</a>
          <button className="text-slate-600 hover:text-slate-900 transition-colors">Sign In</button>
          <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all">
            Get Started
          </button>
        </div>
      </nav>

      {/* 2. MAIN HERO CONTENT */}
      <main className="flex-grow flex flex-col items-center py-16 px-6">
        <div className="max-w-4xl w-full text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wide mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Llama 3.3 Engine Online
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-900">
            Design <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
              {animatedText}
            </span>
            <span className="animate-pulse text-slate-400 font-light">|</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Stop writing boilerplate. Describe your software requirements in plain English, and our multi-stage AI pipeline will engineer a strict, deployment-ready backend blueprint in seconds.
          </p>
        </div>

        {/* 3. INPUT CARD */}
        <div className="max-w-3xl w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] mb-16 relative">
          <label className="block text-sm font-bold text-slate-700 mb-2">System Requirements</label>
          <textarea
            className="w-full h-36 bg-slate-50 text-slate-800 border border-slate-200 rounded-2xl p-5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none mb-6 text-base placeholder:text-slate-400 shadow-inner"
            placeholder="e.g., Build a CRM with user login, contact management, role-based access, and a premium tier utilizing Stripe payments..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button 
            onClick={handleGenerate}
            disabled={isLoading || !prompt}
            className={`w-full py-4 rounded-xl font-extrabold text-lg transition-all ${
              isLoading 
                ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_25px_-6px_rgba(37,99,235,0.5)] hover:-translate-y-0.5"
            }`}
          >
            {isLoading ? "Compiling Architecture..." : "Generate Technical Blueprint"}
          </button>
        </div>

        {/* 4. CODE OUTPUT SECTION */}
        {output && (
          <div className="max-w-4xl w-full bg-[#0f172a] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl mb-16">
            <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-slate-400 text-xs ml-3 font-mono font-medium">architecture-schema.json</span>
              </div>
              <button className="text-xs text-slate-400 hover:text-white transition-colors">Copy Code</button>
            </div>
            <pre className="p-6 text-teal-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {output}
            </pre>
          </div>
        )}

        {/* 5. CAPABILITIES SECTION */}
        <div id="features" className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-slate-200">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-start text-left">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4 text-xl">⚡</div>
            <h3 className="font-bold text-slate-800 mb-2">Intent Extraction</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Our pipeline parses chaotic user inputs and filters out noise to establish strict data contracts before generating code.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-start text-left">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4 text-xl">🔒</div>
            <h3 className="font-bold text-slate-800 mb-2">Strict Schema Gating</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Generates Pydantic-validated JSON structures guaranteeing 100% type safety and perfect database relational mapping.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-start text-left">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mb-4 text-xl">🔄</div>
            <h3 className="font-bold text-slate-800 mb-2">Auto-Repair Engine</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Built-in programmatic validation catches AI hallucinations and triggers a self-healing loop to fix cross-layer logic.</p>
          </div>
        </div>

        {/* 6. NEW: PRICING & SUBSCRIPTIONS SECTION */}
        <div id="pricing" className="max-w-6xl w-full pt-24 pb-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Pricing built for scale</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Start designing architectures for free, and upgrade to premium models when you need production-grade performance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            {/* Starter Tier */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm relative">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Starter</h3>
              <p className="text-slate-500 text-sm mb-6">Perfect for side projects and learning.</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900">$0</span>
                <span className="text-slate-500 font-medium">/month</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm text-slate-600">
                <li className="flex items-center gap-3"><span className="text-emerald-500">✓</span> 50 Architecture generations / mo</li>
                <li className="flex items-center gap-3"><span className="text-emerald-500">✓</span> Standard LLM processing</li>
                <li className="flex items-center gap-3"><span className="text-emerald-500">✓</span> JSON schema exports</li>
              </ul>
              <button className="w-full py-3 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">
                Start for free
              </button>
            </div>

            {/* Pro Tier (Highlighted Dark Card) */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative transform md:-translate-y-4 ring-2 ring-blue-500">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-teal-400 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                Most Popular
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
              <p className="text-slate-400 text-sm mb-6">For professional developers & freelancers.</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">$19</span>
                <span className="text-slate-400 font-medium">/month</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm text-slate-300">
                <li className="flex items-center gap-3"><span className="text-blue-400">✓</span> Unlimited Architecture generations</li>
                <li className="flex items-center gap-3"><span className="text-blue-400">✓</span> Access to Groq Llama 3.3 Engine</li>
                <li className="flex items-center gap-3"><span className="text-blue-400">✓</span> Export to FastAPI & Express.js code</li>
                <li className="flex items-center gap-3"><span className="text-blue-400">✓</span> Priority email support</li>
              </ul>
              <button className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all">
                Upgrade to Pro
              </button>
            </div>

            {/* Enterprise Tier */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm relative">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Enterprise</h3>
              <p className="text-slate-500 text-sm mb-6">For engineering teams and agencies.</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900">Custom</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm text-slate-600">
                <li className="flex items-center gap-3"><span className="text-emerald-500">✓</span> Private LLM deployments</li>
                <li className="flex items-center gap-3"><span className="text-emerald-500">✓</span> Custom database dialect support</li>
                <li className="flex items-center gap-3"><span className="text-emerald-500">✓</span> Single Sign-On (SSO)</li>
                <li className="flex items-center gap-3"><span className="text-emerald-500">✓</span> Dedicated success manager</li>
              </ul>
              <button className="w-full py-3 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">
                Contact Sales
              </button>
            </div>

          </div>
        </div>

      </main>

      {/* 7. FOOTER */}
      <footer className="w-full border-t border-slate-200 bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="max-w-md text-center md:text-left">
            <div className="font-extrabold text-lg text-slate-800 mb-3 flex items-center justify-center md:justify-start gap-2">
              <div className="w-5 h-5 bg-blue-600 rounded"></div> AI Architect.
            </div>
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-amber-800 text-xs leading-relaxed">
              <strong>⚠️ LLM Disclaimer:</strong> This application utilizes Large Language Models. Generated schemas must be reviewed by a human engineer before production deployment.
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4 text-sm text-slate-500">
            <div className="flex gap-4 font-medium text-slate-700">
              <p>Powered by <span className="text-blue-600 font-bold">Groq</span></p>
              <span>&bull;</span>
              <p>Model: <span className="text-emerald-600 font-bold">Llama 3.3</span></p>
            </div>
            <p>Developer Contact: <a href="mailto:nikhil@example.com" className="text-blue-600 hover:underline font-medium">nikhil@example.com</a></p>
            <p className="text-xs text-slate-400 mt-2">
              &copy; {new Date().getFullYear()} AI Software Architect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}