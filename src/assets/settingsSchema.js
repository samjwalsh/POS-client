export const settingsSchema = [
  {
    name: "Display",
    settings: [
      {
        name: "Zoom Factor",
        type: "range",
        value: 16,
        min: 10,
        max: 40,
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
      { name: "Delete All Local Data", label: "Delete", type: "button" },
    ],
  },
];
