"use client";

import CartView from "@/components/CartView";
import { useCart } from "@/components/CartProvider";

export default function CartPage() {
  const { cartState, handleAdjust, openVoice, closeVoice, isVoiceActive, removeProductFromCart, voiceError } = useCart();
  return (
    <CartView
      cartState={cartState}
      onAdjust={handleAdjust}
      onMicClick={openVoice}
      onMicClose={closeVoice}
      isVoiceActive={isVoiceActive}
      onRemoveProduct={removeProductFromCart}
      voiceError={voiceError}
    />
  );
}
