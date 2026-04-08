import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PackagePlus, CheckCircle2, History } from 'lucide-react';

export default function MinOrderLoader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'analyzing' | 'adding' | 'done'>('analyzing');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('adding'), 2000);
    const t2 = setTimeout(() => setPhase('done'), 4000);
    const t3 = setTimeout(onComplete, 6000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-[32px] w-full max-w-sm p-8 shadow-2xl text-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          {phase === 'analyzing' && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}>
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <History className="text-blue-500 animate-spin-slow" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Checking History</h2>
              <p className="text-gray-500">Analyzing your past orders to find the best items to reach the minimum...</p>
            </motion.div>
          )}

          {phase === 'adding' && (
            <motion.div key="adding" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <PackagePlus className="text-yellow-500" size={40} />
                <motion.div 
                  className="absolute inset-0 border-4 border-yellow-400 rounded-full border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Adding Staples</h2>
              <p className="text-gray-500">Adding Toilet Paper and Dish Soap based on your usual frequency.</p>
            </motion.div>
          )}

          {phase === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-green-500" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Minimum Reached!</h2>
              <p className="text-gray-500">Your cart is now ready for checkout.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
