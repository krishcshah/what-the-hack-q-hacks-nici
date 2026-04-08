import { CartCategory } from './types';

const IMAGES = {
  milk: {
    generic: 'https://img.rewe-static.de/3070776/26121034_digital-image.png?imwidth=840&impolicy=pdp',
    eco: 'https://img.rewe-static.de/3070776/26121034_digital-image.png?imwidth=840&impolicy=pdp',
    vegan: 'https://img.rewe-static.de/2587736/24675765_digital-image.png?imwidth=840&impolicy=pdp',
    chef: 'https://img.rewe-static.de/8442791/31184238_digital-image.png'
  },
  eggs: {
    generic: 'https://img.rewe-static.de/8470640/31525372_digital-image.png?imwidth=840&impolicy=pdp',
    eco: 'https://backend-nachhaltigkeit.rewe.de/resized/Tierwohl/Legehennen/progress_gro%CC%88%C3%9Fer_1.png/q_75-m_contain-w_640-h_640.webp',
    chef: 'https://img.rewe-static.de/7893046/34504562_digital-image.png?imwidth=840&impolicy=pdp'
  },
  bread: {
    generic: 'https://img.rewe-static.de/8362956/30761907_digital-image.png?imwidth=1680&impolicy=pdp',
    vegan: 'https://img.rewe-static.de/0199017/1632190_digital-image.png?imwidth=840&impolicy=pdp',
    eco: 'https://img.rewe-static.de/9546295/51789367_digital-image.png?imwidth=840&impolicy=pdp',
    chef: 'https://img.rewe-static.de/1095038/22428559_digital-image.png?imwidth=840&impolicy=pdp'
  },
  cheese: {
    generic: 'https://img.rewe-static.de/6337279/3559990_digital-image.png?imwidth=840&impolicy=pdp',
    eco: 'https://img.rewe-static.de/6337279/3559990_digital-image.png?imwidth=840&impolicy=pdp',
    vegan: 'https://res.cloudinary.com/goflink/image/upload/b_rgb:F8F8F8/f_png/w_456,ar_1:1,c_fill,g_south/product-images-prod/adc26855-0b8f-4565-8468-4aa39e98e285.png',
    chef: 'https://img.rewe-static.de/9026210/40362103_digital-image.png?imwidth=840&impolicy=pdp'
  },
  pizzaDough: {
    generic: 'https://img.rewe-static.de/8623800/33549325_digital-image.png?imwidth=840&impolicy=pdp',
    vegan: 'https://img.rewe-static.de/7669169/40979437_digital-image.png',
    eco: 'https://img.rewe-static.de/0324607/23128166_digital-image.png?imwidth=1680&impolicy=pdp',
    chef: 'https://img.rewe-static.de/9832952/49880360_digital-image.png?imwidth=840&impolicy=pdp'
  },
  mozzarella: {
    generic: 'https://img.rewe-static.de/8698189/35607163_digital-image.png?imwidth=840&impolicy=pdp',
    vegan: 'https://img.rewe-static.de/0200385/7299280_digital-image.png?imwidth=840&impolicy=pdp',
    eco: 'https://img.rewe-static.de/8434947/31917443_digital-image.png?imwidth=840&impolicy=pdp',
    chef: 'https://img.rewe-static.de/8831096/37380063_digital-image.png?imwidth=840&impolicy=pdp'
  },
  tomatoSauce: {
    generic: 'https://img.rewe-static.de/0128314/23136520_digital-image.png?imwidth=1680&impolicy=pdp',
    vegan: 'https://img.rewe-static.de/8907732/39124563_digital-image.png?imwidth=1680&impolicy=pdp',
    eco: 'https://img.rewe-static.de/8680956/36457729_digital-image.png?imwidth=1680&impolicy=pdp',
    chef: 'https://img.rewe-static.de/3280994/26762493_digital-image.png?imwidth=840&impolicy=pdp'
  },
  jalapenos: {
    generic: 'https://img.rewe-static.de/2286314/23565652_digital-image.png?imwidth=840&impolicy=pdp',
    vegan: 'https://img.rewe-static.de/1429544/26842610_digital-image.png?imwidth=304&impolicy=kues',
    eco: 'https://img.rewe-static.de/8578208/36219623_digital-image.png?imwidth=1680&impolicy=pdp',
    chef: 'https://img.rewe-static.de/4729404/20384419_digital-image.png?imwidth=840&impolicy=pdp'
  },
  olives: {
    generic: 'https://img.rewe-static.de/1186905/14283310_digital-image.png?imwidth=1680&impolicy=pdp',
    vegan: 'https://img.rewe-static.de/1191580/21997858_digital-image.png?imwidth=304&impolicy=kues',
    eco: 'https://img.rewe-static.de/8075105/29725141_digital-image.png?imwidth=1680&impolicy=pdp',
    chef: 'https://images.openfoodfacts.org/images/products/433/725/667/0685/front_de.3.full.jpg'
  },
  falafel: {
    generic: 'https://img.rewe-static.de/8324188/53619173_digital-image.png?imwidth=1680&impolicy=pdp',
    vegan: 'https://fddb.info/static/db/400/220/AZMD2V8863NHZJRY4N2L7TFU_999x999.jpg',
    eco: 'https://img.rewe-static.de/7250357/28506455_digital-image.png?imwidth=1680&impolicy=pdp',
    chef: 'https://veggie-einhorn.de/wp-content/uploads/falafel-rewe.jpg'
  },
  pita: {
    generic: 'https://img.rewe-static.de/8435547/31442329_digital-image.png',
    vegan: 'https://img.rewe-static.de/8435547/31442329_digital-image.png?imwidth=840&impolicy=pdp',
    eco: 'https://images.openfoodfacts.org/images/products/433/725/685/2616/front_de.9.400.jpg',
    chef: 'https://img.rewe-static.de/7092910/27823685_digital-image.png?imwidth=840&impolicy=pdp'
  },
  garlicSauce: {
    generic: 'https://img.rewe-static.de/8403028/31068137_digital-image.png?imwidth=840&impolicy=pdp',
    vegan: 'https://img.rewe-static.de/7690423/41302639_digital-image.png',
    eco: 'https://img.rewe-static.de/4840917/8486260_digital-image.png?imwidth=840&impolicy=pdp',
    chef: 'https://img.rewe-static.de/7292684/27951189_digital-image.png'
  },
  lettuce: {
    generic: 'https://img.freepik.com/free-photo/green-cabbage-head-lettuce-iceberg_1203-5854.jpg?semt=ais_incoming&w=740&q=80',
    vegan: 'https://img.freepik.com/free-photo/green-cabbage-head-lettuce-iceberg_1203-5854.jpg?semt=ais_incoming&w=740&q=80',
    eco: 'https://img.freepik.com/free-photo/green-cabbage-head-lettuce-iceberg_1203-5854.jpg?semt=ais_incoming&w=740&q=80',
    chef: 'https://img.freepik.com/free-photo/green-cabbage-head-lettuce-iceberg_1203-5854.jpg?semt=ais_incoming&w=740&q=80'
  },
  chips: {
    generic: 'https://img.rewe-static.de/6953115/24324363_digital-image.png?imwidth=1680&impolicy=pdp',
    vegan: 'https://img.hit.de/sortiment/4337/2566/2226/4337256622264_39850955_1024px.webp',
    eco: 'https://img.rewe-static.de/8733873/36260880_digital-image.png?imwidth=840&impolicy=pdp',
    chef: 'https://img.rewe-static.de/8537154/47788349_digital-image.png?imwidth=840&impolicy=pdp'
  },
  water: {
    generic: 'https://img.rewe-static.de/0518174/7107150_digital-image.png?imwidth=840&impolicy=pdp',
    vegan: 'https://img.rewe-static.de/0518174/7107150_digital-image.png?imwidth=840&impolicy=pdp',
    eco: 'https://img.rewe-static.de/0518174/7107150_digital-image.png?imwidth=840&impolicy=pdp',
    chef: 'https://img.rewe-static.de/0518174/7107150_digital-image.png?imwidth=840&impolicy=pdp'
  },
  buns: {
    generic: 'https://img.rewe-static.de/7239828/27949187_digital-image.png?imwidth=840&impolicy=pdp',
    vegan: 'https://produkttester-plattform-prod.s3.amazonaws.com/media/public/campaign_images/140b831efed04729be504205e2805198.png',
    eco: 'https://img.rewe-static.de/7937367/32850158_digital-image.png?imwidth=840&impolicy=pdp',
    chef: 'https://img.rewe-static.de/7219821/32510789_digital-image.png'
  },
  beef: {
    generic: 'https://img.rewe-static.de/7938024/33031415_digital-image.png?imwidth=304&impolicy=kues',
    vegan: 'https://images.openfoodfacts.org/images/products/402/178/237/1566/front_en.31.full.jpg',
    eco: 'https://img.rewe-static.de/2013482/27474283_digital-image.png?imwidth=840&impolicy=pdp',
    chef: 'https://img.rewe-static.de/9839745/49996906_digital-image.png?imwidth=840&impolicy=pdp'
  },
  cheddar: {
    generic: 'https://img.rewe-static.de/8538322/32850592_digital-image.png?imwidth=1680&impolicy=pdp',
    vegan: 'https://veggie-einhorn.de/wp-content/uploads/veganer-scheibenkaese-rewe.jpg',
    eco: 'https://img.rewe-static.de/8926272/39922955_digital-image.png?imwidth=1680&impolicy=pdp',
    chef: 'https://img.rewe-static.de/7033129/26700267_digital-image.png?imwidth=1680&impolicy=pdp'
  },
  tomato: {
    generic: 'https://images.openfoodfacts.org/images/products/438/884/417/4467/front_de.4.full.jpg',
    vegan: 'https://images.openfoodfacts.org/images/products/438/884/417/4467/front_de.4.full.jpg',
    eco: 'https://images.openfoodfacts.org/images/products/438/884/417/4467/front_de.4.full.jpg',
    chef: 'https://images.openfoodfacts.org/images/products/438/884/417/4467/front_de.4.full.jpg'
  }
};

