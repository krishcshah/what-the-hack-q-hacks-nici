import { useState } from 'react';
import { Mic, Settings2, Leaf, DollarSign, ChefHat, Plus, Trash, Camera, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartState } from '../types';

export default function CartView({ cartState, onAdjust, onMicClick }: { cartState: CartState, onAdjust: (type: string) => void, onMicClick: () => void }) {
  const [isAdjustExpanded, setIsAdjustExpanded] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const presets = [
    { id: 'money-saver', icon: DollarSign, label: 'Money Saver', desc: 'Cheapest generic versions' },
    { id: 'vegan', icon: Leaf, label: 'Vegan', desc: 'Replace with vegan alternatives' },
    { id: 'eco', icon: Leaf, label: 'Eco-Friendly', desc: 'Most eco-friendly options' },
    { id: "chef", icon: ChefHat, label: "Chef's Choice", desc: "Best quality food" },
    { id: 'min-order', icon: Plus, label: 'Min Order Filler', desc: 'Auto-fill to meet minimum' },
    { id: 'duplicate', icon: Camera, label: 'Duplicate Removal', desc: 'Scan fridge to remove items' },
    { id: 'add-hamburger', icon: ChefHat, label: 'Add Hamburgers', desc: 'Add classic hamburger recipe' },
  ];

  if (isPaid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5f5f5] px-4">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 text-white shadow-xl shadow-green-500/30"
        >
          <Check size={48} strokeWidth={3} />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Order Confirmed!</h2>
        <p className="text-gray-500 text-center max-w-xs">Your groceries will arrive tomorrow between 14:00 and 15:00.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-40 pt-6 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 px-2 tracking-tight">Your Cart</h1>

      <div className="space-y-6">
        {cartState.categories.map((category) => (
          <div key={category.id} className={`rounded-[32px] p-5 border ${category.color} shadow-sm`}>
            <h2 className="text-lg font-bold mb-4 tracking-tight">{category.title}</h2>
            <div className="space-y-3">
              {category.items.map((item) => (
                <div key={item.id} className="flex items-center bg-white/70 rounded-2xl p-3 backdrop-blur-md border border-white/50">
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover mr-4 shadow-sm" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">{item.name}</h3>
                    <div className="flex gap-1.5 mt-1.5 flex-wrap">
                      {item.isVegan && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Vegan</span>}
                      {item.isEco && <span className="text-[10px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Eco</span>}
                    </div>
                  </div>
                  <div className="text-right ml-2 flex flex-col items-end justify-between h-14">
                    <div className="font-bold text-gray-900">€{item.price.toFixed(2)}</div>
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-20 left-0 right-0 px-4 flex flex-col items-center space-y-3 z-40 pointer-events-none">
        <div className="w-full max-w-md pointer-events-auto flex flex-col items-end">
          
          {/* Adjust Cart Pill */}
          <AnimatePresence>
            {isAdjustExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="w-full bg-white rounded-[32px] shadow-2xl border border-gray-100 p-2 mb-3 overflow-hidden origin-bottom"
              >
                <div className="max-h-[45vh] overflow-y-auto p-2 space-y-1 scrollbar-hide">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-3 mt-1">AI Adjustments</h3>
                  {presets.map((preset) => {
                    const Icon = preset.icon;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => {
                          onAdjust(preset.id);
                          setIsAdjustExpanded(false);
                        }}
                        className="w-full flex items-center p-3 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                      >
                        <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mr-4 shrink-0">
                          <Icon size={22} className="text-gray-700" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-[15px]">{preset.label}</div>
                          <div className="text-xs text-gray-500 font-medium mt-0.5">{preset.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex w-full gap-3">
            {/* Adjust Button */}
            <div className="flex-[1.2] flex bg-white rounded-full shadow-xl shadow-black/5 border border-gray-200 overflow-hidden h-14">
              <button 
                onClick={() => setIsAdjustExpanded(!isAdjustExpanded)}
                className="flex-1 flex items-center justify-center font-bold text-gray-800 hover:bg-gray-50 transition-colors px-4 text-sm"
              >
                <Settings2 size={18} className="mr-2 text-gray-500" />
                Adjust Cart
              </button>
              <div className="w-[1px] bg-gray-100 my-2"></div>
              <button onClick={onMicClick} className="w-16 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Mic size={22} className="text-red-500" />
              </button>
            </div>

            {/* Confirm and Pay */}
            <button 
              onClick={() => setIsPaid(true)}
              className="flex-1 bg-red-500 text-white rounded-full shadow-xl shadow-red-500/30 font-bold flex items-center justify-center h-14 hover:bg-red-600 active:bg-red-700 transition-colors text-sm"
            >
              Pay €{cartState.totalPrice.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
