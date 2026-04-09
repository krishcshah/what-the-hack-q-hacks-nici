import { Mic, Keyboard, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { CartState } from '../types';

export default function HomeView({ cartState, onGoToCart, onMicClick }: { cartState: CartState, onGoToCart: () => void, onMicClick: () => void }) {
  // Get first item from cart for the delivery card preview
  const firstItem = cartState.categories.flatMap(c => c.items)[0];

  return (
    <div className="flex flex-col min-h-screen bg-white pb-20">
      {/* Pink Top Section */}
      <div className="bg-gradient-to-b from-[#fdfdfd] to-[#f4a3b4] rounded-b-[40px] pt-12 pb-8 px-4 flex flex-col items-center relative shadow-sm">
        
        {/* Images Grid */}
        <div className="w-full max-w-sm relative h-48 mb-8">
          {/* Left Image */}
          <div className="absolute left-0 top-4 w-[30%] h-32 rounded-2xl overflow-hidden shadow-md">
            <img src="/Vegane Zimtschnecken.jpg" alt="Cinnamon rolls" className="w-full h-full object-cover" />
          </div>
          
          {/* Center Image */}
          <div className="absolute left-[32%] top-0 w-[36%] h-36 rounded-2xl overflow-hidden shadow-md">
            <img src="/Pad Thai.jpg" alt="Pad Thai" className="w-full h-full object-cover" />
          </div>
          
          {/* Right Top Empty Box */}
          <div className="absolute right-0 top-0 w-[28%] h-8 bg-[#ffe4e8] rounded-xl"></div>
          
          {/* Right Image */}
          <div className="absolute right-0 top-10 w-[28%] h-36 rounded-2xl overflow-hidden shadow-md">
            <img src="/Rainbow Bowl Rezept.jpg" alt="Rainbow Bowl" className="w-full h-full object-cover" />
          </div>

          {/* Logo overlapping center image */}
          <div className="absolute left-[50%] -translate-x-1/2 top-28 w-14 h-14 rounded-2xl overflow-hidden shadow-lg border-4 border-[#f4a3b4] bg-[#c00020]">
            <img src="/Frame_2_von_Figma_2.png" alt="Nici Logo" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Greeting Text */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-medium text-[#c00020] mb-1">Hi I'm Nici,</h2>
          <h1 className="text-3xl font-semibold text-black leading-tight px-4">
            how can I help with<br />your order?
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMicClick}
            className="w-16 h-16 bg-[#c00020] rounded-full shadow-lg flex items-center justify-center text-white"
          >
            <Mic size={28} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 bg-[#d96b79] rounded-full shadow-md flex items-center justify-center text-[#8a1c2b]"
          >
            <Keyboard size={20} />
          </motion.button>
        </div>

        {/* Suggestion Chips */}
        <div className="w-full overflow-x-auto scrollbar-hide flex gap-3 px-2 pb-2">
          <button className="whitespace-nowrap bg-[#b54a59] text-white/90 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
            💸 Make my order cheaper
          </button>
          <button className="whitespace-nowrap bg-[#b54a59] text-white/90 px-4 py-2 rounded-full text-sm font-medium">
            Plan Dinner for fri...
          </button>
        </div>
      </div>

      {/* Bottom Section - Delivery Card */}
      <div className="px-6 pt-8">
        <h3 className="text-center text-lg font-medium text-black mb-4">Your upcoming Delivery</h3>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onGoToCart}
          className="w-full bg-white rounded-2xl border border-gray-200 p-4 flex items-center justify-between shadow-sm"
        >
          {/* Left Side: Image & Price */}
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center p-1">
              {firstItem && <img src={firstItem.image} alt="Item" className="w-full h-full object-contain" />}
              <div className="absolute -bottom-2 -right-2 bg-yellow-300 text-black text-xs font-bold w-6 h-6 rounded-md flex items-center justify-center">
                {cartState.itemCount}
              </div>
            </div>
            <div className="font-bold text-lg text-black">
              {cartState.totalPrice.toFixed(2).replace('.', ',')} €
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-10 bg-gray-200 mx-2"></div>

          {/* Right Side: Date & Time */}
          <div className="flex items-center gap-3 text-right">
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-black">8. April</span>
              <span className="text-base font-semibold text-green-600">17:00 - 18:00</span>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
        </motion.button>
      </div>
    </div>
  );
}
