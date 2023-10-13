export const settingsSchema = [
  {
    name: "Display",
    settings: [
      {
        name: "Zoom Factor",
        type: "range",
        value: 16,
        min: 14,
        max: 32,
        step: 2,
        default: 16,
      },
    ],
  },
  {
    name: "System",
    settings: [
      {
        name: "Reset All Settings",
        label: "Reset",
        type: "button",
      },
    ],
  },
];
