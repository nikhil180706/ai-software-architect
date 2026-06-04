"use client";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(null);

  // When the button is clicked, this calls the Python backend
  const handleGenerate = async () => {
    const response = await fetch("http://127.0.0.1:8000/generate?user_prompt=" + prompt, {
      method: "POST"
    });
    const data = await response.json();
    setResult(data); // Save the AI's answer
  };

  return (
    <div className="p-10 font-sans">
      <h1 className="text-3xl font-bold mb-4">AI Software Architect</h1>
      <input 
        className="border p-2 w-full text-black" 
        placeholder="E.g., Build a CRM with Stripe"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button 
        onClick={handleGenerate} 
        className="bg-blue-500 text-white p-2 mt-4 rounded"
      >
        Generate Blueprint
      </button>

      {/* If the AI gives us an answer, show it on the screen */}
      {result && (
        <pre className="mt-8 bg-gray-100 p-4 rounded text-black">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}