"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode, type Dispatch, type SetStateAction } from "react";
import { AnimatePresence } from "motion/react";
import {
  addProductToCategories,
  applyAdjustment,
  calculateCartTotals,
  defaultDeliverySlot,
  formatDeliverySlot,
  generateMockCart,
  removeProductFromCategories,
  searchCatalog,
} from "@/lib/data";
import { type CartCategory, type CartState, type DeliverySlot } from "@/lib/types";
import { requestMicrophoneAccess, type ElevenLabsClientTools } from "@/lib/elevenlabs-session";
import InitialLoader from "./InitialLoader";
import GlobalVoiceAgent from "./GlobalVoiceAgent";
import CameraScanner from "./CameraScanner";
import AdjustmentLoader from "./AdjustmentLoader";
import MinOrderLoader from "./MinOrderLoader";
import HamburgerLoader from "./HamburgerLoader";
import type { ChatMessage } from "./VoiceChatView";

type DeliverySlotInput = Partial<DeliverySlot>;

interface CartContextValue {
  cartState: CartState;
  isAdjusting: boolean;
  handleAdjust: (type: string) => void;
  addProductToCart: (productId: string) => string;
  removeProductFromCart: (productId: string) => string;
  searchProducts: (query: string) => string;
  scheduleDelivery: (slotInput: DeliverySlotInput) => string;
  cartSummary: string;
  voiceAgentContext: string;
  voiceClientTools: ElevenLabsClientTools;
  isVoiceActive: boolean;
  openVoice: () => void;
  closeVoice: () => void;
  openHomeVoice: () => void;
  closeHomeVoice: () => void;
  isHomeVoiceActive: boolean;
  voiceError: string | null;
  messages: ChatMessage[];
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
}

