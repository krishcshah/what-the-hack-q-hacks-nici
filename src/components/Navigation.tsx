import { Home, Heart, BookOpen, Search, ShoppingBasket } from 'lucide-react';

export default function Navigation({
  currentTab,
  setTab,
  basketCount
}: {
  currentTab: string,
  setTab: (t: string) => void,
  basketCount: number
}) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Discover' },
    { id: 'favorites', icon: Heart, label: 'Saved' },
    { id: 'recipes', icon: BookOpen, label: 'Cook' },
    { id: 'browse', icon: Search, label: 'Search' },
    { id: 'basket', icon: ShoppingBasket, label: 'Basket' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 pb-safe backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-md items-center justify-around border-t border-white/70 bg-white/80 px-2 shadow-[0_-12px_30px_rgba(15,23,42,0.08)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id || (currentTab === 'cart' && item.id === 'basket');
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id === 'basket' ? 'cart' : 'home')} // Only home and cart are really implemented
              className={`relative flex h-full w-full flex-col items-center justify-center space-y-1 ${
                isActive ? 'text-rose-500' : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              <div className={`relative rounded-full px-3 py-1 ${isActive ? 'bg-rose-50' : ''}`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {item.id === 'basket' && basketCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                    {basketCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
