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
  let useCOM = false;
  settings.forEach((category) => {
    category.settings.forEach((setting) => {
      if (setting.name === 'Use COM Port') useCOM = setting.value;
    });
  });
  settings.forEach((category) => {
    category.settings.forEach((setting) => {
      switch (setting.name) {
        case 'Printer Name': {
          printerOptions.name = 'printer:' + setting.value;
          break;
        }
        case 'COM Port': {
          printerOptions.port = setting.value;
          break;
        }
        case 'Printer Type': {
          printerOptions.type = setting.value;
          break;
        }
        case 'Printer Character Set': {
          printerOptions.characterSet = setting.value;
          break;
        }
      }
    });
  });

  return new ThermalPrinter({
    type: PrinterTypes[printerOptions.type],
    interface: useCOM ? printerOptions.port : printerOptions.name,
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
    printer.leftRight('VAT Total:', `€${(0.23 * total).toFixed(2)}`);
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

    // printer.openCashDrawer();

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

ipcMain.handle('printEndOfDay', async (e, orders) => {
  try {
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
    printer.newLine();
    printer.alignCenter();
    printer.setTextQuadArea();
    printer.underlineThick(false);
    printer.println('End Of Day');
    printer.setTextNormal();
    printer.drawLine();
    printer.setTextDoubleWidth();

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
    var date = new Date();
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();

    let dateString =
      date.toLocaleString('en-IE', { weekday: 'short' }) +
      ' ' +
      dd +
      '/' +
      mm +
      '/' +
      yyyy;
    printer.leftRight('Date:', dateString);

    printer.setTextNormal();
    printer.alignLeft();
    printer.drawLine();

    let cashTotal = 0;
    let cardTotal = 0;
    let quantityItems = 0;
    let quantityOrders = orders.length;

    orders.forEach((order) => {
      if (order.paymentMethod === 'Card') {
        cardTotal += order.subtotal;
      } else {
        cashTotal += order.subtotal;
      }

      order.items.forEach((item) => {
        if (item.quantity === undefined) {
          quantityItems++;
        } else {
          quantityItems += item.quantity;
        }
      });
    });

    let xTotal = cashTotal + cardTotal;

    printer.setTextDoubleWidth();
    printer.leftRight('Cash:', `€${cashTotal.toFixed(2)}`);
    printer.newLine();
    printer.leftRight('Card:', `€${cardTotal.toFixed(2)}`);
    printer.newLine();
    printer.setTextQuadArea();
    printer.leftRight('Total:', `€${xTotal.toFixed(2)}`);
    printer.newLine();
    printer.setTextDoubleWidth();
    printer.leftRight('VAT Total:', `€${(0.23 * xTotal).toFixed(2)}`);
    printer.setTextNormal();
    printer.newLine();
    printer.leftRight('Total Items:', quantityItems);
    printer.leftRight('Total Orders:', quantityOrders);
    printer.leftRight(
      'Average Sale:',
      `€${(xTotal / quantityOrders === 0 ? 1 : quantityOrders).toFixed(2)}`
    );
    printer.newLine();
    printer.leftRight('Time:', calculateDateString(new Date().getTime()));

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

ipcMain.handle('printTestPage', async () => {
  try {
    const printer = createPrinter();
    const testString =
      '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
    printer.setTextQuadArea();
    printer.println(testString);

    printer.setTextDoubleHeight();
    printer.println(testString);

    printer.setTextDoubleWidth();
    printer.println(testString);

    printer.setTextNormal();
    printer.println(testString);

    printer.cut();
    let execute = await printer.execute();
  } catch (e) {
    console.log(e);
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
