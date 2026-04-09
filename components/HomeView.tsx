"use client";

import { Mic } from "lucide-react";
import { motion } from "motion/react";
import { CartState } from "@/lib/types";
import { formatDeliverySlot } from "@/lib/data";

export default function HomeView({
  cartState,
  onGoToCart,
  onMicClick,
  voiceError,
}: {
  cartState: CartState;
  onGoToCart: () => void;
  onMicClick: () => void;
  voiceError: string | null;
}) {
  const allItems = cartState.categories.flatMap((category) => category.items);
  const previewItems = allItems.slice(0, 3);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5f5f5] px-4 pb-20">
      <div className="flex flex-col items-center mb-12">
        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-red-500/20">
          <div className="relative w-8 h-8">
            <div className="absolute top-2 left-1.5 w-2 h-2 bg-white rounded-full"></div>
            <div className="absolute top-2 right-1.5 w-2 h-2 bg-white rounded-full"></div>
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-2.5 border-b-2 border-white rounded-b-full"></div>
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 text-center max-w-[250px]">Hey, how can I help you today?</h1>
      </div>

      {voiceError && (
        <div className="mb-6 max-w-sm rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700 shadow-sm">
          {voiceError}
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onMicClick}
        className="w-32 h-32 bg-white rounded-full shadow-xl flex items-center justify-center mb-16 relative group"
      >
        <div className="absolute inset-0 bg-red-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity"></div>
        <Mic size={48} className="text-red-500" />
        <div className="absolute inset-0 rounded-full border-2 border-red-500 opacity-20 animate-ping" style={{ animationDuration: "3s" }}></div>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onGoToCart}
        className="w-full max-w-sm bg-white rounded-full shadow-lg p-2 flex items-center border border-gray-100"
      >
        <div className="w-1/4 relative h-14 flex items-center pl-2">
          {previewItems.map((item, index) => (
            <div
              key={item.id}
              className="absolute w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-100 shadow-sm"
              style={{
                left: `${index * 16}px`,
                zIndex: 10 - index,
                opacity: 1 - index * 0.25,
              }}
            >
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
          ))}
          <div className="absolute -top-1 left-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center z-20 border-2 border-white">
            {cartState.itemCount}
          </div>
        </div>

        <div className="w-3/4 pr-4 pl-2 flex flex-col items-end justify-center">
          <div className="text-xs text-gray-500 font-medium">Delivery: {formatDeliverySlot(cartState.deliverySlot)}</div>
          <div className="text-lg font-bold text-gray-900">€{cartState.totalPrice.toFixed(2)}</div>
        </div>
      </motion.button>
    </div>
  );
}
