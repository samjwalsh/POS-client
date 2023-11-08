const { ipcMain, app } = require('electron');
const Store = require('electron-store');
const settingsStore = new Store();
const {
  ThermalPrinter,
  PrinterTypes,
  CharacterSet,
} = require('node-thermal-printer');
const printerDriver = require('@thiagoelg/node-printer');

ipcMain.handle('getAllPrinters', () => {
  return printerDriver.getPrinters();
});

const createPrinter = () => {
  let printerOptions = { name: '', type: '', characterSet: '' };
  const settings = settingsStore.get('settings');
  settings.forEach((category) => {
    category.settings.forEach((setting) => {
      switch (setting.name) {
        case 'Printer Name': {
          printerOptions.name = setting.value;
        }
        case 'Printer Type': {
          printerOptions.type = setting.value;
        }
        case 'Printer Character Set': {
          printerOptions.characterSet = setting.value;
        }
      }
    });
  });
  return new ThermalPrinter({
    type: PrinterTypes[printerOptions.type],
    interface: 'printer:' + printerOptions.name,
    driver: printerDriver,
    characterSet: CharacterSet[printerOptions.characterSet],
  });
};

ipcMain.handle('checkPrinterConnection', async () => {
  try {
    const printer = createPrinter();
    const isConnected = await printer.isPrinterConnected();
    return isConnected;
  } catch (e) {
    return false;
  }
});

ipcMain.handle('printOrder', async (e, order) => {
  try {
    // return printerDriver.getPrinters();
    const printer = createPrinter();

    // MUST SET USB002 PORT ON PRINTER PROPERTIES IN WINDOWS
    printer.bold(true);

    printer.alignCenter();
    printer.setTextQuadArea();
    printer.underlineThick(true);
    printer.println("Teddy's Ice Cream");
    printer.underlineThick(false);
    printer.setTextNormal();
    printer.newLine();
    printer.println('1a Windsor Terrace');
    printer.println('Dún Laoghaire');
    printer.println('Co. Dublin');
    printer.alignLeft();
    printer.drawLine();

    let quantityItems = 0;
    let total = 0;
    order.items.forEach((item, index) => {
      let price = item.price * item.quantity;
      quantityItems += item.quantity;
      total += price;
      printer.leftRight(item.name, `€${price.toFixed(2)}`);
      if (item.addons !== undefined && item.addons.length > 0) {
        let addonsString = 'Addons: ';
        item.addons.forEach((addon, index) => {
          if (index + 1 === item.addons.length) {
            addonsString += `${addon}`;
          } else {
            addonsString += `${addon}, `;
          }
        });
        printer.println(addonsString);
      }
      if (item.quantity > 1) {
        printer.println(`${item.quantity} @ €${item.price.toFixed(2)}`);
      }
      if (!(index + 1 === order.items.length)) {
        printer.leftRight('---', '---');
      }
    });

    printer.drawLine();
    printer.setTextQuadArea();
    printer.leftRight('Total:', `€${total.toFixed(2)}`);
    printer.leftRight('Vat Total:', `€${(0.23 * total).toFixed(2)}`);
    printer.setTextNormal();
    printer.newLine();
    printer.leftRight('Paid By:', order.paymentMethod);
    printer.newLine();
    printer.leftRight('Items:', quantityItems);
    printer.leftRight('Order No:', order.time);
    printer.leftRight('Time:', calculateDateString(new Date(order.time)));

    let shopName = '';
    let tillNo = '';
    const settings = settingsStore.get('settings');
    settings.forEach((category) => {
      category.settings.forEach((setting) => {
        switch (setting.name) {
          case 'Shop Name': {
            shopName = setting.value;
            break;
          }
          case 'Till Number': {
            tillNo = setting.value;
            break;
          }
        }
      });
    });

    printer.leftRight('Shop:', shopName + '-' + tillNo);

    printer.cut();
    try {
      let execute = await printer.execute();
      return execute;
    } catch (error) {
      return error;
    }
  } catch (e) {
    console.log(e);
    return e;
  }
});

function calculateDateString(time) {
  const date = new Date(time);
  let dateString = '';
  dateString += date.getHours().toString().padStart(2, '0');
  dateString += ':';
  dateString += date.getMinutes().toString().padStart(2, '0');
  dateString += ':';
  dateString += date.getSeconds().toString().padStart(2, '0');
  dateString += ' ';
  dateString += date.getDate().toString().padStart(2, '0');
  dateString += '/';
  dateString += (date.getMonth() + 1).toString().padStart(2, '0');
  dateString += '/';
  dateString += date.getFullYear().toString().padStart(2, '0');

  return dateString;
}
