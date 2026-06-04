"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate contacting a payment gateway (like Stripe)
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Redirect back to home after 2 seconds showing success
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      
      <Link href="/" className="absolute top-8 left-8 text-slate-400 hover:text-slate-800 font-medium flex items-center gap-2">
        ← Back
      </Link>

      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Order Summary */}
        <div className="bg-slate-900 text-white p-10 md:w-5/12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          
          <div>
            <div className="font-extrabold text-xl tracking-tight text-white flex items-center gap-3 mb-12 relative z-10">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-black">AI</span>
              </div>
              Architect<span className="text-blue-500">.</span>
            </div>

            <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Subscribe to</p>
            <h2 className="text-4xl font-extrabold mb-6">Pro Plan</h2>
            
            <div className="space-y-4 text-slate-300 text-sm mb-8">
              <p className="flex items-center gap-3"><span className="text-blue-400">✓</span> Unlimited Architecture generation</p>
              <p className="flex items-center gap-3"><span className="text-blue-400">✓</span> Export to FastAPI & Express.js</p>
              <p className="flex items-center gap-3"><span className="text-blue-400">✓</span> Llama 3.3 Engine access</p>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-6 relative z-10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400">Subtotal</span>
              <span className="font-medium">$19.00</span>
            </div>
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total due today</span>
              <span>$19.00</span>
            </div>
          </div>
        </div>

        {/* Right Side: Payment Form */}
        <div className="p-10 md:w-7/12">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">Payment Details</h3>
          
          {isSuccess ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-fade-in-up">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center text-4xl mb-6">
                ✓
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Payment Successful!</h3>
              <p className="text-slate-500">Your account has been upgraded. Redirecting...</p>
            </div>
          ) : (
            <form onSubmit={handlePayment} className="space-y-5 relative">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input required type="email" placeholder="you@example.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-500" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Card Information</label>
                <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-500 transition-colors">
                  <input required type="text" placeholder="1234 5678 9101 1121" className="w-full bg-slate-50 p-3 outline-none border-b border-slate-200 font-mono" />
                  <div className="flex">
                    <input required type="text" placeholder="MM / YY" className="w-1/2 bg-slate-50 p-3 outline-none border-r border-slate-200 font-mono" />
                    <input required type="text" placeholder="CVC" className="w-1/2 bg-slate-50 p-3 outline-none font-mono" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Name on card</label>
                <input required type="text" placeholder="John Doe" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-500" />
              </div>

              <button 
                type="submit" 
                disabled={isProcessing}
                className={`w-full py-4 rounded-xl font-extrabold text-white mt-4 transition-all ${
                  isProcessing ? "bg-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-lg"
                }`}
              >
                {isProcessing ? "Processing Securely..." : "Pay $19.00"}
              </button>
              
              <p className="text-center text-xs text-slate-400 mt-4">
                🔒 Payments are securely simulated for this technical demonstration.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}