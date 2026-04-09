import { Home, Heart, BookOpen, TrendingUp, ShoppingBasket } from 'lucide-react';

export default function Navigation({ currentTab, setTab }: { currentTab: string, setTab: (t: string) => void }) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home', tab: 'home' },
    { id: 'favorites', icon: Heart, label: 'Favorites', tab: 'home' },
    { id: 'recipes', icon: BookOpen, label: 'Recipes', tab: 'home' },
    { id: 'pitch', icon: TrendingUp, label: 'Pitch', tab: 'pitch' },
    { id: 'basket', icon: ShoppingBasket, label: 'Basket', tab: 'cart' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.tab;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.tab)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