export const generateMockCart = (): CartCategory[] => {
  return [
    {
      id: 'essentials',
      title: 'Essentials',
      color: 'bg-blue-50 border-blue-200 text-blue-900',
      items: [
        { id: 'e1', name: 'Milk 1L', price: 1.49, image: IMAGES.milk.generic },
        { id: 'e2', name: 'Eggs (10)', price: 3.29, image: IMAGES.eggs.generic },
        { id: 'e3', name: 'Bread', price: 2.19, image: IMAGES.bread.generic },
        { id: 'e4', name: 'Cheese', price: 4.50, image: IMAGES.cheese.generic },
      ]
    },
    {
      id: 'recipe1',
      title: 'Recipe: Homemade Pizza',
      color: 'bg-red-50 border-red-200 text-red-900',
      items: [
        { id: 'p1', name: 'Pizza Dough', price: 1.99, image: IMAGES.pizzaDough.generic },
        { id: 'p2', name: 'Mozzarella', price: 1.89, image: IMAGES.mozzarella.generic },
        { id: 'p3', name: 'Tomato Sauce', price: 1.20, image: IMAGES.tomatoSauce.generic, isVegan: true },
        { id: 'p4', name: 'Jalapeños', price: 0.99, image: IMAGES.jalapenos.generic, isVegan: true },
        { id: 'p5', name: 'Black Olives', price: 1.50, image: IMAGES.olives.generic, isVegan: true },
      ]
    },
    {
      id: 'recipe2',
      title: 'Recipe: Doner Falafel',
      color: 'bg-green-50 border-green-200 text-green-900',
      items: [
        { id: 'f1', name: 'Falafel Balls', price: 2.99, image: IMAGES.falafel.generic, isVegan: true },
        { id: 'f2', name: 'Pita Bread', price: 1.49, image: IMAGES.pita.generic, isVegan: true },
        { id: 'f3', name: 'Garlic Sauce', price: 1.79, image: IMAGES.garlicSauce.generic },
        { id: 'f4', name: 'Iceberg Lettuce', price: 0.89, image: IMAGES.lettuce.generic, isVegan: true },
      ]
    },
    {
      id: 'snacks',
      title: 'Snacks & Miscellaneous',
      color: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      items: [
        { id: 's1', name: 'Potato Chips', price: 1.59, image: IMAGES.chips.generic, isVegan: true },
        { id: 's2', name: 'Sparkling Water', price: 0.99, image: IMAGES.water.generic, isVegan: true },
      ]
    }
  ];
};

