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
    name: "Cones",
    price: 2.5,
    modifiers: [
      {
        name: "Flake",
        price: 0.5,
        default: true,
      },
      {
        name: "Toppings",
        price: 0.5,
      },
      {
        name: "Waffle Cone",
        price: 1.5,
      },
      {
        name: "Crushed Flake",
        price: 1,
      },
      {
        priceCheck: function (itemSelection) {
          // Add code to check for chocolate dip selection and adjust price accordingly: Choco cone = 3.3, Choco 99 = 4
        },
      },
    ],
  },
  {
    name: "Kid's Cones",
    price: 2.3,
    modifiers: [
      {
        name: "Flake",
        price: 0.2,
        default: true,
      },
      {
        name: "Toppings",
        price: 0.5,
      },
      { name: "Crushed Flake", price: 1 },
      {
        priceCheck: function (itemSelection) {
          // Add code to check for chocolate dip, both choco dip with and without flake are 3.5
        },
      },
    ],
  },
  {
    name: "Family Special",
    price: 10,
  },
  {
    type: "category",
    name: "Tubs",
    items: [
      {
        name: "Pink Tub",
        price: 2.5,
        modifiers: [
          {
            name: "Flake",
            price: 0.5,
            default: true,
          },
          {
            name: "Toppings",
            price: 0.5,
          },
          {
            name: "Crushed Flake",
            price: 1.0,
          },
        ],
      },
      {
        name: "Large Tub",
        price: 4.0,
        modifiers: [
          {
            name: "Flake",
            price: 0.5,
            default: true,
          },
          {
            name: "Toppings",
            price: 0.5,
          },
          {
            name: "Crushed Flake",
            price: 1.0,
          },
        ],
      },
      {
        name: "Sundae",
        price: 4.0,
        modifiers: [
          { name: "flake", price: 0.5 },
          { name: "Toppings", price: 0.5 },
          { name: "Crushed Flake", price: 1.0 },
        ],
      },
      {
        name: "Screwball",
        price: 3,
        modifiers: [
          { name: "Flake", price: 0.5 },
          { name: "Toppings", price: 0.5 },
        ],
      },
      {
        name: "Boat (w/ Flake)",
        price: 4,
        modifiers: [{ name: "Toppings", price: 0.5 }],
      },
      {
        name: "Hot Ferrero",
        price: 6,
        modifiers: [
          {
            name: "Flake",
            price: 0.5,
          },
        ],
      },
      {
        name: "Straw. Ice",
        price: 6,
        modifiers: [
            {
                name: "Flake",
                price: 0.5
            }
        ]
      },
      {
        name: "Ferrero Straw.",
        price: 6.5,
        modifiers: [
            {
                name: "Flake",
                price: 0.5
            }
        ]
      },
      {
        name: "Treat Tub",
        price: 6.5,
        modifiers: [
            {
                name: "Flake",
                price: 0.5
            }
        ]
      },
      {
        name: "Float",
        price: 6,
      },
      {
        name: "Coffee Ice.",
        price: 5
      }
    ],
  },
  {
    type: "category",
    name: "Drinks",
    items: [
      {
        name: "Soft Bottles",
        price: 2.8,
      },
      {
        name: "Water",
        price: 2,
      },
      {
        name: "Cans",
        price: 2,
      },
      {
        name: "Ribena",
        price: 2,
      },
      {
        name: "Capri-Sun",
        price: 2,
      },
    ],
  },
];