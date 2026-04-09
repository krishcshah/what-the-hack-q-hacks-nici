"use client";

import { ArrowRight, Mic, ShoppingBasket } from "lucide-react";
import { motion } from "motion/react";
import { CartState } from "@/lib/types";

const fallbackHeroImages = ["/products/patties.svg", "/products/mozzarella.svg", "/products/fries.svg"];

const formatPrice = (value: number) => value.toFixed(2).replace(".", ",");

function NiciMark({ size = "lg" }: { size?: "sm" | "lg" }) {
  const isSmall = size === "sm";

  return (
    <div
      className={`flex items-center justify-center rounded-[22px] bg-[#ea0c3c] text-white shadow-[0_16px_30px_rgba(234,12,60,0.28)] ${
        isSmall ? "h-11 w-11" : "h-16 w-16"
      }`}
    >
      <div className={`relative ${isSmall ? "h-5 w-5" : "h-7 w-7"}`}>
        <span className={`absolute rounded-full bg-white ${isSmall ? "left-0.5 top-1 h-1.5 w-1.5" : "left-1 top-1.5 h-2 w-2"}`} />
        <span className={`absolute rounded-full bg-white ${isSmall ? "right-0.5 top-1 h-1.5 w-1.5" : "right-1 top-1.5 h-2 w-2"}`} />
        <span
          className={`absolute left-1/2 -translate-x-1/2 rounded-b-full border-white ${
            isSmall ? "bottom-0.5 h-2 w-3.5 border-b-[1.5px]" : "bottom-1 h-3 w-5 border-b-2"
          }`}
        />
      </div>
    </div>
  );
}

function HeroTile({ src, alt, className }: { src: string; alt: string; className: string }) {
  return (
    <div className={`overflow-hidden rounded-[24px] bg-white/70 shadow-[0_12px_24px_rgba(84,32,45,0.12)] ${className}`}>
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}

export default function HomeView({
  cartState,
  onGoToCart,
  onMicClick,
}: {
  cartState: CartState;
  onGoToCart: () => void;
  onMicClick: () => void;
}) {
  const allItems = cartState.categories.flatMap((category) => category.items);
  const heroImages = allItems.slice(0, 3).map((item) => ({ src: item.image, alt: item.name }));
  const deliveryPreview = allItems[0];
  const deliveryWindow = `${cartState.deliverySlot.windowStart} - ${cartState.deliverySlot.windowEnd}`;

  while (heroImages.length < 3) {
    const fallbackIndex = heroImages.length;
    heroImages.push({
      src: fallbackHeroImages[fallbackIndex],
      alt: "Picnic groceries",
    });
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#fff6f8_0%,#fffdfa_28%,#ffffff_100%)] px-4 pb-24 pt-6">
      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-10 h-40 w-40 rounded-full bg-[#ffdbe3] blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-24 h-48 w-48 rounded-full bg-[#ffe9cf] blur-3xl" />

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[36px] bg-[linear-gradient(180deg,#fbe7ec_0%,#f5b7c4_34%,#f29cb0_100%)] px-4 pb-6 pt-5 shadow-[0_24px_45px_rgba(212,76,108,0.18)]"
        >
          <div className="pointer-events-none absolute inset-x-10 top-0 h-28 rounded-full bg-white/35 blur-3xl" />

          <div className="relative grid grid-cols-[1fr_1.05fr_0.95fr] grid-rows-[82px_108px] gap-3">
            <HeroTile src={heroImages[0].src} alt={heroImages[0].alt} className="row-span-2 h-full" />
            <HeroTile src={heroImages[1].src} alt={heroImages[1].alt} className="h-full" />
            <div className="rounded-[24px] bg-[#f9dbe3]" />
            <HeroTile src={heroImages[2].src} alt={heroImages[2].alt} className="h-full" />
          </div>

          <div className="relative -mt-8 flex justify-center">
            <NiciMark />
          </div>

          <div className="relative mt-4 text-center">
            <p className="text-[16px] font-medium tracking-[-0.02em] text-[#c45a6c]">Hi I&apos;m Nici,</p>
            <h1 className="mx-auto mt-2 max-w-[280px] text-[26px] font-semibold leading-[1.08] tracking-[-0.05em] text-[#171214]">
              how can I help with your order?
            </h1>
          </div>

          <div className="relative mt-6 flex items-center justify-center gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              onClick={onMicClick}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-[#d40c2f] text-white shadow-[0_18px_34px_rgba(212,12,47,0.28)]"
              aria-label="Open voice chat"
            >
              <Mic size={34} strokeWidth={2.25} />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onGoToCart}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e78498] text-[#8b2440] shadow-[0_10px_20px_rgba(155,58,86,0.16)]"
              aria-label="Open basket"
            >
              <ShoppingBasket size={20} />
            </motion.button>
          </div>

          <div className="relative mt-6 flex flex-wrap justify-center gap-2">
            <div className="rounded-full bg-[#cf5168] px-4 py-2 text-[12px] font-medium text-white shadow-[0_8px_16px_rgba(152,46,75,0.12)]">
              Make my order cheaper
            </div>
            <div className="rounded-full bg-[#d9687f] px-4 py-2 text-[12px] font-medium text-white shadow-[0_8px_16px_rgba(152,46,75,0.12)]">
              Plan dinner for Friday
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
          className="relative mt-10"
        >
          <p className="text-center text-[15px] font-semibold tracking-[-0.02em] text-[#35302e]">Your upcoming delivery</p>

          <motion.button
            whileTap={{ scale: 0.985 }}
            whileHover={{ scale: 1.01 }}
            onClick={onGoToCart}
            className="mt-4 flex w-full items-center rounded-[24px] border border-[#e7dfdb] bg-white px-4 py-4 text-left shadow-[0_14px_30px_rgba(87,68,57,0.08)]"
            aria-label="Open basket"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-[18px] bg-[#f7f4f1] ring-1 ring-[#efe7e2]">
                {deliveryPreview ? (
                  <img src={deliveryPreview.image} alt={deliveryPreview.name} className="h-12 w-12 object-cover" />
                ) : (
                  <NiciMark size="sm" />
                )}
                <span className="absolute -bottom-1 -right-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#ffe70b] px-1.5 text-[11px] font-bold text-[#38321b] ring-2 ring-white">
                  {cartState.itemCount}
                </span>
              </div>

              <div className="min-w-0">
                <div className="text-[28px] font-semibold tracking-[-0.05em] text-[#161313]">{formatPrice(cartState.totalPrice)} €</div>
                <div className="text-[12px] font-medium text-[#837a76]">Tap to review your basket</div>
              </div>
            </div>

            <div className="mx-4 hidden h-14 w-px bg-[#ece4de] sm:block" />

            <div className="ml-auto pr-2 text-right">
              <div className="text-[14px] font-semibold text-[#2f2b2a]">{cartState.deliverySlot.dateLabel}</div>
              <div className="mt-1 text-[14px] font-semibold text-[#30a14e]">{deliveryWindow}</div>
            </div>

            <ArrowRight size={20} className="shrink-0 text-[#c7bfba]" />
          </motion.button>
        </motion.section>
      </div>
    </div>
  );
}
