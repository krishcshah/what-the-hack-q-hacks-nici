import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartCategory, Product } from '../types';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

interface DiffItem {
  id: string;
  oldItem: Product;
  newItem: Product;
  changed: boolean;
}

export default function AdjustmentLoader({ 
  oldCategories, 
  newCategories, 
  onComplete 
}: { 
  oldCategories: CartCategory[], 
  newCategories: CartCategory[], 
  onComplete: () => void 
}) {
  const [diffs, setDiffs] = useState<DiffItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'analyzing' | 'updating' | 'done'>('analyzing');

  useEffect(() => {
    const newDiffs: DiffItem[] = [];
    oldCategories.forEach((oldCat, catIdx) => {
      const newCat = newCategories[catIdx];
      oldCat.items.forEach((oldItem, itemIdx) => {
        const newItem = newCat.items[itemIdx];
        const changed = oldItem.name !== newItem.name || oldItem.price !== newItem.price;
        newDiffs.push({ id: oldItem.id, oldItem, newItem, changed });
      });
    });
    setDiffs(newDiffs);
  }, [oldCategories, newCategories]);

  useEffect(() => {
    if (diffs.length === 0) return;

    let analyzeTimer: NodeJS.Timeout;
    let updateTimer: NodeJS.Timeout;

    if (currentIndex < diffs.length) {
      setPhase('analyzing');
      analyzeTimer = setTimeout(() => {
        setPhase('updating');
        updateTimer = setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
        }, 600); // Time to show the update
      }, 400); // Time to show analyzing
      
      return () => {
        clearTimeout(analyzeTimer);
        clearTimeout(updateTimer);
      };
    } else {
      setPhase('done');
      const doneTimer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(doneTimer);
    }
  }, [currentIndex, diffs.length, onComplete]);

  if (diffs.length === 0) return null;

  const progress = (currentIndex / diffs.length) * 100;
  const currentDiff = diffs[currentIndex];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-[32px] w-full max-w-sm p-6 shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Applying AI Magic...</h2>
          <Loader2 className="animate-spin text-red-500" size={24} />
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 mb-8 overflow-hidden">
          <motion.div 
            className="bg-red-500 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.3 }}
          />
        </div>

        {/* Item Display Area */}
        <div className="h-40 relative flex items-center justify-center">
          <AnimatePresence mode="wait">
            {currentDiff && phase === 'analyzing' && (
              <motion.div
                key={`analyzing-${currentDiff.id}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1, filter: "blur(4px)" }}
                className="flex flex-col items-center"
              >
                <div className="relative">
                  <img src={currentDiff.oldItem.image} className="w-20 h-20 rounded-2xl object-cover shadow-md" />
                  <motion.div 
                    className="absolute inset-0 border-4 border-blue-400 rounded-2xl"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                  />
                </div>
                <span className="mt-3 font-semibold text-gray-700 text-center">{currentDiff.oldItem.name}</span>
                <span className="text-xs text-blue-500 font-bold uppercase tracking-wider mt-1">Analyzing</span>
              </motion.div>
            )}

            {currentDiff && phase === 'updating' && (
              <motion.div
                key={`updating-${currentDiff.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex items-center justify-center w-full"
              >
                {currentDiff.changed ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-center opacity-50 grayscale">
                      <img src={currentDiff.oldItem.image} className="w-14 h-14 rounded-xl object-cover" />
                    </div>
                    <ArrowRight className="text-red-500" size={24} />
                    <div className="flex flex-col items-center">
                      <img src={currentDiff.newItem.image} className="w-20 h-20 rounded-2xl object-cover shadow-lg border-2 border-red-500" />
                      <span className="mt-2 font-bold text-gray-900 text-center text-sm">{currentDiff.newItem.name}</span>
                      <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-md font-bold uppercase mt-1">Updated</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <img src={currentDiff.oldItem.image} className="w-20 h-20 rounded-2xl object-cover shadow-md" />
                      <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-0.5 shadow-sm">
                        <CheckCircle2 className="text-green-500" size={24} />
                      </div>
                    </div>
                    <span className="mt-3 font-semibold text-gray-900 text-center">{currentDiff.oldItem.name}</span>
                    <span className="text-xs text-green-600 font-bold uppercase tracking-wider mt-1">Kept</span>
                  </div>
                )}
              </motion.div>
            )}

            {phase === 'done' && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="text-green-500" size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Cart Updated!</h3>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
