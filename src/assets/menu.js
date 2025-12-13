/* 
Item:
{
name: '',
price: #,
modifiers: [...(Optional priceCheck function)]
}

Modifier:
{
name: '',
price: #,
}

Category:
{
type: 'category',
name: '',
items: [...]
}

*/
const chocolate = '#734300';
const coffee = '#592f03';
const strawberry = '#FF3642';
const cone = '#ffed7a';
const pink = '#ff80b3';
const water = '#8ce4ff';
const coke = '#3D1400';
const cream = '#FFFDE8';
const ninetynine = chocolate;
const special = water;
const special99 = pink;
const honeycomb = '#F7B500';

const flake = {
  name: 'Flake',
  price: 0.5,
};
const toppings = {
  name: 'Toppings',
  price: 0.5,
};
const waffleCone = {
  name: 'Waffle Cone',
  price: 1.5,
};
const crushFlake = {
  name: 'Crush Flake',
  price: 2,
};
const chocDip = { name: 'Choc Dip', price: 0.8 };
const strawberries = {
  name: 'Strawberries',
  price: 0.5,
};

export const menu = [
  {
    name: 'Cone',
    price: 3,
    icon: require('../assets/menuicons/ice-cream-cone.png'),
    colour: cone,
    shortcuts: [
      {
        name: 'Plain Cone',
        price: 3,
        addons: [],
        colour: cream,
      },
      {
        name: '99',
        price: 3.5,
        colour: ninetynine,
        addons: [flake],
      },
      {
        name: 'Special Cone',
        price: 3.5,
        colour: special,
        addons: [toppings],
      },
      {
        name: 'Special 99',
        price: 4,
        colour: special99,
        addons: [flake, toppings],
      },
    ],
    modifiers: [
      flake,
      toppings,
      waffleCone,
      crushFlake,
      chocDip,
      {
        priceCheck: function (addons) {
          let price = 0;
          let item = [];

          for (const addon of addons) {
            if (addon.selected === true) {
              item.push(addon.name);
              price += addon.price;
            }
          }

          if (item.includes('Choc Dip') && item.includes('Flake')) {
            price += 0.7;
          }

          return price;
        },
      },
    ],
  },
  {
    name: "Kid's Cone",
    price: 2.8,
    icon: require('../assets/menuicons/ice-cream-cone.png'),
    colour: cone,
    shortcuts: [
      {
        name: "Kid's Cone",
        price: 2.8,
        colour: cream,
        addons: [],
      },
      {
        name: "Kid's 99",
        price: 3,
        colour: ninetynine,
        addons: [flake],
      },
      {
        name: "Kid's Special",
        price: 3.3,
        colour: special,
        addons: [toppings],
      },
      {
        name: "Kid's Special 99",
        price: 3.5,
        colour: special99,
        addons: [flake, toppings],
      },
    ],
    modifiers: [
      flake,
      toppings,
      crushFlake,
      chocDip,
      {
        priceCheck: function (addons) {
          // Add code to check for chocolate dip, both choco dip with and without flake are 3.5
          let price = 0;
          let item = [];
          for (const addon of addons) {
            if (addon.selected == true) {
              item.push(addon.name);
              price += addon.price;
            }
          }

          if (item.includes('Flake')) price -= 0.3;
          if (item.includes('Crush Flake')) price -= 0.3;
          if (item.includes('Crush Flake') && item.includes('Flake'))
            price -= 0.2;

          if (item.includes('Choc Dip')) price -= 0.1;
          if (item.includes('Choc Dip') && item.includes('Flake')) price += 0.8;
          return price;
        },
      },
    ],
  },
  {
    name: 'Extras',
    type: 'category',
    icon: require('../assets/menuicons/extras.png'),

    items: [
      flake,
      {
        name: 'Family Special',
        price: 12,
      },
      {
        name: 'Empty Cone',
        price: 0.3,
        colour: cone,
      },
      waffleCone,
      toppings,
      crushFlake,
      { name: 'Ferrero', price: 2, colour: chocolate },
      { name: 'Strawberries', price: 2, colour: strawberry },
      chocDip,
    ],
  },
  {
    name: 'Pink Tub',
    price: 3,
    icon: require('../assets/menuicons/ice-cream-tub.png'),
    colour: pink,
    modifiers: [flake, toppings, crushFlake],
    shortcuts: [
      {
        name: 'Plain Pink Tub',
        price: 3,
        colour: cream,
        addons: [],
      },
      {
        name: '99 Pink Tub',
        price: 3.5,
        colour: ninetynine,
        addons: [flake],
      },
      {
        name: 'Special Pink Tub',
        price: 3.5,
        colour: special,
        addons: [toppings],
      },
      {
        name: 'Special 99 Pink Tub',
        price: 4,
        colour: special99,
        addons: [flake, toppings],
      },
    ],
  },
  {
    name: "Kid's Tub",
    price: 2.8,
    icon: require('../assets/menuicons/ice-cream-tub.png'),
    colour: pink,
    shortcuts: [
      {
        name: "Kid's Tub",
        price: 2.8,
        colour: cream,
        addons: [],
      },
      {
        name: "Kid's 99 Tub",
        price: 3,
        colour: ninetynine,
        addons: [flake],
      },
      {
        name: "Kid's Special Tub",
        price: 3.3,
        colour: special,
        addons: [toppings],
      },
      {
        name: "Kid's Special 99 Tub",
        price: 3.5,
        colour: special99,
        addons: [flake, toppings],
      },
    ],
    modifiers: [
      flake,
      toppings,
      crushFlake,
      {
        priceCheck: function (addons) {
          let price = 0;
          let item = [];
          for (const addon of addons) {
            if (addon.selected == true) {
              item.push(addon.name);
              price += addon.price;
            }
          }

          if (item.includes('Flake')) price -= 0.3;
          if (item.includes('Crush Flake')) price -= 0.3;
          if (item.includes('Crush Flake') && item.includes('Flake'))
            price -= 0.2;

          return price;
        },
      },
    ],
  },
  {
    type: 'category',
    name: 'Tubs',
    icon: require('../assets/menuicons/ice-cream-cup.png'),
    colour: '#ff954a',
    items: [
      {
        name: 'Sundae',
        price: 4.5,
        colour: '#BDFF4A',
        modifiers: [flake, toppings, crushFlake],
        shortcuts: [
          {
            name: 'Plain Sundae',
            price: 4.5,
            colour: cream,
            addons: [],
          },
          {
            name: '99 Sundae',
            price: 5,
            colour: ninetynine,
            addons: [flake],
          },
          {
            name: 'Special Sundae',
            price: 5,
            colour: special,
            addons: [toppings],
          },
          {
            name: 'Special 99 Sundae',
            price: 5.5,
            colour: special99,
            addons: [flake, toppings],
          },
        ],
      },
      {
        name: 'Orange Tub',
        price: 4.5,
        colour: '#ff954a',
        modifiers: [flake, toppings, crushFlake],
        shortcuts: [
          {
            name: 'Plain Large Tub',
            price: 4.5,
            colour: cream,
            addons: [],
          },
          {
            name: '99 Large Tub',
            price: 5,
            colour: ninetynine,
            addons: [flake],
          },
          {
            name: 'Special Large Tub',
            price: 5,
            colour: special,
            addons: [toppings],
          },
          {
            name: 'Special 99 Large Tub',
            price: 5.5,
            colour: special99,
            addons: [flake, toppings],
          },
        ],
      },
      {
        name: 'Boat (w/ Flake)',
        price: 4.5,
        modifiers: [toppings],
        colour: '#00E6E6',
        shortcuts: [
          {
            name: 'Boat (w/ Flake)',
            price: 4.5,
            colour: ninetynine,
            addons: [],
          },
          {
            name: 'Special Boat (w/ Flake)',
            price: 5,
            colour: special99,
            addons: [toppings],
          },
        ],
      },
      {
        name: 'Hot Ferrero',
        price: 6.5,
        colour: chocolate,
        modifiers: [flake, strawberries],
        shortcuts: [
          {
            name: 'Hot Ferrero',
            price: 6.5,
            colour: cream,
            addons: [],
          },
          {
            name: '99 Hot Ferrero',
            price: 7,
            colour: ninetynine,
            addons: [flake],
          },
          {
            name: 'Hot Ferrero & Strawberries',
            price: 7,
            colour: strawberry,
            addons: [strawberries],
          },
        ],
      },
      {
        name: 'Treat Tub',
        price: 6.5,
        colour: cone,
        modifiers: [
          flake,
          {
            name: 'Honeycomb Heaven',
            price: 0,
          },
          {
            name: 'Rocky Road Mess',
            price: 0,
          },
          {
            name: 'Chocolate Brownie Bliss',
            price: 0,
          },
        ],
        shortcuts: [
          {
            name: 'Honeycomb Heaven',
            price: 6.5,
            colour: '#F7B500',
            addons: [
              {
                name: 'Honeycomb Heaven',
                price: 0,
              },
            ],
          },
          {
            name: 'Rocky Road Mess',
            price: 6.5,
            colour: '#D6B083',
            addons: [
              {
                name: 'Rocky Road Mess',
                price: 0,
              },
            ],
          },
          {
            name: 'Chocolate Brownie Bliss',
            price: 6.5,
            colour: ninetynine,
            addons: [
              {
                name: 'Chocolate Brownie Bliss',
                price: 0,
              },
            ],
          },
        ],
      },
      {
        name: 'Screwball',
        price: 4,
        colour: '#FFA600',
        modifiers: [flake, toppings, crushFlake],
        shortcuts: [
          {
            name: 'Plain Screwball',
            price: 4,
            colour: cream,
            addons: [],
          },
          {
            name: '99 Screwball',
            price: 4.5,
            colour: ninetynine,
            addons: [flake],
          },
          {
            name: 'Special Screwball',
            price: 4.5,
            colour: special,
            addons: [toppings],
          },
          {
            name: 'Special 99 Screwball',
            price: 5,
            colour: special99,
            addons: [flake, toppings],
          },
        ],
      },
      {
        name: 'Strawberries & Ice Cream',
        price: 6.5,
        colour: strawberry,
        modifiers: [flake],
        shortcuts: [
          {
            name: 'Strawberries & Ice Cream',
            price: 6.5,
            colour: strawberry,
            addons: [],
          },
          {
            name: '99 Strawberries & Ice Cream',
            price: 7,
            colour: ninetynine,
            addons: [flake],
          },
        ],
      },
      {
        name: 'Kinder Bueno & Ice Cream',
        colour: chocolate,
        price: 6.5,
      },
      {
        name: 'Affogato',
        price: 5.5,
        colour: coffee,
      },
      {
        name: 'Float',
        price: 5,
        colour: coke,
      },
      {
        name: "Ice Cream Nachos",
        price: 8.5,
        colour: special
      }
    ],
  },
  {
    name: 'Ice Pop',
    price: 4,
    colour: strawberry,
  },
  {
    type: 'category',
    name: 'Cold Drinks',
    icon: require('../assets/menuicons/soft-drink.png'),
    colour: water,
    items: [
      {
        name: 'Ribena',
        price: 2,
        colour: '#750073',
      },
      {
        name: 'Capri-Sun',
        price: 2,
        colour: '#FF9900',
      },
      {
        name: 'Cans',
        price: 2,
        colour: coke,
      },
      {
        name: 'Soft Bottles',
        price: 2.8,
        colour: coke,
      },
      {
        name: 'Water',
        price: 2,
        colour: water,
      },
      {
        name: 'Monster',
        price: 2.8,
        colour: '#678C00',
      },
      {
        name: 'Small Slush',
        price: 2.5,
        colour: '#FF2E35',
      },
      {
        name: 'Large Slush',
        price: 3.5,
        colour: '#3675FF',
      },
    ],
  },

  {
    name: 'Hot Drinks',
    type: 'category',
    icon: require('../assets/menuicons/coffee-cup.png'),
    colour: coffee,
    items: [
      {
        name: 'Tea',
        price: 2.5,
        colour: '#F0B771',
      },
      {
        name: 'Hot Chocolate',
        price: 3.5,
        colour: chocolate,
        modifiers: [
          {
            name: 'Marshmallows',
            price: 0.5,
          },
        ],
        shortcuts: [
          {
            name: 'Hot Chocolate',
            price: 3.5,
            colour: ninetynine,
            addons: [],
          },
          {
            name: 'Hot Chocolate w/ Marshmallows',
            price: 4,
            colour: cream,
            addons: [
              {
                name: 'Marshmallows',
                price: 0.5,
              },
            ],
          },
        ],
      },
      {
        name: 'Americano',
        price: 3.8,
        colour: coffee,
      },
      {
        name: 'Latte',
        price: 3.8,
        colour: '#F0B771',
      },
      {
        name: 'Cappuccino',
        price: 3.8,
        colour: '#F0B771',
      },
      {
        name: 'Double Espresso',
        price: 3,
        colour: coffee,
      },
    ],
  },

  {
    name: 'Sweets',
    type: 'category',
    icon: require('../assets/menuicons/candy.png'),
    colour: '#FFB3CB',
    items: [
      {
        name: 'Quarter of Sweets',
        price: 3,
      },
      {
        name: 'Stick of Rock, Honeycomb',
        price: 2.5,
      },
      {
        name: 'Refresher, Wham, Dip Dab',
        price: 0.8,
      },
      {
        name: 'Golf Balls, Jawbreaker',
        price: 1.2,
      },
      {
        name: 'Chewits',
        price: 1.3,
      },
      {
        name: '2 Euro Bag',
        price: 2,
      },
      {
        name: 'Dynasticks',
        price: 0.15,
      },
      {
        name: 'Liquorice',
        price: 0.25,
      },
      {
        name: 'Standard Chocolate Bar',
        price: 1.8,
        colour: chocolate,
      },
      {
        name: 'Purple Snack',
        price: 1.5,
        colour: '#b33d90',
      },
    ],
  },
  {
    name: 'Crisps, Popcorn & Candyfloss',
    type: 'category',
    icon: require('../assets/menuicons/snack.png'),
    colour: '#f5ad42',
    items: [
      {
        name: 'Tayto',
        price: 1.6,
        colour: '#78c8f0',
      },
      {
        name: 'Hula Hoops, Snax',
        price: 1.5,
        colour: '#ea3926',
      },

      {
        name: 'Popcorn Cone',
        price: 2.5,
        colour: '#feda8d',
      },
      {
        name: 'Flavoured Popcorn Bag',
        price: 3.5,
        colour: honeycomb,
      },
      {
        name: 'Candyfloss Bag or Stick',
        price: 2.5,
        colour: '#f5b3d6',
      },
      {
        name: 'Candyfloss Tub',
        price: 3.5,
        colour: '#f5b3d6',
      },
    ],
  },
  {
    name: 'Toys',
    type: 'category',
    icon: require('../assets/menuicons/toys.png'),
    colour: '#78be17',
    items: [
      {
        name: 'Small Spade & Bucket',
        price: 3.5,
      },
      {
        name: 'Medium Spade & Bucket',
        price: 4.5,
      },
      {
        name: 'Ice Cream Bucket',
        price: 6.5,
      },
      {
        name: 'Penguin Bucket',
        price: 6.5,
      },
      {
        name: 'Large Spade & Unicorn Bucket',
        price: 7,
      },
      {
        name: 'Small Rainbow Ball',
        price: 5,
      },
      {
        name: 'Large Rainbow Ball',
        price: 7,
      },
      {
        name: 'Pump Blaster',
        price: 3.5,
      },
    ],
  },
];
