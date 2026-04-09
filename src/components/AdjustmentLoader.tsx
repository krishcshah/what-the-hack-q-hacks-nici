import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartCategory, Product } from '../types';
import { ArrowRight, CheckCircle2, Loader2, XCircle } from 'lucide-react';

interface DiffItem {
  id: string;
  oldItem: Product;
  newItem: Product | null;
  changed: boolean;
  removed: boolean;
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
  const [loadingText, setLoadingText] = useState("Moving things around, please wait…");

  useEffect(() => {
    setLoadingText(Math.random() > 0.5 ? "Moving things around, please wait…" : "Picking the items for you…");
    
    const newDiffs: DiffItem[] = [];
    oldCategories.forEach((oldCat) => {
      oldCat.items.forEach((oldItem) => {
        let foundNewItem: Product | null = null;
        for (const newCat of newCategories) {
          const match = newCat.items.find(i => i.id === oldItem.id);
          if (match) {
            foundNewItem = match;
            break;
          }
        }
        
        if (foundNewItem) {
          const changed = oldItem.name !== foundNewItem.name || oldItem.price !== foundNewItem.price;
          newDiffs.push({ id: oldItem.id, oldItem, newItem: foundNewItem, changed, removed: false });
        } else {
          newDiffs.push({ id: oldItem.id, oldItem, newItem: null, changed: true, removed: true });
        }
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
          setCurrentIndex(prev => prev + 3);
        }, 800); // Time to show the update
      }, 600); // Time to show analyzing
      
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

  const progress = Math.min((currentIndex / diffs.length) * 100, 100);
  const currentDiffs = diffs.slice(currentIndex, currentIndex + 3);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-[32px] w-full max-w-sm p-6 shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">{loadingText}</h2>
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
        <div className="h-56 relative flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="popLayout">
            {currentDiffs.length > 0 && phase === 'analyzing' && (
              <motion.div
                key={`analyzing-${currentIndex}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center gap-4 absolute w-full"
              >
                {currentDiffs.map(diff => (
                  <div key={diff.id} className="flex flex-col items-center w-20">
                    <div className="relative">
                      <img src={diff.oldItem.image} className="w-16 h-16 rounded-2xl object-cover shadow-md" />
                      <motion.div 
                        className="absolute inset-0 border-4 border-blue-400 rounded-2xl"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.5 }}
                      />
                    </div>
                    <span className="mt-3 font-semibold text-gray-700 text-center text-xs w-full truncate">{diff.oldItem.name}</span>
                    <span className="text-[9px] text-blue-500 font-bold uppercase tracking-wider mt-1">Analyzing</span>
                  </div>
                ))}
              </motion.div>
            )}

            {currentDiffs.length > 0 && phase === 'updating' && (
              <motion.div
                key={`updating-${currentIndex}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center w-full absolute gap-3"
              >
                {currentDiffs.map(diff => (
                  <div key={diff.id} className="flex items-center justify-between w-full px-2">
                    {diff.removed ? (
                      <div className="flex items-center w-full gap-4">
                        <div className="relative shrink-0">
                          <img src={diff.oldItem.image} className="w-12 h-12 rounded-xl object-cover shadow-md opacity-50 grayscale" />
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0 shadow-sm">
                            <XCircle className="text-red-500" size={16} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 line-through text-xs truncate">{diff.oldItem.name}</div>
                          <div className="text-[9px] text-red-600 font-bold uppercase tracking-wider mt-0.5">Removed</div>
                        </div>
                      </div>
                    ) : diff.changed && diff.newItem ? (
                      <div className="flex items-center w-full gap-3">
                        <img src={diff.oldItem.image} className="w-10 h-10 rounded-lg object-cover opacity-50 grayscale shrink-0" />
                        <ArrowRight className="text-red-500 shrink-0" size={14} />
                        <div className="relative shrink-0">
                          <img src={diff.newItem.image} className="w-12 h-12 rounded-xl object-cover shadow-md border border-red-200" />
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0 shadow-sm">
                            <CheckCircle2 className="text-red-500" size={16} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-gray-900 text-xs truncate">{diff.newItem.name}</div>
                          <div className="text-[9px] text-red-600 font-bold uppercase tracking-wider mt-0.5">Updated</div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center w-full gap-4">
                        <div className="relative shrink-0">
                          <img src={diff.oldItem.image} className="w-12 h-12 rounded-xl object-cover shadow-md" />
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0 shadow-sm">
                            <CheckCircle2 className="text-green-500" size={16} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 text-xs truncate">{diff.oldItem.name}</div>
                          <div className="text-[9px] text-green-600 font-bold uppercase tracking-wider mt-0.5">Kept</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}

            {phase === 'done' && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center absolute"
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
