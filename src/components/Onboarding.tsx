import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Calendar, CheckCircle2, ArrowRight, XCircle, Cat, Dog } from 'lucide-react';

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [diet, setDiet] = useState<string | null>(null);
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [cats, setCats] = useState(0);
  const [dogs, setDogs] = useState(0);
  const [calendarStatus, setCalendarStatus] = useState<'idle'|'connecting'|'connected'>('idle');
  const [isExited, setIsExited] = useState(false);

  if (isExited) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-6">
        <div className="text-center">
          <XCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900">App Exited</h2>
          <p className="text-gray-500 mt-2">Data collection consent is required to use this app.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col relative overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div 
            key="step0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#f4a3b4] to-[#fdfdfd] cursor-pointer"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(e, info) => {
              if (info.offset.y < -50 || info.offset.y > 50) {
                setStep(1);
              }
            }}
            onClick={() => setStep(1)}
          >
            <div className="flex flex-col items-center justify-center flex-1">
              <div className="w-28 h-28 bg-[#c00020] rounded-[2rem] flex items-center justify-center mb-6 shadow-sm">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="22" r="4.5" fill="white"/>
                  <circle cx="44" cy="22" r="4.5" fill="white"/>
                  <path d="M16 34 C 16 54, 48 54, 48 34" stroke="white" strokeWidth="8" strokeLinecap="round"/>
                </svg>
              </div>
              
              <h1 className="text-4xl font-extrabold text-[#4a151b] mb-2 tracking-tight">
                Hi, I'm <span className="text-[#c00020]">Nici</span>
              </h1>
              <p className="text-2xl text-[#4a151b] font-medium">I shop for you</p>
            </div>
            
            <div className="pb-16 text-sm font-semibold tracking-widest text-[#4a151b]">
              SWIPE TO GET STARTED
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      {step > 0 && (
        <div className="h-1 bg-gray-200 w-full">
          <motion.div 
            className="h-full bg-red-500" 
            initial={{ width: '25%' }}
            animate={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      )}

      <div className="flex-1 p-6 flex flex-col justify-center max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full justify-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Who are you?</h1>
              <p className="text-gray-500 mb-8">Select your dietary preference to help us personalize your groceries.</p>
              
              <div className="space-y-3">
                {['Omnivore', 'Vegetarian', 'Vegan'].map(type => (
                  <button 
                    key={type}
                    onClick={() => setDiet(type)}
                    className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-lg transition-all ${diet === type ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-700 hover:border-red-200'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="mt-auto pt-8">
                <button 
                  disabled={!diet}
                  onClick={() => setStep(2)}
                  className="w-full bg-red-500 text-white rounded-full py-4 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  Next <ArrowRight size={20} className="ml-2" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full justify-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Family Size</h1>
              <p className="text-gray-500 mb-8">How many people (and pets) are we shopping for?</p>
              
              {/* Visual Representation */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8 min-h-[120px] flex flex-wrap items-center justify-center gap-2">
                <AnimatePresence>
                  {Array.from({ length: adults }).map((_, i) => (
                    <motion.div key={`adult-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <User size={40} className="text-gray-700" />
                    </motion.div>
                  ))}
                  {Array.from({ length: kids }).map((_, i) => (
                    <motion.div key={`kid-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <User size={24} className="text-gray-400" />
                    </motion.div>
                  ))}
                  {Array.from({ length: cats }).map((_, i) => (
                    <motion.div key={`cat-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <Cat size={28} className="text-orange-400" />
                    </motion.div>
                  ))}
                  {Array.from({ length: dogs }).map((_, i) => (
                    <motion.div key={`dog-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <Dog size={32} className="text-amber-600" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[40vh] pb-4 scrollbar-hide">
                <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500"><User size={20} /></div>
                    <span className="font-bold text-lg text-gray-800">Adults</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xl hover:bg-gray-200">-</button>
                    <span className="font-bold text-xl w-4 text-center">{adults}</span>
                    <button onClick={() => setAdults(adults + 1)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xl hover:bg-gray-200">+</button>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400"><User size={16} /></div>
                    <span className="font-bold text-lg text-gray-800">Kids</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setKids(Math.max(0, kids - 1))} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xl hover:bg-gray-200">-</button>
                    <span className="font-bold text-xl w-4 text-center">{kids}</span>
                    <button onClick={() => setKids(kids + 1)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xl hover:bg-gray-200">+</button>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-400"><Cat size={20} /></div>
                    <span className="font-bold text-lg text-gray-800">Cats</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setCats(Math.max(0, cats - 1))} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xl hover:bg-gray-200">-</button>
                    <span className="font-bold text-xl w-4 text-center">{cats}</span>
                    <button onClick={() => setCats(cats + 1)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xl hover:bg-gray-200">+</button>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600"><Dog size={20} /></div>
                    <span className="font-bold text-lg text-gray-800">Dogs</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setDogs(Math.max(0, dogs - 1))} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xl hover:bg-gray-200">-</button>
                    <span className="font-bold text-xl w-4 text-center">{dogs}</span>
                    <button onClick={() => setDogs(dogs + 1)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xl hover:bg-gray-200">+</button>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4">
                <button 
                  onClick={() => setStep(3)}
                  className="w-full bg-red-500 text-white rounded-full py-4 font-bold text-lg flex items-center justify-center"
                >
                  Next <ArrowRight size={20} className="ml-2" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full justify-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Data Collection</h1>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                We collect and analyse your order history for this app to work its magic. Is that cool?
              </p>
              
              <div className="space-y-3 mt-auto">
                <button 
                  onClick={() => setStep(4)}
                  className="w-full bg-red-500 text-white rounded-full py-4 font-bold text-lg"
                >
                  Okay, proceed
                </button>
                <button 
                  onClick={() => setIsExited(true)}
                  className="w-full bg-white text-gray-500 border border-gray-200 rounded-full py-4 font-bold text-lg"
                >
                  No, exit app
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full justify-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-500 rounded-full flex items-center justify-center mb-6">
                <Calendar size={32} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Connect Calendar</h1>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Do you wish to connect your calendar? We can detect your trips and automatically pause your orders while you're away.
              </p>
              
              {calendarStatus === 'idle' && (
                <div className="mt-auto space-y-3">
                  <button 
                    onClick={() => {
                      setCalendarStatus('connecting');
                      setTimeout(() => setCalendarStatus('connected'), 2000);
                    }}
                    className="w-full bg-blue-500 text-white rounded-full py-4 font-bold text-lg flex items-center justify-center gap-2"
                  >
                    <Calendar size={20} /> Connect Google Calendar
                  </button>
                  <button 
                    onClick={onComplete}
                    className="w-full bg-white text-gray-500 border border-gray-200 rounded-full py-4 font-bold text-lg"
                  >
                    Skip for now
                  </button>
                </div>
              )}

              {calendarStatus === 'connecting' && (
                <div className="mt-auto flex flex-col items-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-500 font-medium">Connecting and scanning...</p>
                </div>
              )}

              {calendarStatus === 'connected' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-auto">
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle2 className="text-green-500" size={24} />
                      <span className="font-bold text-green-800">Calendar Connected</span>
                    </div>
                    <p className="text-green-700 text-sm">
                      Trip found in the last week of April. Cancelling orders for that week.
                    </p>
                  </div>
                  <button 
                    onClick={onComplete}
                    className="w-full bg-red-500 text-white rounded-full py-4 font-bold text-lg flex items-center justify-center"
                  >
                    Start Shopping <ArrowRight size={20} className="ml-2" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