const initialMessages: ChatMessage[] = [
  {
    role: "assistant",
    text:
      "Hey there!\nI'm Nici your personal shopping assistant. I automatically fill your basket and even schedule the delivery for you, if you want. But how about you tell me more about yourself, so I pick exactly the products you love.\n\nWhat are your eating preferences?",
  },
];

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [cartCategories, setCartCategories] = useState<CartCategory[]>(() => generateMockCart());
  const [deliverySlot, setDeliverySlot] = useState<DeliverySlot>(defaultDeliverySlot);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState<string | null>(null);
  const [pendingCategories, setPendingCategories] = useState<CartCategory[] | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isHomeVoiceActive, setIsHomeVoiceActive] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const openVoice = useCallback(() => {
    setVoiceError(null);
    void requestMicrophoneAccess()
      .then(() => {
        setIsVoiceActive(true);
      })
      .catch((error) => {
        console.error("Microphone access failed before opening cart voice:", error);
        setVoiceError("Microphone access is blocked. Enable microphone permission for this site and try again.");
      });
  }, []);

  const openHomeVoice = useCallback(() => {
    setVoiceError(null);
    void requestMicrophoneAccess()
      .then(() => {
        setIsHomeVoiceActive(true);
      })
      .catch((error) => {
        console.error("Microphone access failed before opening onboarding voice:", error);
        setVoiceError("Microphone access is blocked. Enable microphone permission for this site and try again.");
      });
  }, []);

  const cartState = useMemo<CartState>(() => {
    const { totalPrice, itemCount } = calculateCartTotals(cartCategories);
    return { categories: cartCategories, totalPrice, itemCount, deliverySlot };
  }, [cartCategories, deliverySlot]);

  const cartSummary = useMemo(
    () => `${cartState.itemCount} items, total €${cartState.totalPrice.toFixed(2)}`,
    [cartState.itemCount, cartState.totalPrice]
  );

  const searchProducts = useCallback((query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return "Search query cannot be empty. Ask for a specific product name or category.";
    }

    const results = searchCatalog(trimmedQuery);
    if (results.length === 0) {
      return `No products matched "${trimmedQuery}".`;
    }

    return JSON.stringify({
      results: results.map((product) => ({
        productId: product.id,
        name: product.name,
        price: Number(product.price.toFixed(2)),
      })),
    });
  }, []);

  const addProductToCart = useCallback((productId: string) => {
    const trimmedProductId = productId.trim();
    if (!trimmedProductId) {
      return "Product ID is required. Search for products first to get a valid productId.";
    }

    let response = `I couldn't find a product with id "${trimmedProductId}".`;

    setCartCategories((currentCategories) => {
      const result = addProductToCategories(currentCategories, trimmedProductId);
      if (!result) {
        return currentCategories;
      }

      const totals = calculateCartTotals(result.categories);
      response = `Added ${result.product.name} to the cart. The cart now has ${totals.itemCount} items totaling €${totals.totalPrice.toFixed(2)}.`;
      return result.categories;
    });

    return response;
  }, []);

  const removeProductFromCart = useCallback((productId: string) => {
    const trimmedProductId = productId.trim();
    if (!trimmedProductId) {
      return "Product ID is required to remove an item from the cart.";
    }

    let response = `There is no cart item matching "${trimmedProductId}".`;

    setCartCategories((currentCategories) => {
      const result = removeProductFromCategories(currentCategories, trimmedProductId);
      if (!result) {
        return currentCategories;
      }

      const totals = calculateCartTotals(result.categories);
      response = `Removed ${result.product.name} from the cart. The cart now has ${totals.itemCount} items totaling €${totals.totalPrice.toFixed(2)}.`;
      return result.categories;
    });

    return response;
  }, []);

  const scheduleDelivery = useCallback((slotInput: DeliverySlotInput) => {
    const nextSlot = {
      dateLabel: slotInput.dateLabel?.trim() ?? "",
      windowStart: slotInput.windowStart?.trim() ?? "",
      windowEnd: slotInput.windowEnd?.trim() ?? "",
    };

    if (!nextSlot.dateLabel || !nextSlot.windowStart || !nextSlot.windowEnd) {
      return "Delivery scheduling requires dateLabel, windowStart, and windowEnd.";
    }

    setDeliverySlot(nextSlot);
    return `Delivery scheduled for ${formatDeliverySlot(nextSlot)}.`;
  }, []);

  const voiceAgentContext = useMemo(() => {
    const categorySummary = cartState.categories
      .map((category) => `${category.title}: ${category.items.map((item) => item.name).join(", ")}`)
      .join(" | ");

    return [
      "You are the Picnic grocery AI assistant.",
      `Cart summary: ${cartSummary}.`,
      `Delivery slot: ${formatDeliverySlot(cartState.deliverySlot)}.`,
      `Cart contents: ${categorySummary}.`,
      "When the user wants to find products, call search_products.",
      "When the user wants to add or remove a product, call add_product_to_cart or remove_product_from_cart.",
      "When the user wants to set or change delivery timing, call schedule_delivery.",
      "Keep spoken replies brief and confirm the result after using a tool.",
    ].join("\n");
  }, [cartState.categories, cartState.deliverySlot, cartSummary]);

  const voiceClientTools = useMemo<ElevenLabsClientTools>(
    () => ({
      search_products: ({ query }: { query?: string }) => searchProducts(query ?? ""),
      add_product_to_cart: ({ productId }: { productId?: string }) => addProductToCart(productId ?? ""),
      remove_product_from_cart: ({ productId }: { productId?: string }) => removeProductFromCart(productId ?? ""),
      schedule_delivery: ({
        dateLabel,
        windowStart,
        windowEnd,
      }: {
        dateLabel?: string;
        windowStart?: string;
        windowEnd?: string;
      }) => scheduleDelivery({ dateLabel, windowStart, windowEnd }),
    }),
    [addProductToCart, removeProductFromCart, scheduleDelivery, searchProducts]
  );

  const handleAdjust = (type: string) => {
    if (type === "duplicate") {
      setIsCameraActive(true);
      return;
    }
    const newCat = applyAdjustment(cartCategories, type);
    setPendingCategories(newCat);
    setAdjustmentType(type);
    setIsAdjusting(true);
  };

  const handleCameraComplete = () => {
    setIsCameraActive(false);
    const newCat = applyAdjustment(cartCategories, "duplicate");
    setPendingCategories(newCat);
    setAdjustmentType("duplicate");
    setIsAdjusting(true);
  };

  const finalizeAdjustment = () => {
    if (pendingCategories) {
      setCartCategories(pendingCategories);
    }
    setIsAdjusting(false);
    setAdjustmentType(null);
    setPendingCategories(null);
  };

  return (
    <CartContext.Provider
      value={{
        cartState,
        isAdjusting,
        handleAdjust,
        addProductToCart,
        removeProductFromCart,
        searchProducts,
        scheduleDelivery,
        cartSummary,
        voiceAgentContext,
        voiceClientTools,
        isVoiceActive,
        openVoice,
        closeVoice: () => {
          setVoiceError(null);
          setIsVoiceActive(false);
        },
        openHomeVoice,
        closeHomeVoice: () => {
          setVoiceError(null);
          setIsHomeVoiceActive(false);
        },
        isHomeVoiceActive,
        voiceError,
        messages,
        setMessages,
      }}
    >
      {isInitialLoading && <InitialLoader cartState={cartState} onComplete={() => setIsInitialLoading(false)} />}

      <AnimatePresence>
        {isVoiceActive && (
          <GlobalVoiceAgent
            isActive={isVoiceActive}
            onClose={() => setIsVoiceActive(false)}
            cartSummary={cartSummary}
            agentContext={voiceAgentContext}
            clientTools={voiceClientTools}
            onAction={handleAdjust}
          />
        )}
        {isCameraActive && (
          <CameraScanner onComplete={handleCameraComplete} onCancel={() => setIsCameraActive(false)} />
        )}
      </AnimatePresence>

      {isAdjusting && pendingCategories && adjustmentType === "min-order" && (
        <MinOrderLoader onComplete={finalizeAdjustment} />
      )}
      {isAdjusting && pendingCategories && adjustmentType === "add-hamburger" && (
        <HamburgerLoader onComplete={finalizeAdjustment} />
      )}
      {isAdjusting && pendingCategories && adjustmentType !== "min-order" && adjustmentType !== "add-hamburger" && (
        <AdjustmentLoader oldCategories={cartCategories} newCategories={pendingCategories} onComplete={finalizeAdjustment} />
      )}

      <div style={{ display: isAdjusting ? "none" : "block" }}>{children}</div>
    </CartContext.Provider>
  );
}
