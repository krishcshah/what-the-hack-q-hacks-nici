import { type CartCategory, type CatalogProduct, type DeliverySlot, type Product } from "./types";

const categoryDefinitions = {
  essentials: {
    id: "essentials",
    title: "Essentials",
    color: "",
  },
  pizzaNight: {
    id: "pizza-night",
    title: "Pizza on Thursday",
    color: "",
    showChevron: true,
  },
  burgerNight: {
    id: "burger-night",
    title: "Burger Night",
    color: "",
    showChevron: true,
  },
  household: {
    id: "household",
    title: "Household",
    color: "",
  },
  classicHamburger: {
    id: "classic-hamburger",
    title: "Classic Hamburger",
    color: "",
    showChevron: true,
  },
} as const satisfies Record<string, Pick<CartCategory, "id" | "title" | "color" | "showChevron">>;

export const defaultDeliverySlot: DeliverySlot = {
  dateLabel: "8. April",
  windowStart: "17:00",
  windowEnd: "18:00",
};

export const productCatalog: CatalogProduct[] = [
  {
    id: "quark-activ",
    name: "Milram Frühlingsquark activ",
    price: 0.99,
    originalPrice: 1.59,
    image: "/products/quark.svg",
    categoryId: "essentials",
    detail: "185g",
    promoLabel: "jetzt 0.99€",
    keywords: ["quark", "milram", "dairy", "fruehlingsquark"],
  },
  {
    id: "seedless-grapes",
    name: "Trauben hell kernlos",
    price: 2.29,
    originalPrice: 2.59,
    image: "/products/grapes.svg",
    categoryId: "essentials",
    detail: "500g",
    promoLabel: "jetzt 2.29€",
    keywords: ["grapes", "fruit", "seedless", "trauben"],
    isVegan: true,
  },
  {
    id: "grill-lighter",
    name: "Gut&Günstig Grill & Kamin Anzünder",
    price: 1.61,
    originalPrice: 1.79,
    image: "/products/lighter.svg",
    categoryId: "essentials",
    detail: "32 Stück",
    promoLabel: "10% Rabatt",
    keywords: ["lighter", "grill", "household", "anzuender"],
  },
  {
    id: "pizza-dough",
    name: "Original Pizzateig",
    price: 1.99,
    image: "/products/dough.svg",
    categoryId: "pizza-night",
    detail: "400g",
    keywords: ["pizza", "dough", "teig"],
  },
  {
    id: "tomato-passata",
    name: "Passierte Tomaten",
    price: 1.29,
    image: "/products/sauce.svg",
    categoryId: "pizza-night",
    detail: "690g",
    keywords: ["pizza", "tomato", "passata", "sauce"],
    isVegan: true,
  },
  {
    id: "mozzarella",
    name: "Mozzarella",
    price: 2.49,
    image: "/products/mozzarella.svg",
    categoryId: "pizza-night",
    detail: "2 x 125g",
    keywords: ["pizza", "cheese", "mozzarella"],
  },
  {
    id: "brown-mushrooms",
    name: "Braune Champignons",
    price: 1.89,
    image: "/products/mushrooms.svg",
    categoryId: "pizza-night",
    detail: "250g",
    keywords: ["pizza", "mushroom", "champignons"],
    isVegan: true,
  },
  {
    id: "salami-milano",
    name: "Salami Milano",
    price: 2.99,
    image: "/products/salami.svg",
    categoryId: "pizza-night",
    detail: "80g",
    keywords: ["pizza", "salami", "milano"],
  },
  {
    id: "black-olives",
    name: "Schwarze Oliven",
    price: 1.79,
    image: "/products/olives.svg",
    categoryId: "pizza-night",
    detail: "195g",
    keywords: ["pizza", "olives"],
    isVegan: true,
  },
  {
    id: "fresh-basil",
    name: "Frischer Basilikum",
    price: 1.19,
    image: "/products/basil.svg",
    categoryId: "pizza-night",
    detail: "20g",
    keywords: ["pizza", "basil", "herbs"],
    isVegan: true,
  },
  {
    id: "brioche-buns",
    name: "Brioche Burger Buns",
    price: 2.19,
    image: "/products/buns.svg",
    categoryId: "burger-night",
    detail: "4 Stück",
    keywords: ["burger", "buns", "bread"],
  },
  {
    id: "beef-patties",
    name: "Angus Rindfleisch Patties",
    price: 12.99,
    image: "/products/patties.svg",
    categoryId: "burger-night",
    detail: "800g",
    keywords: ["burger", "beef", "patties"],
  },
  {
    id: "cheddar-slices",
    name: "Cheddar Scheiben",
    price: 3.29,
    image: "/products/cheddar.svg",
    categoryId: "burger-night",
    detail: "150g",
    keywords: ["burger", "cheddar", "cheese"],
  },
  {
    id: "burger-sauce",
    name: "Burger Sauce",
    price: 2.49,
    image: "/products/burger-sauce.svg",
    categoryId: "burger-night",
    detail: "250ml",
    keywords: ["burger", "sauce"],
  },
  {
    id: "oven-fries",
    name: "Ofen Pommes",
    price: 6.19,
    image: "/products/fries.svg",
    categoryId: "burger-night",
    detail: "750g",
    keywords: ["burger", "fries", "potatoes"],
    isVegan: true,
  },
  {
    id: "toilet-paper-8-rolls",
    name: "Toilettenpapier",
    price: 5.49,
    image: "/products/toilet-paper.svg",
    categoryId: "household",
    detail: "8 Rollen",
    keywords: ["household", "toilet paper"],
  },
  {
    id: "dish-soap",
    name: "Spülmittel Zitrone",
    price: 2.29,
    image: "/products/dish-soap.svg",
    categoryId: "household",
    detail: "500ml",
    keywords: ["household", "soap", "dish"],
  },
];

