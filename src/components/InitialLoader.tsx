import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { CartState } from '../types';

const steps = [
  { text: "Analyzing order history...", duration: 3500 },
  { text: "Analyzing calendar...", duration: 4000 },
  { text: "Selecting recipes...", duration: 1500 },
  { text: "Collecting items...", duration: 1500 },
  { text: "Organizing cart...", duration: 1500 }
];

const OrderHistoryAnimation = () => (
  <div className="w-full h-40 bg-gray-50 rounded-xl border border-gray-100 p-3 overflow-hidden relative flex flex-col gap-2">
    <motion.div 
      animate={{ y: [0, -120] }} 
      transition={{ duration: 3.5, ease: "linear" }} 
      className="flex flex-col gap-2 w-full"
    >
      {[
        { name: "Organic Milk 1L", price: "€1.49" },
        { name: "Free-range Eggs", price: "€3.29" },
        { name: "Whole Wheat Bread", price: "€2.19" },
        { name: "Gouda Cheese", price: "€4.50" },
        { name: "Toilet Paper", price: "€4.99" },
        { name: "Dish Soap", price: "€2.49" },
        { name: "Sparkling Water", price: "€0.99" },
      ].map((item, i) => (
        <div key={i} className="bg-white p-2 rounded-lg shadow-sm text-xs flex justify-between w-full border border-gray-100">
          <span className="font-medium text-gray-700">{item.name}</span>
          <span className="text-gray-500">{item.price}</span>
        </div>
      ))}
    </motion.div>
    
    <motion.div 
      className="absolute top-0 left-0 w-full h-1 bg-blue-400/50 shadow-[0_0_8px_2px_rgba(96,165,250,0.5)]"
      animate={{ y: [0, 160, 0] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
    />
  </div>
);

const CalendarAnimation = () => (
  <div className="w-full h-40 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden relative flex items-center justify-center">
    <img src="/calendar.png" alt="Calendar" className="w-full h-full object-cover opacity-80" />
    
    <motion.div 
      className="absolute top-0 left-0 w-full h-1 bg-red-400/80 shadow-[0_0_8px_2px_rgba(248,113,113,0.8)]"
      animate={{ y: [0, 160, 0] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
    />

    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5 }}
      className="absolute bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-red-100 text-center max-w-[80%]"
    >
      <p className="text-xs font-bold text-red-600 mb-1">Trip Detected</p>
      <p className="text-[10px] text-gray-600 leading-tight">Last week of April.<br/>Pausing deliveries for that week.</p>
    </motion.div>
  </div>
);

export default function InitialLoader({ cartState, onComplete }: { cartState: CartState, onComplete: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [showFinal, setShowFinal] = useState(false);

  useEffect(() => {
    if (stepIndex < steps.length) {
      const timer = setTimeout(() => setStepIndex(s => s + 1), steps[stepIndex].duration);
      return () => clearTimeout(timer);
    } else {
      setShowFinal(true);
      const timer = setTimeout(onComplete, 4000);
      return () => clearTimeout(timer);
    }
  }, [stepIndex, onComplete]);

  const progress = Math.min(((stepIndex + 1) / steps.length) * 100, 100);
  const numDishes = cartState.categories.filter(c => c.id.startsWith('recipe')).length;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-[32px] w-full max-w-sm p-6 shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Preparing your cart...</h2>
          {!showFinal ? (
            <Loader2 className="animate-spin text-red-500" size={24} />
          ) : (
            <CheckCircle2 className="text-green-500" size={24} />
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 mb-8 overflow-hidden relative">
          <motion.div 
            className="bg-red-500 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${showFinal ? 100 : progress}%` }}
            transition={{ ease: "linear", duration: 1.5 }}
          />
        </div>

        {/* Status Text & Visuals */}
        <div className="min-h-[200px] flex flex-col items-center justify-center text-center">
          <AnimatePresence mode="wait">
            {!showFinal ? (
              <motion.div
                key={stepIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full flex flex-col items-center gap-4"
              >
                {stepIndex === 0 && <OrderHistoryAnimation />}
                {stepIndex === 1 && <CalendarAnimation />}
                <div className="text-xl font-semibold text-gray-700">
                  {steps[stepIndex]?.text || "Finishing up..."}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="final"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="text-green-500" size={32} />
                </div>
                <div className="text-lg font-bold text-gray-900 leading-tight">
                  Cart ready – {cartState.itemCount} items added, {numDishes} dishes planned for your week based on past data.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
