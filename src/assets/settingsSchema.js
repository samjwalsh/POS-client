export const settingsSchema = [
  {
    name: 'Display',
    settings: [
      {
        name: 'Zoom Factor',
        type: 'range',
        value: 16,
        min: 10,
        max: 40,
        step: 2,
        default: 16,
      },
      {
        name: 'Dark Mode',
        type: 'toggle',
        value: false,
      },
    ],
  },
  {
    name: 'Shop',
    settings: [
      {
        name: 'Shop Name',
        type: 'dropdown',
        value: 'DEV',
        list: ['DEV', 'Main', 'Lighthouse', 'West Pier', 'Bray'],
      },
      {
        name: 'Till Number',
        type: 'dropdown',
        value: '1',
        list: ['1', '2', '3'],
      },
    ],
  },

  {
    name: 'Printer',
    settings: [
      {
        name: 'Printer Name',
        type: 'dropdown',
        value: 'Select Printer',
      },
      {
        name: 'Printer Type',
        type: 'dropdown',
        value: 'EPSON',
        list: ['EPSON', 'STAR', 'TANCA', 'DARUMA'],
      },
      {
        name: 'Use COM Port',
        type: 'toggle',
        value: false,
      },
      {
        name: 'COM Port',
        type: 'dropdown',
        value: '\\.COM1',
        list: [
          '//./COM1',
          '//./COM2',
          '//./COM3',
          '//./COM4',
          '//./COM5',
          '//./COM6',

        ],
      },
      {
        name: 'Printer Character Set',
        type: 'dropdown',
        value: 'WPC1252',
        list: ['PC437_USA', 'PC850_MULTILINGUAL', 'WPC1252', 'PC858_EURO'],
      },
      {
        name: 'Print Test Page',
        label: 'Print',
        type: 'button',
      },
    ],
  },
  {
    name: 'System',
    settings: [
      {
        name: 'Reset All Settings',
        label: 'Reset',
        type: 'button',
      },
      { name: 'Delete All Local Data', label: 'Delete', type: 'button' },
    ],
  },
];