const cloneCategories = (categories: CartCategory[]) =>
  categories.map((category) => ({
    ...category,
    items: category.items.map((item) => ({ ...item })),
  }));

const createCartItem = (product: CatalogProduct, id: string): Product => ({
  id,
  catalogId: product.id,
  name: product.name,
  price: product.price,
  originalPrice: product.originalPrice,
  image: product.image,
  detail: product.detail,
  promoLabel: product.promoLabel,
  quantity: product.quantity ?? 1,
  isVegan: product.isVegan,
  isEco: product.isEco,
  isGeneric: product.isGeneric,
  isPremium: product.isPremium,
});

const buildCategory = (categoryId: string): CartCategory => {
  const definition = categoryDefinitions[categoryId as keyof typeof categoryDefinitions] ?? categoryDefinitions.household;
  return { ...definition, items: [] };
};

export const formatDeliverySlot = (slot: DeliverySlot) => `${slot.dateLabel}, ${slot.windowStart} - ${slot.windowEnd}`;

export const calculateCartTotals = (categories: CartCategory[]) => {
  let totalPrice = 0;
  let itemCount = 0;
  categories.forEach((category) => {
    category.items.forEach((item) => {
      const quantity = item.quantity ?? 1;
      totalPrice += item.price * quantity;
      itemCount += quantity;
    });
  });

  return {
    totalPrice: Number(totalPrice.toFixed(2)),
    itemCount,
  };
};

export const findCatalogProduct = (productId: string) => productCatalog.find((product) => product.id === productId) ?? null;

export const searchCatalog = (query: string): CatalogProduct[] => {
  const trimmedQuery = query.trim().toLowerCase();
  if (!trimmedQuery) {
    return [];
  }

  const terms = trimmedQuery.split(/\s+/).filter(Boolean);

  return [...productCatalog]
    .map((product) => {
      const haystack = `${product.name} ${product.detail ?? ""} ${(product.keywords ?? []).join(" ")}`.toLowerCase();
      const exactNameMatch = product.name.toLowerCase().includes(trimmedQuery) ? 3 : 0;
      const matchingTerms = terms.reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), 0);
      return { product, score: exactNameMatch + matchingTerms };
    })
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score || left.product.price - right.product.price)
    .slice(0, 6)
    .map(({ product }) => product);
};

export const addProductToCategories = (
  categories: CartCategory[],
  productId: string
): { categories: CartCategory[]; product: CatalogProduct } | null => {
  const product = findCatalogProduct(productId);
  if (!product) {
    return null;
  }

  const nextCategories = cloneCategories(categories);
  const targetCategoryId = product.categoryId ?? "household";
  let targetCategory = nextCategories.find((category) => category.id === targetCategoryId);

  if (!targetCategory) {
    targetCategory = buildCategory(targetCategoryId);
    nextCategories.push(targetCategory);
  }

  const instanceCount =
    nextCategories.flatMap((category) => category.items).filter((item) => item.catalogId === product.id).length + 1;
  targetCategory.items.push(createCartItem(product, `${product.id}-${instanceCount}`));

  return { categories: nextCategories, product };
};

export const removeProductFromCategories = (
  categories: CartCategory[],
  productId: string
): { categories: CartCategory[]; product: Product } | null => {
  const nextCategories = cloneCategories(categories);

  for (const category of nextCategories) {
    const index = category.items.findIndex((item) => item.catalogId === productId || item.id === productId);
    if (index >= 0) {
      const [product] = category.items.splice(index, 1);
      return {
        categories: nextCategories.filter((entry) => entry.items.length > 0),
        product,
      };
    }
  }

  return null;
};

