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
        name: 'Theme',
        type: 'dropdown',
        value: 'default',
        list: ['emerald', 'teddys', 'corporate', 'retro', 'cyberpunk', 'night'],
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
    name: 'Network',
    settings: [
      {
        name: 'Sync Server',
        type: 'textInput',
        value: 'localhost:8080',
      },
      {
        name: 'Sync Server Key',
        type: 'textInput',
        value: 'password',
      },
      {
        name: 'HTTPS',
        type: 'toggle',
        value: false,
      },
      {
        name: 'Sync Frequency',
        type: 'numberInput',
        value: 30,
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
      { name: 'Delete All Local Orders', label: 'Delete', type: 'button' },
    ],
  },
];
