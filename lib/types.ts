export interface Product {
  id: string;
  catalogId?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  detail?: string;
  promoLabel?: string;
  quantity?: number;
  isVegan?: boolean;
  isEco?: boolean;
  isGeneric?: boolean;
  isPremium?: boolean;
}

export interface CatalogProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  categoryId?: string;
  detail?: string;
  promoLabel?: string;
  quantity?: number;
  keywords?: string[];
  isVegan?: boolean;
  isEco?: boolean;
  isGeneric?: boolean;
  isPremium?: boolean;
}

export interface CartCategory {
  id: string;
  title: string;
  color: string;
  showChevron?: boolean;
  items: Product[];
}

export interface DeliverySlot {
  dateLabel: string;
  windowStart: string;
  windowEnd: string;
}

export interface CartState {
  categories: CartCategory[];
  totalPrice: number;
  itemCount: number;
  deliverySlot: DeliverySlot;
}
