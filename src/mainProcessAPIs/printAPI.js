const { ipcMain, app } = require('electron');
const {
  ThermalPrinter,
  PrinterTypes,
  CharacterSet,
} = require('node-thermal-printer');
const printerDriver = require('@thiagoelg/node-printer');

ipcMain.handle('printOrder', async (e, order) => {
  // return printerDriver.getPrinters();
  let printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: 'printer:SGT-116Receipt Printer',
    driver: printerDriver,
    characterSet: CharacterSet.WPC1252,
  });

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

  let total = 0;
  order.items.forEach((item, index) => {
    console.log(item);
    let price = item.price * item.quantity;
    total += price;
    printer.leftRight(item.name, `€${price.toFixed(2)}`);
    if (item.addons !== undefined && item.addons.length > 0) {
      console.log('addons');
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
  printer.leftRight('Order No:', order.time);
  printer.leftRight('Time:', calculateDateString(new Date(order.time)));

  printer.cut();
  try {
    let execute = await printer.execute();
    return execute;
  } catch (error) {
    return error;
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
