"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Mic, ChevronRight, Zap, Check, DollarSign, Leaf, ChefHat, Plus, Camera } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { CartState } from "@/lib/types";
import { formatDeliverySlot } from "@/lib/data";

const formatPrice = (value: number) => value.toFixed(2).replace(".", ",");

export default function CartView({
  cartState,
  onAdjust,
  onMicClick,
  onMicClose,
  isVoiceActive,
  onRemoveProduct,
}: {
  cartState: CartState;
  onAdjust: (type: string) => void;
  onMicClick: () => void;
  onMicClose: () => void;
  isVoiceActive: boolean;
  onRemoveProduct: (productId: string) => void;
}) {
  const [isAdjustExpanded, setIsAdjustExpanded] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const footerRef = useRef<HTMLDivElement | null>(null);

  const presets = [
    { id: "money-saver", icon: DollarSign, label: "Money Saver", desc: "Use cheaper alternatives where possible" },
    { id: "vegan", icon: Leaf, label: "Vegan", desc: "Replace matching items with vegan swaps" },
    { id: "eco", icon: Leaf, label: "Eco-Friendly", desc: "Prefer local and eco options" },
    { id: "chef", icon: ChefHat, label: "Chef's Choice", desc: "Upgrade to premium picks" },
    { id: "min-order", icon: Plus, label: "Min Order Filler", desc: "Auto-add common staples" },
    { id: "duplicate", icon: Camera, label: "Duplicate Removal", desc: "Scan and remove overlaps" },
    { id: "add-hamburger", icon: ChefHat, label: "Add Hamburgers", desc: "Add a full burger recipe" },
  ];

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setIsAdjustExpanded(false);
        }
      },
      {
        threshold: 0.25,
      }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const pricing = useMemo(() => {
    const savings = cartState.categories.reduce((total, category) => {
      return (
        total +
        category.items.reduce((categoryTotal, item) => {
          const quantity = item.quantity ?? 1;
          const originalPrice = item.originalPrice ?? item.price;
          return categoryTotal + Math.max(originalPrice - item.price, 0) * quantity;
        }, 0)
      );
    }, 0);

    return {
      subtotal: Number((cartState.totalPrice + savings).toFixed(2)),
      savings: Number(savings.toFixed(2)),
      total: cartState.totalPrice,
    };
  }, [cartState.categories, cartState.totalPrice]);

  if (isPaid) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#37b24d] text-white shadow-xl shadow-green-500/20"
        >
          <Check size={44} strokeWidth={3} />
        </motion.div>
        <h2 className="mb-2 text-3xl font-bold text-[#222]">Order Confirmed</h2>
        <p className="max-w-xs text-center text-sm text-[#666]">Your groceries are booked for {formatDeliverySlot(cartState.deliverySlot)}.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-5 pb-36 pt-5">
      <header className="mb-6 flex items-center justify-between">
        <Link href="/" className="text-sm font-medium text-[#3c3c3c]">
          Back
        </Link>
        <h1 className="text-lg font-semibold text-[#222]">Shopping Cart</h1>
        <div className="w-10" />
      </header>

      <section className="mb-10 rounded-[20px] border border-[#d9d9d9] bg-white px-6 py-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="text-center">
            <div className="text-[20px] font-bold tracking-[-0.03em] text-[#111]">{formatPrice(cartState.totalPrice)} €</div>
            <div className="mt-1 text-sm text-[#777]">{cartState.itemCount} items</div>
          </div>
          <div className="h-14 w-px bg-[#dcdcdc]" />
          <div className="text-center">
            <div className="text-[20px] font-semibold tracking-[-0.03em] text-[#222]">{cartState.deliverySlot.dateLabel}</div>
            <div className="mt-1 text-[18px] font-semibold text-[#3da64a]">
              {cartState.deliverySlot.windowStart} - {cartState.deliverySlot.windowEnd}
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-8">
        {cartState.categories.map((category) => (
          <section key={category.id}>
            <div className="mb-3 flex items-center gap-2">
              <h2 className="text-[20px] font-bold tracking-[-0.03em] text-[#111]">{category.title}</h2>
              {category.showChevron && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f1f1f1] text-[#8c8c8c]">
                  <ChevronRight size={15} />
                </span>
              )}
            </div>

            <div>
              {category.items.map((item) => (
                <div key={item.id} className="flex items-start gap-3 border-b border-[#f1f1f1] py-3 last:border-b-0">
                  <button
                    onClick={() => onRemoveProduct(item.catalogId ?? item.id)}
                    className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3f0ea] text-sm font-semibold text-[#5c5b58]"
                    aria-label={`Remove ${item.name}`}
                  >
                    {item.quantity ?? 1}
                  </button>

                  <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#fafafa]">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-[15px] font-medium leading-5 text-[#404040]">{item.name}</h3>
                    {item.detail && <p className="text-[13px] leading-4 text-[#8f8f8f]">{item.detail}</p>}
                    {item.promoLabel && (
                      <div className="mt-1 inline-flex rounded-[6px] bg-[#ffd521] px-2 py-[2px] text-[12px] font-bold leading-none text-[#2c2c2c]">
                        {item.promoLabel}
                      </div>
                    )}
                  </div>

                  <div className="min-w-[54px] pt-1 text-right">
                    {item.originalPrice && item.originalPrice > item.price && (
                      <div className="text-[13px] font-semibold text-[#c7c7c7] line-through">{formatPrice(item.originalPrice)}</div>
                    )}
                    <div className="text-[15px] font-bold text-[#f03b37]">{formatPrice(item.price)}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div ref={footerRef} className="mt-8 border-t border-[#f1f1f1] pb-24 pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-[16px]">
            <span className="font-semibold text-[#f03b37]">Gespart</span>
            <span className="font-bold text-[#f03b37]">-{formatPrice(pricing.savings)}</span>
          </div>

          <div className="flex items-center justify-between border-b border-dashed border-[#d7d7d7] pb-4 text-[16px]">
            <span className="font-semibold text-[#4b4b4b]">Gesamtbetrag</span>
            <span className="font-bold text-[#343434]">{formatPrice(pricing.subtotal)}</span>
          </div>

          <div className="flex items-center justify-between border-b border-dashed border-[#d7d7d7] pb-4 text-[16px]">
            <span className="font-semibold text-[#5aac47]">Lieferung</span>
            <span className="font-bold text-[#5aac47]">Immer gratis</span>
          </div>

          <div className="flex items-end justify-between pt-1">
            <div className="text-[15px] font-semibold text-[#444]">
              Endsumme <span className="text-[12px] font-medium text-[#8f8f8f]">(inkl. MwSt.)</span>
            </div>
            <div className="text-[19px] font-bold text-[#222]">{formatPrice(pricing.total)}</div>
          </div>
        </div>

        <button
          onClick={() => setIsPaid(true)}
          className="mt-6 flex h-12 w-full items-center justify-center rounded-[12px] bg-[#d40c2f] text-[17px] font-semibold text-white shadow-[0_10px_25px_rgba(212,12,47,0.2)] transition hover:bg-[#bf0b2a]"
        >
          Confirm Order
        </button>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-40 mx-auto flex max-w-md justify-center px-5">
        <div className="w-full">
          <AnimatePresence>
            {isAdjustExpanded && !isFooterVisible && !isVoiceActive && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                className="pointer-events-auto mb-3 overflow-hidden rounded-[26px] border border-[#ececec] bg-white p-2 shadow-[0_14px_30px_rgba(0,0,0,0.12)]"
              >
                <div className="max-h-[44vh] space-y-1 overflow-y-auto p-1 scrollbar-hide">
                  {presets.map((preset) => {
                    const Icon = preset.icon;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => {
                          onAdjust(preset.id);
                          setIsAdjustExpanded(false);
                        }}
                        className="flex w-full items-center rounded-[20px] px-3 py-3 text-left transition hover:bg-[#fafafa]"
                      >
                        <div className="mr-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f6f6f6] text-[#444]">
                          <Icon size={19} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#222]">{preset.label}</div>
                          <div className="text-xs text-[#777]">{preset.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!isFooterVisible && !isVoiceActive && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="pointer-events-auto mx-auto flex w-full max-w-[250px] items-center rounded-full border border-[#ededed] bg-white p-2 shadow-[0_12px_26px_rgba(0,0,0,0.14)]"
              >
                <button
                  onClick={onMicClick}
                  className="mr-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#d40c2f] text-white"
                  aria-label="Open voice assistant"
                >
                  <Mic size={20} />
                </button>

                <button
                  onClick={() => setIsAdjustExpanded((current) => !current)}
                  className="flex flex-1 items-center justify-between pr-2 text-left"
                  aria-expanded={isAdjustExpanded}
                  aria-label="Open quick adjustments"
                >
                  <span className="text-[15px] font-medium text-[#6a6a6a]">Quick Adjustments</span>
                  <Zap size={16} className="text-[#9fc2ff]" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {isVoiceActive && (
        <button
          onClick={onMicClose}
          className="fixed right-5 top-5 z-[60] rounded-full bg-white/92 px-3 py-1.5 text-xs font-semibold text-[#666] shadow-[0_8px_18px_rgba(0,0,0,0.08)] backdrop-blur"
        >
          End voice
        </button>
      )}
    </div>
  );
}
