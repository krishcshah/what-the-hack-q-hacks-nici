"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, Heart, ChefHat, Search, ShoppingBasket } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();
  const navItems = [
    { id: "discover", icon: Store, label: "Entdecken", href: "/" },
    { id: "favorites", icon: Heart, label: "Favoriten", href: "/" },
    { id: "cooking", icon: ChefHat, label: "Kochen", href: "/" },
    { id: "search", icon: Search, label: "Suchen", href: "/" },
    { id: "basket", icon: ShoppingBasket, label: "Warenkorb", href: "/cart" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = (item.id === "basket" && pathname === "/cart") || (item.id === "discover" && pathname === "/");
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? "text-red-500" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
