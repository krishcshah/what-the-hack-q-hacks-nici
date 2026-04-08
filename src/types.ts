export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  isVegan?: boolean;
  isEco?: boolean;
  isGeneric?: boolean;
  isPremium?: boolean;
}

export interface CartCategory {
  id: string;
  title: string;
  color: string;
  items: Product[];
}

export interface CartState {
  categories: CartCategory[];
  totalPrice: number;
  itemCount: number;
}
