const { ipcMain, app } = require('electron');
const ThermalPrinter = require('node-thermal-printer').printer;
const PrinterTypes = require('node-thermal-printer').types;
// import { print, getPrinters, getDefaultPrinter } from 'pdf-to-printer';
// import pdfkit from 'pdfkit';

// const lineLength = 38;

// const fs = require('fs');

ipcMain.handle('printOrder', async (e, order) => {
  let printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: `//./COM3`,
    // interface: '//localhost/printer', /*https://i.stack.imgur.com/IrHCi.png*/
    characterSet: 'PC850_MULTILINGUAL',
  });

  printer.alignCenter();
  printer.setTextQuadArea();
  printer.println("Teddy's Ice Cream");
  printer.drawLine(); // Draws a line

  printer.setTextNormal();
  printer.alignLeft(); // Align text to left

  let total = 0;

  order.items.forEach((item) => {
    let price = item.price * item.quantity;
    total += price;
    printer.leftRight(item.name, `€${price.toFixed(2)}`); // Prints text left and right

    if (item.addons.length > 0) {
      let addonsString = '';
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
      printer.println(`${item.quantity} @ ${item.price.toFixed(2)}`);
    }

    printer.newLine();
  });

  printer.drawLine(); // Draws a line
  printer.setTextQuadArea();
  printer.leftRight('Total:', `€${total.toFixed(2)}`);
  printer.leftRight('Vat Total:', `€${(0.23 * total).toFixed(2)}`);

  printer.setTextNormal();
  printer.leftRight('Paid By:', order.paymentMethod);

  try {
    let execute = await printer.execute();
    console.log('Print done!');
  } catch (error) {
    console.error('Print failed:', error);
  }
});

// ipcMain.handle('printOrder', async (e, order) => {
//   let dir = `${app.getPath('appData')}/pos-client/receipts/`;

//   freeUpFolder(dir);

//   createReceipt(order, dir);

//   await getPrinters().then(console.log);
//   await getDefaultPrinter().then(console.log);

//   const options = {
//     printer: 'Microsoft Print to PDF',
//   };

//   // print(`${dir}/receipt.pdf`, options)
//   //   .then(console.log)
//   //   .catch((err) => {
//   //     console.log(err);
//   //   });
// });

// function freeUpFolder(dir) {
//   // Making sure folder exists
//   try {
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir);
//       console.log('Directory is created.');
//     } else {
//       console.log('Directory already exists.');
//     }
//   } catch (err) {
//     console.log(err);
//   }

//   // Emptying folder from last use
//   try {
//     fs.unlinkSync(`${dir}/receipt.pdf`);
//   } catch (err) {
//     console.error(err);
//   }
// }

// function createReceipt(order, dir) {
//   const doc = new pdfkit({
//     size: [204.0948, 10000],
//     margins: {
//       // by default, all are 72
//       top: 10,
//       bottom: 10,
//       left: 10,
//       right: 10,
//     },
//   });

//   doc.fontSize(8);
//   doc.font('Courier-Bold');

//   // order.items.forEach((item) => {
//   //   padLine(doc, item.name, `€${(item.price * item.quantity).toFixed(2)}`);

//   //   if (item.addons.length > 0) {
//   //     let addonsString = '';
//   //     item.addons.forEach((addon, index) => {
//   //       if (index + 1 === item.addons.length) {
//   //         addonsString += `${addon}`;
//   //       } else {
//   //         addonsString += `${addon}, `;
//   //       }
//   //     });
//   //     padLine(doc, addonsString);
//   //   }

//   //   if (item.quantity > 1) {
//   //     padLine(doc, `   ${item.quantity} @ ${item.price.toFixed(2)}`);
//   //   }
//   //   padLine(doc, '---', '---');
//   // });

//   padLine(doc, '1234567890123456789012345678901234567');
//   padLine(doc, '12345678901234567890123456789012345678');
//   padLine(doc, '123456789012345678901234567890123456789');
//   padLine(
//     doc,
//     '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890'
//   );

//   doc.pipe(fs.createWriteStream(`${dir}/receipt.pdf`)); // write to PDF
//   doc.end();
// }

// function padLine(doc, leftString, rightString) {
//   if (rightString === undefined) {
//     rightString = '';
//   }

//   let leftGap = 5;

//   const paddingChar = ' ';

//   let charsRemaining = leftString.length + rightString.length;

//   while (charsRemaining > 0) {
//     if (rightString.length > lineLength - leftGap) {
//       doc.text(`${rightString.slice(0, lineLength - leftGap)}${paddingChar.repeat(lineLength - rightString.slice(0, lineLength - leftGap).length)}`, { align: 'center' });
//       rightString = rightString.slice(
//         lineLength - leftGap + 1,
//         rightString.length + 1
//       );
//     } else if ((rightString.length + leftString.length) <= lineLength - leftGap) {
//       doc.text()
//     }
//   }

//   console.log(totalLines);
// }

// function insertDivider(doc) {
//   doc.text('-'.repeat(lineLength), { align: 'center' });
// }

/*
  let receiptHTML = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Receipt</title>
    </head>
    <body>
    <div class="center large">Teddy's Ice Cream</div>
    <div class="divider">&nbsp</div>
    `;

  let subtotal = 0;

  order.items.forEach((item) => { 
    subtotal += item.quantity * item.price;

    receiptHTML += `
        <div class="row-entry">
        <div>${item.name}</div>
        <div>${(item.quantity * item.price).toFixed(2)}</div>
        </div>`;

    if (item.addons.length > 0) {
      let addonsString = `
            <div class="row-entry">
            <div>Addons: `;
      item.addons.forEach((addon, index) => {
        if (index + 1 === item.addons.length) {
          addonsString += `${addon}`;
        } else {
          addonsString += `${addon}, `;
        }
      });
      addonsString += `
      </div>
      </div>`;

      receiptHTML += addonsString;
    }

    if (item.quantity > 1) {
      receiptHTML += `
      <div class="row-entry">
      <div>${item.quantity} @ ${item.price.toFixed(2)}</div>
      </div>`;
    }
    receiptHTML += `
    <div class="divider">&nbsp</div>`;
  });

  receiptHTML += `
  <div class="row-entry large">
      <div>Total:</div>
      <div>${subtotal.toFixed(2)}</div>
    </div>
    <div class="row-entry large">
      <div>VAT Total:</div>
      <div>${(subtotal * 0.23).toFixed(2)}</div>
    </div>
  </body>
</html>
`;

  receiptHTML += `
<style>
  html {
    font-family: monospace;
    font-size: 11px;
    font-weight: bold;
  }

  body {
    padding: 0.2rem;
    padding-right: 1rem;
    display: flex;
    flex-direction: column;
  }

  .divider {
    width: 100%;
    border-bottom: 1px dashed black;
    height: 0rem;
    margin-top: 0.2rem;
    margin-bottom: 0.2rem;
  }

  .row-entry {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .center {
    text-align: center;
  }

  .large {
    font-size: 2rem;
  }
</style>
`;
  return receiptHTML;
*/
