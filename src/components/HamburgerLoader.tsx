import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChefHat, CheckCircle2 } from 'lucide-react';

export default function HamburgerLoader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'cooking' | 'done'>('cooking');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('done'), 3000);
    const t2 = setTimeout(onComplete, 5000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-[32px] w-full max-w-sm p-8 shadow-2xl text-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          {phase === 'cooking' && (
            <motion.div key="cooking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}>
              <div className="relative w-32 h-32 mx-auto mb-6">
                <motion.div 
                  className="absolute inset-0 bg-orange-100 rounded-full"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-5xl">
                  🍔
                </div>
                <motion.div 
                  className="absolute -top-2 -right-2 bg-white p-2 rounded-full shadow-md"
                  animate={{ rotate: [-10, 10, -10] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                >
                  <ChefHat className="text-orange-500" size={24} />
                </motion.div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Adding Hamburgers</h2>
              <p className="text-gray-500">Gathering buns, beef, cheddar, and fresh veggies...</p>
            </motion.div>
          )}

          {phase === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-green-500" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recipe Added!</h2>
              <p className="text-gray-500">Classic Hamburgers are now in your cart.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
