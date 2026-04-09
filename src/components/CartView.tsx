import { useState, useEffect } from 'react';
import { Mic, Settings2, Leaf, DollarSign, ChefHat, Plus, Trash, Camera, Check, Clock, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartState } from '../types';

export default function CartView({ cartState, onAdjust, onMicClick }: { cartState: CartState, onAdjust: (type: string) => void, onMicClick: () => void }) {
  const [isAdjustExpanded, setIsAdjustExpanded] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [prevPrice, setPrevPrice] = useState(cartState.totalPrice);
  const [showSlash, setShowSlash] = useState(false);
  const [savedStats, setSavedStats] = useState({ mins: 0, co2: '0' });

  useEffect(() => {
    if (cartState.totalPrice < prevPrice) {
      setShowSlash(true);
      const timer = setTimeout(() => {
        setShowSlash(false);
        setPrevPrice(cartState.totalPrice);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setPrevPrice(cartState.totalPrice);
    }
  }, [cartState.totalPrice, prevPrice]);

  useEffect(() => {
    if (isPaid) {
      setSavedStats({
        mins: Math.floor(Math.random() * 30) + 20,
        co2: (Math.random() * 2 + 0.5).toFixed(1)
      });
    }
  }, [isPaid]);

  const presets = [
    { id: 'money-saver', icon: DollarSign, label: 'Money Saver', desc: 'Cheapest generic versions' },
    { id: 'vegan', icon: Leaf, label: 'Vegan', desc: 'Replace with vegan alternatives' },
    { id: 'eco', icon: Leaf, label: 'Eco-Friendly', desc: 'Most eco-friendly options' },
    { id: "chef", icon: ChefHat, label: "Chef's Choice", desc: "Best quality food" },
    { id: 'min-order', icon: Plus, label: 'Min Order Filler', desc: 'Auto-fill to meet minimum' },
    { id: 'duplicate', icon: Camera, label: 'Duplicate Removal', desc: 'Scan fridge to remove items' },
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
        <p className="text-gray-500 text-center max-w-xs mb-8">Your groceries will arrive tomorrow between 14:00 and 15:00.</p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-sm"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Your Impact</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-3xl p-5 flex flex-col items-center justify-center border border-blue-100 shadow-sm relative overflow-hidden">
              <div className="absolute -right-4 -top-4 text-blue-100 opacity-50">
                <Clock size={80} />
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 text-blue-500 relative z-10">
                <Clock size={24} />
              </div>
              <div className="text-3xl font-black text-blue-600 relative z-10">{savedStats.mins}</div>
              <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mt-1 relative z-10 text-center">Mins Saved</div>
            </div>
            
            <div className="bg-green-50 rounded-3xl p-5 flex flex-col items-center justify-center border border-green-100 shadow-sm relative overflow-hidden">
              <div className="absolute -right-4 -top-4 text-green-100 opacity-50">
                <Leaf size={80} />
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 text-green-500 relative z-10">
                <Leaf size={24} />
              </div>
              <div className="text-3xl font-black text-green-600 relative z-10">{savedStats.co2}</div>
              <div className="text-[11px] font-bold text-green-800 uppercase tracking-wider mt-1 relative z-10 text-center">kg CO₂ Saved</div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-40 pt-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-2">
        <button className="text-sm text-gray-600 font-medium">Back</button>
        <h1 className="text-lg font-semibold text-black">Shopping Cart</h1>
        <div className="w-8"></div> {/* Spacer for centering */}
      </div>

      {/* Delivery Summary Card */}
      <div className="w-full bg-white rounded-2xl border border-gray-200 p-4 flex items-center justify-between shadow-sm mb-8">
        <div className="flex flex-col items-center justify-center w-1/2">
          <div className="font-bold text-2xl text-black">
            {cartState.totalPrice.toFixed(2).replace('.', ',')} €
          </div>
          <div className="text-sm text-gray-500">{cartState.itemCount} items</div>
        </div>

        <div className="w-px h-12 bg-gray-200"></div>

        <div className="flex flex-col items-center justify-center w-1/2">
          <span className="text-sm font-medium text-black mb-1">8. April</span>
          <span className="text-lg font-medium text-green-600">17:00 - 18:00</span>
        </div>
      </div>

      <div className="space-y-8">
        {cartState.categories.map((category) => (
          <div key={category.id} className="px-2">
            <h2 className="text-2xl font-bold mb-4 text-black">{category.title}</h2>
            <div className="space-y-0">
              {category.items.map((item, index) => (
                <div key={item.id}>
                  <div className="flex items-start py-4">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-sm text-black mr-4 shrink-0 mt-1">
                      1
                    </div>
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain mr-4 shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 text-[15px] leading-tight mb-1">{item.name}</h3>
                      <div className="text-sm text-gray-500 mb-1">
                        {item.name.includes('Quark') ? '185g' : item.name.includes('Trauben') ? '500g' : '32 Stück'}
                      </div>
                      <div className="inline-block bg-[#ffe800] text-black text-xs font-bold px-2 py-0.5 rounded">
                        {item.name.includes('Grill') ? '10% Rabatt' : `jetzt ${item.price.toFixed(2).replace('.', ',')}€`}
                      </div>
                    </div>
                    <div className="text-right ml-2 flex flex-col items-end shrink-0">
                      <div className="text-sm text-gray-400 line-through mb-0.5">
                        {(item.price + 0.6).toFixed(2).replace('.', ',')}
                      </div>
                      <div className="font-bold text-[#c00020] text-lg">
                        {item.price.toFixed(2).replace('.', ',')}
                      </div>
                    </div>
                  </div>
                  {index < category.items.length - 1 && <div className="h-px bg-gray-100 w-full ml-12"></div>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="mt-8 px-2 space-y-4">
        <div className="flex justify-between text-[#c00020] font-medium text-[15px]">
          <span>Gespart</span>
          <span>-1,08</span>
        </div>
        <div className="flex justify-between text-black font-medium text-[15px]">
          <span>Gesamtbetrag</span>
          <span>{cartState.totalPrice.toFixed(2).replace('.', ',')}</span>
        </div>
        
        <div className="border-t border-dashed border-gray-300 my-4"></div>
        
        <div className="flex justify-between text-green-600 font-medium text-[15px]">
          <span>Lieferung</span>
          <span>Immer gratis</span>
        </div>
        
        <div className="border-t border-dashed border-gray-300 my-4"></div>
        
        <div className="flex justify-between items-end">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-black">Endsumme</span>
            <span className="text-xs text-gray-500">(Inkl. MwSt.)</span>
          </div>
          <span className="text-xl font-bold text-black">{cartState.totalPrice.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-20 left-0 right-0 px-4 flex flex-col items-center space-y-3 z-40 pointer-events-none">
        <div className="w-full max-w-md pointer-events-auto flex flex-col items-center">
          
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

          {/* Quick Adjustments Pill */}
          <div className="flex bg-white rounded-full shadow-xl shadow-black/10 border border-gray-100 overflow-hidden h-14 mb-4 w-64">
            <button onClick={onMicClick} className="w-14 bg-[#c00020] flex items-center justify-center hover:bg-[#a0001a] transition-colors rounded-full m-1 shrink-0">
              <Mic size={20} className="text-white" />
            </button>
            <button 
              onClick={() => setIsAdjustExpanded(!isAdjustExpanded)}
              className="flex-1 flex items-center justify-center font-medium text-gray-600 hover:bg-gray-50 transition-colors text-[15px]"
            >
              Quick Adjustments <Zap size={16} className="ml-2 text-gray-400" />
            </button>
          </div>

          {/* Confirm Order Button */}
          <button 
            onClick={() => setIsPaid(true)}
            className="w-full bg-[#c00020] text-white rounded-xl shadow-md font-semibold flex items-center justify-center h-14 hover:bg-[#a0001a] active:bg-[#800015] transition-colors text-lg"
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
}
