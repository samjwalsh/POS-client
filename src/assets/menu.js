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
default: true //can be omitted to indicate false
}

Category:
{
type: 'category',
name: '',
items: [...]
}

*/
export const menu = [
  {
    name: 'Cone',
    price: 2.5,
    shortcuts: [
      {
        name: 'Plain Cone',
        price: 2.5,
        addons: [],
      },
      {
        name: '99',
        price: 3,
        addons: [
          {
            name: 'Flake',
            price: 0.5,
            default: true,
          },
        ],
      },
      {
        name: 'Special 99',
        price: 3.5,
        addons: [
          {
            name: 'Flake',
            price: 0.5,
            default: true,
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
        default: true,
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
          // Add code to check for chocolate dip selection and adjust price accordingly: Choco cone = 3.3, Choco 99 = 4
          let addonsCost = 0;
          let selectedAddons = [];

          addons.forEach((addon) => {
            if (addon.selected === true) {
              selectedAddons.push(addon.name);
              addonsCost += addon.price;
            }
          });

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
    shortcuts: [
      {
        name: "Kid's Cone",
        price: 2.3,
        addons: [],
      },
      {
        name: "Kid's 99",
        price: 2.5,
        addons: [
          {
            name: 'Flake',
            price: 0.2,
            default: true,
          },
        ],
      },
      {
        name: "Kid's Special 99",
        price: 3,
        addons: [
          {
            name: 'Flake',
            price: 0.2,
            default: true,
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
        default: true,
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

          addons.forEach((addon) => {
            if (addon.selected == true) {
              selectedAddons.push(addon.name);
              addonsCost += addon.price;
            }
          });

          if (
            selectedAddons.includes('Choc Dip') &&
            selectedAddons.includes('Flake')
          ) {
            addonsCost += 0.3;
          }

          return addonsCost;
        },
      },
    ],
  },
  {
    name: 'Family Sp.',
    price: 10,
  },
  {
    type: 'category',
    name: 'Tubs',
    items: [
      {
        name: 'Pink Tub',
        price: 2.5,
        modifiers: [
          {
            name: 'Flake',
            price: 0.5,
            default: true,
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
      },
      {
        name: 'Large Tub',
        price: 4.0,
        modifiers: [
          {
            name: 'Flake',
            price: 0.5,
            default: true,
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
      },
      {
        name: 'Sundae',
        price: 4.0,
        modifiers: [
          { name: 'Flake', price: 0.5 },
          { name: 'Toppings', price: 0.5 },
          { name: 'Crush Flake', price: 1.5 },
        ],
      },
      {
        name: 'Screwball',
        price: 3,
        modifiers: [
          { name: 'Flake', price: 0.5 },
          { name: 'Toppings', price: 0.5 },
        ],
      },
      {
        name: 'Boat (w/ Flake)',
        price: 4,
        modifiers: [{ name: 'Toppings', price: 0.5 }],
      },
      {
        name: 'Hot Ferrero',
        price: 6,
        modifiers: [
          {
            name: 'Flake',
            price: 0.5,
          },
        ],
      },
      {
        name: 'Strawberries & Ice Cream',
        price: 6,
        modifiers: [
          {
            name: 'Flake',
            price: 0.5,
          },
        ],
      },
      {
        name: 'Hot Ferrero & Strawberries',
        price: 6.5,
        modifiers: [
          {
            name: 'Flake',
            price: 0.5,
          },
        ],
      },
      {
        name: 'Treat Tub',
        price: 6,
        modifiers: [
          {
            name: 'Flake',
            price: 0.5,
          },
        ],
      },
      {
        name: 'Float',
        price: 6,
      },
      {
        name: 'Coffee Ice.',
        price: 5,
      },
    ],
  },
  {
    type: 'category',
    name: 'Cold Drinks',
    items: [
      {
        name: 'Soft Bottles',
        price: 2.5,
      },
      {
        name: 'Water',
        price: 2,
      },
      {
        name: 'Cans',
        price: 2,
      },
      {
        name: 'Ribena',
        price: 2,
      },
      {
        name: 'Capri-Sun',
        price: 2,
      },
      {
        name: 'Monster',
        price: 2.8,
      },
    ],
  },
  {
    name: 'Hot Drinks',
    type: 'category',
    items: [
      {
        name: 'Americano',
        price: 2.8,
      },
      {
        name: 'Cappuccino',
        price: 3,
      },
      {
        name: 'Latte',
        price: 3,
      },
      {
        name: 'Tea',
        price: 2.5,
      },
      {
        name: 'Hot Chocolate',
        price: 3,
        modifiers: [
          {
            name: 'Marshmallows',
            price: 0.5,
          },
        ],
      },
      {
        name: 'Double Espresso',
        price: 2.8,
      },
    ],
  },
  {
    name: 'Extras',
    type: 'category',
    items: [
      {
        name: 'Flake',
        price: 0.5,
      },
      {
        name: 'Empty Cone',
        price: 0.3,
      },
      {
        name: 'Waffle Cone',
        price: 1,
      },
      {
        name: 'Toppings',
        price: 0.5,
      },
      { name: 'Ferrero', price: 1.5 },
      { name: 'Strawberries', price: 1.5 },
      { name: 'Chocolate Dip', price: 1.5 },
    ],
  },
  {
    name: 'Sweets',
    type: 'category',
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
        name: 'Refresher',
        price: 0.8,
      },
      {
        name: 'Wham Bar',
        price: 0.8,
      },
      {
        name: 'Jawbreaker',
        price: 1.2,
      },
      {
        name: 'Chewits',
        price: 1.3,
      },
      {
        name: 'Lipstick',
        price: 0.8,
      },
      {
        name: 'Double Dip',
        price: 0.8,
      },
      {
        name: "Dunk'n Dip",
        price: 1,
      },
      {
        name: '2 Euro Bag',
        price: 2,
      },
      {
        name: 'Golf Balls',
        price: 1.2,
      },
    ],
  },
  {
    name: 'Chocolate Bars',
    type: 'category',
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
    name: 'Toys',
    type: 'category',
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
    name: 'Crisps, Popcorn, Candyfloss, Slush',
    type: 'category',
    items: [
      {
        name: 'Crisps',
        price: 1.6,
      },
      {
        name: 'Snax, Hula Hoops',
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
      {
        name: 'Yard Slush',
        price: 3.5,
      },
      {
        name: 'Small Slush',
        price: 2.5,
      },
      {
        name: 'Large Slush',
        price: 3.5,
      },
    ],
  },
];