export const applyAdjustment = (categories: CartCategory[], adjustmentType: string): CartCategory[] => {
  // Deep copy to avoid mutating original state
  let newCategories = JSON.parse(JSON.stringify(categories)) as CartCategory[];

  if (adjustmentType === 'duplicate') {
    // Remove Milk (e1) and Eggs (e2)
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
        { id: 'h1', name: 'Burger Buns', price: 1.99, image: IMAGES.buns.generic },
        { id: 'h2', name: 'Ground Beef 500g', price: 5.99, image: IMAGES.beef.generic },
        { id: 'h3', name: 'Cheddar Slices', price: 2.49, image: IMAGES.cheddar.generic },
        { id: 'h4', name: 'Tomato', price: 0.89, image: IMAGES.tomato.generic, isVegan: true },
        { id: 'h5', name: 'Lettuce', price: 0.99, image: IMAGES.lettuce.generic, isVegan: true },
      ]
    });
    return newCategories;
  }

  const getItemKey = (id: string) => {
    if (id === 'e1') return 'milk';
    if (id === 'e2') return 'eggs';
    if (id === 'e3') return 'bread';
    if (id === 'e4') return 'cheese';
    if (id === 'p1') return 'pizzaDough';
    if (id === 'p2') return 'mozzarella';
    if (id === 'p3') return 'tomatoSauce';
    if (id === 'p4') return 'jalapenos';
    if (id === 'p5') return 'olives';
    if (id === 'f1') return 'falafel';
    if (id === 'f2') return 'pita';
    if (id === 'f3') return 'garlicSauce';
    if (id === 'f4') return 'lettuce';
    if (id === 's1') return 'chips';
    if (id === 's2') return 'water';
    if (id === 'h1') return 'buns';
    if (id === 'h2') return 'beef';
    if (id === 'h3') return 'cheddar';
    if (id === 'h4') return 'tomato';
    if (id === 'h5') return 'lettuce';
    return null;
  };

  return newCategories.map(category => {
    category.items = category.items.map(item => {
      let baseName = item.name.replace(/^(Vegan |Generic |Premium |Local Eco )+/g, '').replace(/Organic |Free-range /g, '');
      const key = getItemKey(item.id) as keyof typeof IMAGES;

      switch (adjustmentType) {
        case 'vegan':
          if (item.id === 'e2') {
            // Remove eggs for vegan
            return null;
          }
          if (!item.isVegan) {
            return {
              ...item,
              name: `Vegan ${baseName}`,
              price: item.price * 1.2,
              image: key && (IMAGES[key] as any).vegan ? (IMAGES[key] as any).vegan : item.image,
              isVegan: true
            };
          }
          break;
        case 'money-saver':
          return {
            ...item,
            name: `Generic ${baseName}`,
            price: item.price * 0.7,
            image: key && (IMAGES[key] as any).generic ? (IMAGES[key] as any).generic : item.image,
          };
        case 'eco':
          return {
            ...item,
            name: `Local Eco ${baseName}`,
            price: item.price * 1.1,
            image: key && (IMAGES[key] as any).eco ? (IMAGES[key] as any).eco : item.image,
          };
        case 'chef':
          return {
            ...item,
            name: `Premium ${baseName}`,
            price: item.price * 1.5,
            image: key && (IMAGES[key] as any).chef ? (IMAGES[key] as any).chef : item.image,
          };
      }
      return item;
    }).filter(Boolean) as any;
    return category;
  }).filter(cat => cat.items.length > 0);
};