export const generateMockCart = (): CartCategory[] => [
  {
    ...categoryDefinitions.essentials,
    items: [
      createCartItem(findCatalogProduct("quark-activ")!, "e1"),
      createCartItem(findCatalogProduct("seedless-grapes")!, "e2"),
      createCartItem(findCatalogProduct("grill-lighter")!, "e3"),
    ],
  },
  {
    ...categoryDefinitions.pizzaNight,
    items: [
      createCartItem(findCatalogProduct("pizza-dough")!, "p1"),
      createCartItem(findCatalogProduct("tomato-passata")!, "p2"),
      createCartItem(findCatalogProduct("mozzarella")!, "p3"),
      createCartItem(findCatalogProduct("brown-mushrooms")!, "p4"),
      createCartItem(findCatalogProduct("salami-milano")!, "p5"),
      createCartItem(findCatalogProduct("black-olives")!, "p6"),
      createCartItem(findCatalogProduct("fresh-basil")!, "p7"),
    ],
  },
  {
    ...categoryDefinitions.burgerNight,
    items: [
      createCartItem(findCatalogProduct("brioche-buns")!, "b1"),
      createCartItem(findCatalogProduct("beef-patties")!, "b2"),
      createCartItem(findCatalogProduct("cheddar-slices")!, "b3"),
      createCartItem(findCatalogProduct("burger-sauce")!, "b4"),
      createCartItem(findCatalogProduct("oven-fries")!, "b5"),
    ],
  },
];

export const applyAdjustment = (categories: CartCategory[], adjustmentType: string): CartCategory[] => {
  const newCategories = cloneCategories(categories);

  if (adjustmentType === "duplicate") {
    return newCategories
      .map((category) => ({
        ...category,
        items: category.items.filter((item) => item.id !== "e1" && item.id !== "p1"),
      }))
      .filter((category) => category.items.length > 0);
  }

  if (adjustmentType === "min-order") {
    const householdCategory = newCategories.find((category) => category.id === "household");
    if (householdCategory) {
      householdCategory.items.push(
        createCartItem(findCatalogProduct("toilet-paper-8-rolls")!, "mo1"),
        createCartItem(findCatalogProduct("dish-soap")!, "mo2")
      );
    } else {
      newCategories.push({
        ...categoryDefinitions.household,
        items: [
          createCartItem(findCatalogProduct("toilet-paper-8-rolls")!, "mo1"),
          createCartItem(findCatalogProduct("dish-soap")!, "mo2"),
        ],
      });
    }
    return newCategories;
  }

  if (adjustmentType === "add-hamburger") {
    newCategories.push({
      ...categoryDefinitions.classicHamburger,
      items: [
        createCartItem(findCatalogProduct("brioche-buns")!, "h1"),
        createCartItem(findCatalogProduct("beef-patties")!, "h2"),
        createCartItem(findCatalogProduct("cheddar-slices")!, "h3"),
        createCartItem(findCatalogProduct("burger-sauce")!, "h4"),
        createCartItem(findCatalogProduct("oven-fries")!, "h5"),
      ],
    });
    return newCategories;
  }

  return newCategories.map((category) => ({
    ...category,
    items: category.items.map((item) => {
      const cleanName = item.name.replace(/^(Vegan |Generic |Premium |Local Eco )+/g, "");
      const previousPrice = item.originalPrice ?? item.price;

      switch (adjustmentType) {
        case "vegan":
          if (!item.isVegan) {
            return {
              ...item,
              name: `Vegan ${cleanName}`,
              price: Number((item.price * 1.15).toFixed(2)),
              originalPrice: previousPrice,
              promoLabel: "Vegan swap",
              isVegan: true,
            };
          }
          return item;
        case "money-saver":
          return {
            ...item,
            name: `Generic ${cleanName}`,
            price: Number((item.price * 0.85).toFixed(2)),
            originalPrice: previousPrice,
            promoLabel: "Smart price",
            isGeneric: true,
          };
        case "eco":
          return {
            ...item,
            name: `Local Eco ${cleanName}`,
            price: Number((item.price * 1.08).toFixed(2)),
            originalPrice: previousPrice,
            promoLabel: "Eco swap",
            isEco: true,
          };
        case "chef":
          return {
            ...item,
            name: `Premium ${cleanName}`,
            price: Number((item.price * 1.2).toFixed(2)),
            originalPrice: previousPrice,
            promoLabel: "Chef's choice",
            isPremium: true,
          };
        default:
          return item;
      }
    }),
  }));
};
