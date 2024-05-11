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
const strawberries = '#FF3642';
const cone = '#ffed7a';
const pink = '#ff80b3';
const water = '#8ce4ff';
const coke = '#3D1400';
const cream = '#FFFDE8';
const ninetynine = chocolate;
const special = water;
const special99 = pink;
export const menu = [
  {
    name: 'Cone',
    price: 2.5,
    icon: require('../assets/menuicons/ice-cream-cone.png'),
    colour: cone,
    shortcuts: [
      {
        name: 'Plain Cone',
        price: 2.5,
        addons: [],
        colour: cream,
      },
      {
        name: '99 Cone',
        price: 3,
        colour: ninetynine,
        addons: [
          {
            name: 'Flake',
            price: 0.5,
          },
        ],
      },
      {
        name: 'Special Cone',
        price: 3,
        colour: special,
        addons: [
          {
            name: 'Toppings',
            price: 0.5,
          },
        ],
      },
      {
        name: 'Special 99',
        price: 3.5,
        colour: special99,
        addons: [
          {
            name: 'Flake',
            price: 0.5,
          },
          {
            name: 'Toppings',
            price: 0.5,
          },
        ],
      },
    ],
    modifiers: [
      {
        name: 'Flake',
        price: 0.5,
      },
      {
        name: 'Toppings',
        price: 0.5,
      },
      {
        name: 'Waffle Cone',
        price: 1,
      },
      {
        name: 'Crush Flake',
        price: 1.5,
      },
      { name: 'Choc Dip', price: 1.0 },
      {
        priceCheck: function (addons) {
          let addonsCost = 0;
          let selectedAddons = [];

          for (const addon of addons) {
            if (addon.selected === true) {
              selectedAddons.push(addon.name);
              addonsCost += addon.price;
            }
          }

          if (
            selectedAddons.includes('Choc Dip') &&
            !selectedAddons.includes('Flake')
          ) {
            addonsCost -= 0.2;
          }

          return addonsCost;
        },
      },
    ],
  },
  {
    name: "Kid's Cone",
    price: 2.3,
    icon: require('../assets/menuicons/ice-cream-cone.png'),
    colour: cone,
    shortcuts: [
      {
        name: "Kid's Cone",
        price: 2.3,
        colour: cream,
        addons: [],
      },
      {
        name: "Kid's 99",
        price: 2.5,
        colour: ninetynine,
        addons: [
          {
            name: 'Flake',
            price: 0.2,
          },
        ],
      },
      {
        name: "Kid's Special",
        price: 2.5,
        colour: special,
        addons: [
          {
            name: 'Toppings',
            price: 0.5,
          },
        ],
      },
      {
        name: "Kid's Special 99",
        price: 3,
        colour: special99,
        addons: [
          {
            name: 'Flake',
            price: 0.2,
          },
          {
            name: 'Toppings',
            price: 0.5,
          },
        ],
      },
    ],
    modifiers: [
      {
        name: 'Flake',
        price: 0.2,
      },
      {
        name: 'Toppings',
        price: 0.5,
      },
      { name: 'Crush Flake', price: 1.5 },
      { name: 'Choc Dip', price: 0.7 },
      {
        priceCheck: function (addons) {
          // Add code to check for chocolate dip, both choco dip with and without flake are 3.5
          let addonsCost = 0;
          let selectedAddons = [];

          for (const addon of addons) {
            if (addon.selected == true) {
              selectedAddons.push(addon.name);
              addonsCost += addon.price;
            }
          }

          if (
            selectedAddons.includes('Choc Dip') &&
            selectedAddons.includes('Flake')
          ) {
            addonsCost += 0.3;
          } else if (
            selectedAddons.includes('Toppings') &&
            !selectedAddons.includes('Flake')
          ) {
            addonsCost -= 0.3;
          }

          return addonsCost;
        },
      },
    ],
  },
  {
    name: 'Extras',
    type: 'category',
    icon: require('../assets/menuicons/extras.png'),

    items: [
      {
        name: 'Extra Flake',
        price: 0.5,
        colour: chocolate,
      },
      {
        name: 'Family Special',
        price: 10,
      },
      {
        name: 'Empty Cone',
        price: 0.3,
        colour: cone,
      },
      {
        name: 'Empty Waffle Cone',
        price: 1,
        colour: cone,
      },
      {
        name: 'Extra Toppings',
        price: 0.5,
        colour: '#FFB3CB',
      },
      {
        name: 'Extra Crush Flake',
        price: 1.5,
        colour: chocolate,
      },
      { name: 'Extra Ferrero', price: 1.5, colour: chocolate },
      { name: 'Extra Strawberries', price: 1.5, colour: strawberries },
      { name: 'Extra Chocolate Dip', price: 1.5, colour: chocolate },
    ],
  },
  {
    name: 'Pink Tub',
    price: 2.5,
    icon: require('../assets/menuicons/ice-cream-tub.png'),
    colour: pink,
    modifiers: [
      {
        name: 'Flake',
        price: 0.5,
      },
      {
        name: 'Toppings',
        price: 0.5,
      },
      {
        name: 'Crush Flake',
        price: 1.5,
      },
    ],
    shortcuts: [
      {
        name: 'Plain Pink Tub',
        price: 2.5,
        colour: cream,
        addons: [],
      },
      {
        name: '99 Pink Tub',
        price: 3,
        colour: ninetynine,
        addons: [
          {
            name: 'Flake',
            price: 0.5,
          },
        ],
      },
      {
        name: 'Special Pink Tub',
        price: 3,
        colour: special,
        addons: [
          {
            name: 'Toppings',
            price: 0.5,
          },
        ],
      },
      {
        name: 'Special 99 Pink Tub',
        price: 3.5,
        colour: special99,
        addons: [
          {
            name: 'Flake',
            price: 0.5,
          },
          {
            name: 'Toppings',
            price: 0.5,
          },
        ],
      },
    ],
  },
  {
    name: "Kid's Tub",
    price: 2.5,
    icon: require('../assets/menuicons/ice-cream-tub.png'),
    colour: pink,
    shortcuts: [
      {
        name: "Kid's Tub",
        price: 2.5,
        colour: cream,
        addons: [],
      },
      {
        name: "Kid's 99 Tub",
        price: 3,
        colour: ninetynine,
        addons: [
          {
            name: 'Flake',
            price: 0.5,
          },
        ],
      },
      {
        name: "Kid's Special Tub",
        price: 3,
        colour: special,
        addons: [
          {
            name: 'Toppings',
            price: 0.5,
          },
        ],
      },
      {
        name: "Kid's Special 99 Tub",
        price: 3.5,
        colour: special99,
        addons: [
          {
            name: 'Flake',
            price: 0.5,
          },
          {
            name: 'Toppings',
            price: 0.5,
          },
        ],
      },
    ],
    modifiers: [
      {
        name: 'Flake',
        price: 0.5,
      },
      {
        name: 'Toppings',
        price: 0.5,
      },
      { name: 'Crush Flake', price: 1.5 },
    ],
  },
  {
    type: 'category',
    name: 'Tubs',
    icon: require('../assets/menuicons/ice-cream-cup.png'),
    colour: '#ff954a',
    items: [
      {
        name: 'Orange Tub',
        price: 4.0,
        colour: '#ff954a',
        modifiers: [
          {
            name: 'Flake',
            price: 0.5,
          },
          {
            name: 'Toppings',
            price: 0.5,
          },
          {
            name: 'Crush Flake',
            price: 1.5,
          },
        ],
        shortcuts: [
          {
            name: 'Plain Large Tub',
            price: 4,
            colour: cream,
            addons: [],
          },
          {
            name: '99 Large Tub',
            price: 4.5,
            colour: ninetynine,
            addons: [
              {
                name: 'Flake',
                price: 0.5,
              },
            ],
          },
          {
            name: 'Special Large Tub',
            price: 4.5,
            colour: special,
            addons: [
              {
                name: 'Toppings',
                price: 0.5,
              },
            ],
          },
          {
            name: 'Special 99 Large Tub',
            price: 5,
            colour: special99,
            addons: [
              {
                name: 'Flake',
                price: 0.5,
              },
              {
                name: 'Toppings',
                price: 0.5,
              },
            ],
          },
        ],
      },
      {
        name: 'Sundae',
        price: 4.0,
        colour: '#BDFF4A',
        modifiers: [
          { name: 'Flake', price: 0.5 },
          { name: 'Toppings', price: 0.5 },
          { name: 'Crush Flake', price: 1.5 },
        ],
        shortcuts: [
          {
            name: 'Plain Sundae',
            price: 4,
            colour: cream,
            addons: [],
          },
          {
            name: '99 Sundae',
            price: 4.5,
            colour: ninetynine,
            addons: [
              {
                name: 'Flake',
                price: 0.5,
              },
            ],
          },
          {
            name: 'Special Sundae',
            price: 4.5,
            colour: special,
            addons: [
              {
                name: 'Toppings',
                price: 0.5,
              },
            ],
          },
          {
            name: 'Special 99 Sundae',
            price: 5,
            colour: special99,
            addons: [
              {
                name: 'Flake',
                price: 0.5,
              },
              {
                name: 'Toppings',
                price: 0.5,
              },
            ],
          },
        ],
      },
      {
        name: 'Screwball',
        price: 3,
        colour: '#FFA600',
        modifiers: [
          { name: 'Flake', price: 0.5 },
          { name: 'Toppings', price: 0.5 },
          {
            name: 'Crush Flake',
            price: 1.5,
          },
        ],
        shortcuts: [
          {
            name: 'Plain Screwball',
            price: 3,
            colour: cream,
            addons: [],
          },
          {
            name: '99 Screwball',
            price: 3.5,
            colour: ninetynine,
            addons: [
              {
                name: 'Flake',
                price: 0.5,
              },
            ],
          },
          {
            name: 'Special Screwball',
            price: 3.5,
            colour: special,
            addons: [
              {
                name: 'Toppings',
                price: 0.5,
              },
            ],
          },
          {
            name: 'Special 99 Screwball',
            price: 4,
            colour: special99,
            addons: [
              {
                name: 'Flake',
                price: 0.5,
              },
              {
                name: 'Toppings',
                price: 0.5,
              },
            ],
          },
        ],
      },
      {
        name: 'Boat (w/ Flake)',
        price: 4,
        modifiers: [{ name: 'Toppings', price: 0.5 }],
        colour: '#00E6E6',
        shortcuts: [
          {
            name: 'Boat (w/ Flake)',
            price: 4,
            colour: ninetynine,
            addons: [],
          },
          {
            name: 'Special Boat (w/ Flake)',
            price: 4.5,
            colour: special99,
            addons: [
              {
                name: 'Toppings',
                price: 0.5,
              },
            ],
          },
        ],
      },
      {
        name: 'Float',
        price: 5,
        colour: coke,
      },
      {
        name: 'Hot Ferrero',
        price: 6,
        colour: chocolate,
        modifiers: [
          {
            name: 'Flake',
            price: 0.5,
          },
          {
            name: 'Strawberries',
            price: 0.5,
          },
        ],
        shortcuts: [
          {
            name: 'Hot Ferrero',
            price: 6,
            colour: cream,
            addons: [],
          },
          {
            name: '99 Hot Ferrero',
            price: 6.5,
            colour: ninetynine,
            addons: [
              {
                name: 'Flake',
                price: 0.5,
              },
            ],
          },
          {
            name: 'Hot Ferrero & Strawberries',
            price: 6.5,
            colour: strawberries,
            addons: [
              {
                name: 'Flake',
                price: 0.5,
              },
              {
                name: 'Strawberries',
                price: 0.5,
              },
            ],
          },
        ],
      },
      {
        name: 'Strawberries & Ice Cream',
        price: 6,
        colour: strawberries,
        modifiers: [
          {
            name: 'Flake',
            price: 0.5,
          },
        ],
        shortcuts: [
          {
            name: 'Strawberries & Ice Cream',
            price: 6,
            colour: strawberries,
            addons: [],
          },
          {
            name: '99 Strawberries & Ice Cream',
            price: 6.5,
            colour: ninetynine,
            addons: [
              {
                name: 'Flake',
                price: 0.5,
              },
            ],
          },
        ],
      },
      {
        name: 'Affogato',
        price: 5,
        colour: coffee,
      },
      {
        name: 'Treat Tub',
        price: 6,
        colour: cone,
        modifiers: [
          {
            name: 'Flake',
            price: 0.5,
          },
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
            price: 6,
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
            price: 6,
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
            price: 6,
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
        name: 'Kinder Bueno & Ice Cream',
        colour: chocolate,
        price: 6,
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
        price: 3,
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
            price: 3,
            colour: ninetynine,
            addons: [],
          },
          {
            name: 'Hot Chocolate w/ Marshmallows',
            price: 3.5,
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
        price: 2.8,
        colour: coffee,
      },
      {
        name: 'Latte',
        price: 3,
        colour: '#F0B771',
      },
      {
        name: 'Cappuccino',
        price: 3,
        colour: '#F0B771',
      },
      {
        name: 'Double Espresso',
        price: 2.8,
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
        name: 'Drumstick',
        price: 1,
      },
      {
        name: 'Refresher, Wham',
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
        name: 'Double Dip, Lipstick',
        price: 0.8,
      },
      {
        name: '2 Euro Bag',
        price: 2,
      },
    ],
  },
  {
    name: 'Chocolate Bars',
    type: 'category',
    icon: require('../assets/menuicons/chocolate-bar.png'),
    colour: chocolate,
    items: [
      {
        name: 'Standard Chocolate Bar',
        price: 1.8,
      },
      {
        name: 'Purple Snack',
        price: 1.5,
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
      },
      {
        name: 'Hula Hoops, Snax',
        price: 1.5,
      },

      {
        name: 'Popcorn Cone',
        price: 2.5,
      },
      {
        name: 'Popcorn Bag',
        price: 3.5,
      },
      {
        name: 'Candyfloss Bag or Stick',
        price: 2.5,
      },
      {
        name: 'Candyfloss Tub',
        price: 3.5,
      },
    ],
  },
];
