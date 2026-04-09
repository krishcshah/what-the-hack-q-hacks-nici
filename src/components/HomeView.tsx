import { ArrowRight, Camera, ChefHat, DollarSign, Leaf, Mic, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { CartState } from '../types';

export default function HomeView({
  cartState,
  onGoToCart,
  onMicClick,
  onQuickAction
}: {
  cartState: CartState,
  onGoToCart: () => void,
  onMicClick: () => void,
  onQuickAction: (type: string) => void
}) {
  const allItems = cartState.categories.flatMap(c => c.items);
  const heroItems = allItems.slice(0, 4);
  const previewItems = allItems.slice(0, 3);
  const totalFormatter = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 1);
  const deliveryLabel = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long' }).format(deliveryDate);

  const quickActions = [
    { id: 'money-saver', label: 'Make it cheaper', icon: DollarSign, className: 'bg-white/80 text-rose-900 border-white/70' },
    { id: 'add-hamburger', label: 'Plan burgers tonight', icon: ChefHat, className: 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/20' },
    { id: 'vegan', label: 'Switch to vegan', icon: Leaf, className: 'bg-emerald-50 text-emerald-900 border-emerald-100' },
    { id: 'duplicate', label: 'Remove duplicates', icon: Camera, className: 'bg-amber-50 text-amber-950 border-amber-100' },
  ];

  const imageClassName = 'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105';

  return (
    <div
      className="min-h-screen px-4 pb-28 pt-5 text-zinc-900"
      style={{ background: 'radial-gradient(circle at top, #fff0f3 0%, #fff8f2 40%, #f7f7f5 100%)' }}
    >
      <div className="mb-4 flex items-end justify-between px-1">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-400">Nici assistant</p>
          <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.06em] text-zinc-950">Discover</h1>
        </div>
        <div className="rounded-full border border-white/70 bg-white/80 px-3 py-2 text-right shadow-sm backdrop-blur-md">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">Ready</p>
          <p className="text-sm font-semibold text-zinc-800">1 tap actions</p>
        </div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-[38px] border border-white/70 bg-gradient-to-br from-rose-200 via-pink-100 to-orange-50 px-4 pb-5 pt-4 shadow-[0_28px_80px_rgba(225,93,124,0.22)]"
      >
        <div className="pointer-events-none absolute inset-x-6 top-5 h-32 rounded-full bg-white/35 blur-3xl" />
        <div className="relative grid grid-cols-[1.05fr_0.95fr] gap-3">
          <div className="group row-span-2 overflow-hidden rounded-[28px] bg-white/70 shadow-lg shadow-black/10">
            {heroItems[0] ? (
              <img src={heroItems[0].image} alt={heroItems[0].name} className={imageClassName} />
            ) : (
              <div className="h-full min-h-[182px] bg-gradient-to-br from-rose-100 to-orange-100" />
            )}
          </div>
          <div className="group overflow-hidden rounded-[24px] bg-white/75 shadow-md shadow-black/5">
            {heroItems[1] ? (
              <img src={heroItems[1].image} alt={heroItems[1].name} className={imageClassName} />
            ) : (
              <div className="h-24 bg-gradient-to-br from-orange-100 to-rose-100" />
            )}
          </div>
          <div className="grid grid-cols-[0.82fr_1.18fr] gap-3">
            <div className="overflow-hidden rounded-[22px] bg-white/65">
              {heroItems[2] ? (
                <img src={heroItems[2].image} alt={heroItems[2].name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-24 bg-gradient-to-br from-white to-rose-50" />
              )}
            </div>
            <div className="group overflow-hidden rounded-[26px] bg-white/75 shadow-md shadow-black/5">
              {heroItems[3] ? (
                <img src={heroItems[3].image} alt={heroItems[3].name} className={imageClassName} />
              ) : (
                <div className="h-24 bg-gradient-to-br from-amber-100 to-orange-50" />
              )}
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-5 flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-red-500 shadow-lg shadow-red-500/25">
            <div className="relative h-8 w-8">
              <div className="absolute left-1.5 top-2 h-2 w-2 rounded-full bg-white" />
              <div className="absolute right-1.5 top-2 h-2 w-2 rounded-full bg-white" />
              <div className="absolute bottom-1 left-1/2 h-2.5 w-5 -translate-x-1/2 rounded-b-full border-b-2 border-white" />
            </div>
          </div>
          <p className="mt-5 text-center text-base font-medium text-rose-500">Hi, I&apos;m Nici</p>
          <h2 className="mt-2 max-w-[280px] text-center text-[2.35rem] font-semibold leading-[0.96] tracking-[-0.07em] text-zinc-950">
            How can I help with your order?
          </h2>
          <p className="mt-3 max-w-[270px] text-center text-sm leading-6 text-zinc-600">
            Tap the mic to open chat, or pick a quick action and I&apos;ll update the basket for you.
          </p>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onMicClick}
            className="group relative mt-7 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-red-600 shadow-[0_20px_40px_rgba(220,38,77,0.35)]"
          >
            <div className="absolute inset-0 rounded-full border border-white/25" />
            <div className="absolute inset-2 rounded-full border border-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
            <Mic size={34} className="text-white" />
          </motion.button>

          <div className="mt-6 flex w-[calc(100%+0.5rem)] gap-2 overflow-x-auto px-1 pb-1 scrollbar-hide">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <motion.button
                  key={action.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onQuickAction(action.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold backdrop-blur-md ${action.className}`}
                >
                  <Icon size={16} />
                  <span>{action.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.section>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between px-1">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">Basket</p>
            <h3 className="mt-1 text-2xl font-semibold tracking-[-0.05em] text-zinc-950">Upcoming delivery</h3>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-sm font-medium text-zinc-600 shadow-sm backdrop-blur-md">
            <Sparkles size={15} className="text-rose-500" />
            Ready to review
          </div>
        </div>

        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.985 }}
          onClick={onGoToCart}
          className="w-full rounded-[30px] border border-white/80 bg-white/85 p-4 text-left shadow-[0_24px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">Current basket</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="relative h-14 w-24">
                  {previewItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="absolute top-0 h-14 w-14 overflow-hidden rounded-2xl border-2 border-white shadow-md"
                      style={{ left: `${index * 22}px`, zIndex: previewItems.length - index }}
                    >
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                  ))}
                  <div className="absolute -bottom-2 left-0 rounded-full bg-yellow-300 px-2 py-1 text-[11px] font-bold text-zinc-900 shadow-sm">
                    {cartState.itemCount} items
                  </div>
                </div>
                <div>
                  <p className="text-[1.75rem] font-semibold leading-none tracking-[-0.05em] text-zinc-950">
                    {totalFormatter.format(cartState.totalPrice)}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">Tap to open and refine your order</p>
                </div>
              </div>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
              <ArrowRight size={18} />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-[24px] bg-gradient-to-r from-emerald-50 to-white px-4 py-3">
            <div>
              <p className="text-sm font-medium text-zinc-500">Scheduled for</p>
              <p className="text-lg font-semibold tracking-[-0.04em] text-zinc-950">{deliveryLabel}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-zinc-500">Time slot</p>
              <p className="text-[1.65rem] font-semibold tracking-[-0.05em] text-emerald-600">17:00 - 18:00</p>
            </div>
          </div>
        </motion.button>
      </section>
    </div>
  );
}
