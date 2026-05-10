import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ListOrdered, Star, Send, User, Hash, Clock, Smile, Sparkles } from 'lucide-react';

interface Guess {
  name: string;
  guess: number;
  timestamp: number;
}

export default function App() {
  const [name, setName] = useState('');
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [showPrivacyWarning, setShowPrivacyWarning] = useState(false);
  const [showRulesNotice, setShowRulesNotice] = useState(false);

  useEffect(() => {
    fetchGuesses();
  }, []);

  const fetchGuesses = async () => {
    try {
      const response = await fetch('/api/guesses');
      const data = await response.json();
      setGuesses(data);
    } catch (error) {
      console.error('Error fetching guesses:', error);
    }
  };

  const handlePrivacyClick = () => {
    setShowPrivacyWarning(true);
    setTimeout(() => setShowPrivacyWarning(false), 5000);
  };

  const handleRulesClick = () => {
    setShowRulesNotice(true);
    setTimeout(() => setShowRulesNotice(false), 8000);
  };

  const handleReset = async () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      // Auto-cancel after 5 seconds if not clicked again
      setTimeout(() => setResetConfirm(false), 5000);
      return;
    }

    try {
      await fetch('/api/guesses', { method: 'DELETE' });
      setResetConfirm(false);
      await fetchGuesses();
    } catch (error) {
      console.error('Error resetting guesses:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !guess) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/guesses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, guess: Number(guess) }),
      });

      if (response.ok) {
        setName('');
        setGuess('');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        await fetchGuesses();
      }
    } catch (error) {
      console.error('Error submitting guess:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 font-sans selection:bg-blue-100 flex flex-col">
      {/* Header Bar */}
      <header className="bg-white border-b border-sky-100 px-6 md:px-8 py-0 flex justify-between items-center shadow-sm sticky top-0 z-30 h-20">
        <div className="flex items-center gap-3 h-full py-2">
          <div className="h-full flex items-center">
            <img 
              id="kids-town-logo"
              src="/logo.png" 
              alt="Kids Town Family Pediatric's" 
              className="h-12 md:h-16 w-auto object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback to text logo if image is missing
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent && !parent.querySelector('.fallback-logo')) {
                  const fallback = document.createElement('div');
                  fallback.className = 'fallback-logo flex items-center gap-3';
                  fallback.innerHTML = `
                    <div class="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 md:w-8 md:h-8"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2Z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                    </div>
                    <div>
                      <h1 class="text-lg md:text-xl font-display text-blue-600 tracking-tight leading-none">Kids Town Family</h1>
                      <p class="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">Pediatric's</p>
                    </div>
                  `;
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-emerald-50 rounded-full border border-emerald-100">
          <span className="text-[9px] md:text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Powered by</span>
          <span className="text-xs md:text-sm font-black text-emerald-700">DentalQore</span>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-8">
        
        {/* Left Column: Form & Question */}
        <section className="lg:col-span-7 flex flex-col">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl shadow-blue-900/5 border border-white flex flex-col h-full relative overflow-hidden"
          >
            <div className="mb-10 relative z-10">
              <span className="inline-block px-4 py-1.5 bg-yellow-400 text-white text-[10px] font-black rounded-full uppercase tracking-widest mb-4 shadow-sm shadow-yellow-200">
                Pop Quiz Time!
              </span>
              <h2 className="text-2xl md:text-4xl font-bold leading-tight text-slate-800">
                How many times in the last year do you guess that <span className="text-blue-500 underline decoration-blue-200 underline-offset-4 decoration-4">Kids Town Family Pediatric's</span> website was "impressed" on users in Google search as a result of the work that <span className="text-emerald-500">DentalQore</span> provides for them?
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10 flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="user-name" className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-4 flex items-center gap-2">
                    <User size={12} /> Your Super Name
                  </label>
                  <input
                    id="user-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-6 py-4 focus:border-blue-400 focus:bg-white outline-none transition-all font-medium text-lg placeholder:text-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="user-guess" className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-4 flex items-center gap-2">
                    <Hash size={12} /> Your Magic Number
                  </label>
                  <input
                    id="user-guess"
                    type="number"
                    required
                    min="0"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    placeholder="000,000"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-6 py-4 focus:border-blue-400 focus:bg-white outline-none transition-all font-medium text-lg placeholder:text-slate-300"
                  />
                </div>
              </div>

              <button
                id="submit-guess"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-black py-5 rounded-[2rem] text-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Lock In My Guess! 🚀</>
                )}
              </button>
            </form>

            <p className="mt-8 text-sm text-slate-400 font-medium text-center italic">
              Winner gets a prize as determined and awarded by the Engagement Team.
            </p>

            <div className="absolute -bottom-10 -right-10 opacity-[0.03] rotate-12">
              <Smile size={240} />
            </div>
          </motion.div>
        </section>

        {/* Right Column: Leaderboard */}
        <section className="lg:col-span-5 flex flex-col">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white/60 backdrop-blur-md rounded-[40px] p-8 border border-white/80 h-full flex flex-col shadow-inner min-h-[500px]"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-slate-700 flex items-center gap-2 uppercase tracking-tight">
                <ListOrdered size={20} className="text-blue-500" /> What Did You Guess?
              </h3>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar max-h-[500px]">
              <AnimatePresence mode="popLayout">
                {guesses.length > 0 ? (
                  guesses.map((g, index) => (
                    <motion.div
                      key={`${g.name}-${g.timestamp}`}
                      layout
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm ${
                          index === 0 ? 'bg-yellow-100 text-yellow-600' :
                          index === 1 ? 'bg-slate-100 text-slate-500' :
                          index === 2 ? 'bg-orange-50 text-orange-400' :
                          'bg-slate-50 text-slate-400'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 leading-none">{g.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                            {index === 0 ? 'Top Guesser' : index === 1 ? 'Optimist' : 'Magical Guess'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-blue-600">
                          {g.guess.toLocaleString()}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    key="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white/40 p-8 rounded-3xl border border-dashed border-slate-200 text-center"
                  >
                    <p className="text-slate-400 font-bold">No guesses yet. Be the first!</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-6 p-4 bg-blue-50/50 rounded-3xl flex items-center gap-3 border border-blue-100/50">
              <div className="text-xl">💡</div>
              <p className="text-[11px] font-bold text-blue-800 leading-tight">
                Google impressions indicate how many people saw our listing in their search results!
              </p>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer Decorations */}
      <footer className="px-8 py-4 bg-white/40 border-t border-sky-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <div className="flex items-center gap-4">
          <span>© {new Date().getFullYear()} Kids Town Family Pediatric's</span>
          <button
            id="reset-leaderboard"
            onClick={handleReset}
            className={`transition-all cursor-pointer px-2 py-1 rounded border ${
              resetConfirm 
                ? 'opacity-100 text-[10px] text-white bg-red-500 border-red-600 font-black animate-pulse' 
                : 'opacity-20 hover:opacity-100 text-[8px] text-slate-400 hover:text-red-500 border-transparent hover:border-red-100 hover:bg-red-50'
            }`}
          >
            {resetConfirm ? 'CONFIRM RESET' : 'Reset Board'}
          </button>
        </div>
        <div className="flex gap-4">
          <span 
            onClick={handlePrivacyClick}
            className="hover:text-blue-500 cursor-pointer transition-colors"
          >
            Privacy Policy
          </span>
          <span 
            onClick={handleRulesClick}
            className="hover:text-blue-500 cursor-pointer transition-colors"
          >
            Contest Rules
          </span>
        </div>
      </footer>

      {/* Rules Notice Popup */}
      <AnimatePresence>
        {showRulesNotice && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg"
          >
            <div className="bg-blue-600 backdrop-blur-md text-white p-8 rounded-3xl shadow-2xl border border-blue-400 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-blue-100">Contest Terms & Conditions</p>
              <p className="text-sm font-black leading-relaxed italic">
                "MAKE A GUESS, YOU MIGHT WIN. YOU MIGHT BE THE RIGHT ANSWER AND STILL LOSE HOWEVER IN THE INTEREST OF TEAM ENGAGEMENT AND FUN. MAY THE ODDS BE EVER IN YOUR FAVOR."
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Warning Popup */}
      <AnimatePresence>
        {showPrivacyWarning && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md"
          >
            <div className="bg-slate-900/95 backdrop-blur-md text-white p-6 rounded-3xl shadow-2xl border border-slate-700 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-blue-400">System Notification</p>
              <p className="text-xs font-bold leading-relaxed text-slate-200">
                You are on the clock and have no privacy. This data may be stored in your employee file.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Confetti Effect (Simple Overlay) */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[2px]" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              className="bg-white p-12 rounded-full shadow-2xl text-center relative"
            >
              <Smile size={80} className="text-yellow-400 mx-auto mb-4" />
              <h2 className="text-3xl font-black text-slate-800">Awesome Guess!</h2>
              <p className="text-slate-500 font-bold mt-2">Good luck with the prize!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
