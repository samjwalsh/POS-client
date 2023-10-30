const { ipcMain, app } = require('electron');
import puppeteer from 'puppeteer';
// import { print, getPrinters, getDefaultPrinter } from 'pdf-to-printer';

const fs = require('fs');

ipcMain.handle('printOrder', async (e, order) => {
  let receiptHTML = createReceiptHTML(order);

  let dir = `${app.getPath('appData')}/pos-client/receipts/`;

  // Making sure folder exists
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      console.log('Directory is created.');
    } else {
      console.log('Directory already exists.');
    }
  } catch (err) {
    console.log(err);
  }

  // Emptying folder from last use
  try {
    fs.unlinkSync(`${dir}/receipt.pdf`);
  } catch (err) {
    console.error(err);
  }

  // Create a browser instance
  const browser = await puppeteer.launch({ headless: 'new' });

  // Create a new page
  const page = await browser.newPage();

  await page.setContent(receiptHTML, { waitUntil: 'domcontentloaded' });

  // To reflect CSS used for screens instead of print
  await page.emulateMediaType('screen');

  // Downlaod the PDF
  await page.pdf({
    path: `${dir}/receipt.pdf`,
    printBackground: true,
    height: '1000mm',
    width: '80mm',
  });

  // Close the browser instance
  await browser.close();

  // await getPrinters().then(console.log);
  // await getDefaultPrinter().then(console.log);

  const options = {
    printer: 'Microsoft Print to PDF',
  };

  // print(`${dir}/receipt.pdf`, options)
  //   .then(console.log)
  //   .catch((err) => {
  //     console.log(err);
  //   });
});

function createReceiptHTML(order) {
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
}
