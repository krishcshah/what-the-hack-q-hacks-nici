import { CartCategory } from './types';

export const generateMockCart = (): CartCategory[] => {
  return [
    {
      id: 'essentials',
      title: 'Essentials',
      color: 'bg-blue-50 border-blue-200 text-blue-900',
      items: [
        { id: 'e1', name: 'Organic Milk 1L', price: 1.49, image: 'https://picsum.photos/seed/milk/100/100' },
        { id: 'e2', name: 'Free-range Eggs (10)', price: 3.29, image: 'https://picsum.photos/seed/eggs/100/100' },
        { id: 'e3', name: 'Whole Wheat Bread', price: 2.19, image: 'https://picsum.photos/seed/bread/100/100' },
        { id: 'e4', name: 'Gouda Cheese', price: 4.50, image: 'https://picsum.photos/seed/cheese/100/100' },
      ]
    },
    {
      id: 'recipe1',
      title: 'Recipe: Homemade Pizza',
      color: 'bg-red-50 border-red-200 text-red-900',
      items: [
        { id: 'p1', name: 'Pizza Dough', price: 1.99, image: 'https://picsum.photos/seed/dough/100/100' },
        { id: 'p2', name: 'Mozzarella', price: 1.89, image: 'https://picsum.photos/seed/mozzarella/100/100' },
        { id: 'p3', name: 'Tomato Sauce', price: 1.20, image: 'https://picsum.photos/seed/sauce/100/100' },
        { id: 'p4', name: 'Jalapeños', price: 0.99, image: 'https://picsum.photos/seed/jalapeno/100/100' },
        { id: 'p5', name: 'Black Olives', price: 1.50, image: 'https://picsum.photos/seed/olives/100/100' },
      ]
    },
    {
      id: 'recipe2',
      title: 'Recipe: Doner Falafel',
      color: 'bg-green-50 border-green-200 text-green-900',
      items: [
        { id: 'f1', name: 'Falafel Balls', price: 2.99, image: 'https://picsum.photos/seed/falafel/100/100', isVegan: true },
        { id: 'f2', name: 'Pita Bread', price: 1.49, image: 'https://picsum.photos/seed/pita/100/100', isVegan: true },
        { id: 'f3', name: 'Garlic Sauce', price: 1.79, image: 'https://picsum.photos/seed/garlicsauce/100/100' },
        { id: 'f4', name: 'Iceberg Lettuce', price: 0.89, image: 'https://picsum.photos/seed/lettuce/100/100', isVegan: true },
      ]
    },
    {
      id: 'snacks',
      title: 'Snacks & Miscellaneous',
      color: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      items: [
        { id: 's1', name: 'Potato Chips', price: 1.59, image: 'https://picsum.photos/seed/chips/100/100' },
        { id: 's2', name: 'Sparkling Water', price: 0.99, image: 'https://picsum.photos/seed/water/100/100' },
      ]
    }
  ];
};

export const applyAdjustment = (categories: CartCategory[], adjustmentType: string): CartCategory[] => {
  // Deep copy to avoid mutating original state
  let newCategories = JSON.parse(JSON.stringify(categories)) as CartCategory[];

  if (adjustmentType === 'duplicate') {
    // Remove Organic Milk (e1) and Free-range Eggs (e2)
    return newCategories.map(cat => ({
      ...cat,
      items: cat.items.filter(item => item.id !== 'e1' && item.id !== 'e2')
    })).filter(cat => cat.items.length > 0);
  }

  if (adjustmentType === 'min-order') {
    // Add miscellaneous items to snacks
    const snacksCat = newCategories.find(c => c.id === 'snacks');
    if (snacksCat) {
      snacksCat.items.push(
        { id: 'mo1', name: 'Toilet Paper (8 rolls)', price: 4.99, image: 'https://picsum.photos/seed/tp/100/100' },
        { id: 'mo2', name: 'Dish Soap', price: 2.49, image: 'https://picsum.photos/seed/soap/100/100' }
      );
    } else {
      newCategories.push({
        id: 'snacks',
        title: 'Snacks & Miscellaneous',
        color: 'bg-yellow-50 border-yellow-200 text-yellow-900',
        items: [
          { id: 'mo1', name: 'Toilet Paper (8 rolls)', price: 4.99, image: 'https://picsum.photos/seed/tp/100/100' },
          { id: 'mo2', name: 'Dish Soap', price: 2.49, image: 'https://picsum.photos/seed/soap/100/100' }
        ]
      });
    }
    return newCategories;
  }

  if (adjustmentType === 'add-hamburger') {
    // Add a hamburger recipe
    newCategories.push({
      id: 'recipe3',
      title: 'Recipe: Classic Hamburger',
      color: 'bg-orange-50 border-orange-200 text-orange-900',
      items: [
        { id: 'h1', name: 'Burger Buns', price: 1.99, image: 'https://picsum.photos/seed/buns/100/100' },
        { id: 'h2', name: 'Ground Beef 500g', price: 5.99, image: 'https://picsum.photos/seed/beef/100/100' },
        { id: 'h3', name: 'Cheddar Slices', price: 2.49, image: 'https://picsum.photos/seed/cheddar/100/100' },
        { id: 'h4', name: 'Tomato', price: 0.89, image: 'https://picsum.photos/seed/tomato/100/100' },
        { id: 'h5', name: 'Lettuce', price: 0.99, image: 'https://picsum.photos/seed/lettuce2/100/100' },
      ]
    });
    return newCategories;
  }

  return newCategories.map(category => {
    category.items = category.items.map(item => {
      // Clean previous prefixes to avoid long concatenated names
      let baseName = item.name.replace(/^(Vegan |Generic |Premium |Local Eco )+/g, '').replace(/Organic |Free-range /g, '');

      switch (adjustmentType) {
        case 'vegan':
          if (!item.isVegan) {
            return {
              ...item,
              name: `Vegan ${baseName}`,
              price: item.price * 1.2, // Vegan tax
              image: `https://picsum.photos/seed/vegan${item.id}/100/100`,
              isVegan: true
            };
          }
          break;
        case 'money-saver':
          return {
            ...item,
            name: `Generic ${baseName}`,
            price: item.price * 0.7,
            image: `https://picsum.photos/seed/generic${item.id}/100/100`,
          };
        case 'eco':
          return {
            ...item,
            name: `Local Eco ${baseName}`,
            price: item.price * 1.1,
            image: `https://picsum.photos/seed/eco${item.id}/100/100`,
          };
        case 'chef':
          return {
            ...item,
            name: `Premium ${baseName}`,
            price: item.price * 1.5,
            image: `https://picsum.photos/seed/premium${item.id}/100/100`,
          };
      }
      return item;
    });
    return category;
  });
};
