import * as React from 'react';

import log from '../../tools/logging';
import playBeep from '../../tools/playBeep';

import useAlert from '../Reusables/Alert.jsx';
import AddonBox from './AddonBox.jsx';
import ShortcutBox from './ShortcutBox.jsx';

import addSVG from '../../assets/appicons/add.svg';
import minusSVG from '../../assets/appicons/minus.svg';

export default function ItemPage({
  menuState,
  setMenuState,
  currentOrder,
  setCurrentOrder,
  order,
  setOrder,
}) {
  const [Alert, alert] = useAlert();
  const handleClickHelp = async () => {
    await alert(
      <div className='w-[80vw]'>
        <div className='text-xl'>Shortcut Buttons</div>
        <div className='text-base whitespace-pre-line'>
          The large buttons at the top of the container are shortcut buttons,
          pressing a shortcut button is the same as manually clicking the addon
          buttons for the shortcut you clicked (if you clicked Special 99 it
          would add a flake and toppings) and then adding the item to the cart.
          {'\n\n'}
          If you have already selected some addons, like crushed flake, and
          changed the quantity, these changes will stay after you click a
          shortcut button, so if you add crushed flake and increase the quantity
          to 2 before pressing the 99 shortcut button, 2 99s with crushed flake
          will be added to the cart.{'\n\n'}
        </div>
        <div className='text-xl'>Addon Buttons</div>
        <div className='text-base whitespace-pre-line'>
          The addon buttons are in the bottom half of the container, clicking an
          addon button will toggle it on or off (so if you tap flake once it
          adds a flake but if you tap it again it takes it away).{'\n\n'}
          If you select an addon like a flake and then press the shortcut button
          for a 99, a 99 will be added to the cart with only 1 flake, not 0 or
          2. If you want to add a second flake you can find it in the extras
          section.
        </div>
      </div>
    );
  };

  // Create addon HTML
  const item = {};
  item.name = menuState.name;
  item.price = menuState.price;
  item.shortcuts = menuState.shortcuts;

  item.addons = [];
  for (const addon of menuState.modifiers) {
    if (addon.name !== undefined) {
      item.addons.push(addon);
      log(`Detected an addon`);
    } else {
      log(`Detected a priceCheck function`);
      item.priceCheck = addon.priceCheck;
    }
  }

  let quantity;
  if (currentOrder.quantity === undefined) {
    quantity = 1;
  } else {
    quantity = currentOrder.quantity;
  }

  log(`Computed price for item and addons`);
  const price = computePrice(item, currentOrder, setCurrentOrder).toFixed(2);
  log(`Created HTML for item page`);
  return (
    <>
      <Alert />
      <div className='flex flex-col h-full content-start p-2'>
        <div className='grid grid-cols-2 grid-rows-1 text-2xl h-min'>
          <div className='col-span-1 text-left w-auto h-min whitespace-nowrap mt-2'>
            {menuState.name}
          </div>
          <div className='col-span-1 text-right self-end justify-self-end flex flex-row gap-4'>
            <button
              className='whitespace-nowrap text-lg btn btn-primary'
              onContextMenu={() => handleClickHelp()}
              onTouchEnd={() => handleClickHelp()}>
              Help
            </button>
            <button
              className='col-span-1 text-right self-end justify-self-end w-min h-min whitespace-nowrap p-2 text-lg btn btn-error'
              onContextMenu={() =>
                handleExitItemPage(setMenuState, setCurrentOrder)
              }
              onTouchEnd={() =>
                handleExitItemPage(setMenuState, setCurrentOrder)
              }>
              Cancel
            </button>
          </div>
        </div>
        <div className='w-full h-min flex-grow-0 overflow-y-scroll no-scrollbar'>
          <div className='flex flex-row gap-2 h-auto'>
            {item.shortcuts.map((shortcut) => {
              return (
                <ShortcutBox
                  key={shortcut.name}
                  shortcut={shortcut}
                  item={item}
                  setMenuState={setMenuState}
                  currentOrder={currentOrder}
                  setCurrentOrder={setCurrentOrder}
                  order={order}
                  setOrder={setOrder}
                />
              );
            })}
          </div>
          <div className='flex flex-row flex-wrap gap-2 py-2 overflow-y-scroll no-scrollbar flex-grow-0 '>
            {item.addons.map((addon, index) => {
              return (
                <AddonBox
                  key={addon.name}
                  addon={addon}
                  index={index}
                  item={item}
                  currentOrder={currentOrder}
                  setCurrentOrder={setCurrentOrder}
                />
              );
            })}
            <div className='w-72 max-w-full flex-grow flex flex-row '></div>
          </div>
        </div>
        <div className='w-full flex flex-row mt-auto gap-2 pt-2 h-16'>
          <div className='flex flex-row '>
            <div
              className='w-14 h-auto cnter-items btn btn-error '
              onContextMenu={() =>
                handleChangeQuantity(
                  item,
                  currentOrder,
                  setCurrentOrder,
                  'down'
                )
              }
              onTouchEnd={() =>
                handleChangeQuantity(
                  item,
                  currentOrder,
                  setCurrentOrder,
                  'down'
                )
              }>
              <img src={minusSVG} className='w-6 invert-icon' />
            </div>
            <div className=' w-16 h-auto num cnter-items text-2xl'>
              {quantity}
            </div>
            <div
              className='btn btn-success w-14 h-auto cnter-items'
              onContextMenu={() =>
                handleChangeQuantity(item, currentOrder, setCurrentOrder, 'up')
              }
              onTouchEnd={() =>
                handleChangeQuantity(item, currentOrder, setCurrentOrder, 'up')
              }>
              <img src={addSVG} className='w-6 invert-icon' />
            </div>
          </div>
          <div className='text-2xl w-full h-auto num cnter-items'>€{price}</div>
          <div
            className='btn btn-primary text-xl h-full positive w-48'
            onContextMenu={() =>
              handleAddToOrder(
                item,
                setMenuState,
                currentOrder,
                setCurrentOrder,
                order,
                setOrder
              )
            }
            onTouchEnd={() =>
              handleAddToOrder(
                item,
                setMenuState,
                currentOrder,
                setCurrentOrder,
                order,
                setOrder
              )
            }>
            Add
          </div>
        </div>
      </div>
    </>
  );
}

function computePrice(item, currentOrder) {
  log(`Compute price of item ${item.name} multiplied by its quantity`);
  if (currentOrder == '') {
    return item.price;
  } else if (currentOrder.priceCheck == '') {
    let addonsCost = 0;
    currentOrder.addons.forEach((addon) => {
      if (addon.selected === true) {
        addonsCost += addon.price;
      }
    });
    return (currentOrder.price + addonsCost) * currentOrder.quantity;
  } else {
    log(
      `Computing price of ${item.name} multiplied by its quantity using a priceCheck function`
    );
    const addonsCost = currentOrder.priceCheck(currentOrder.addons);
    return (currentOrder.price + addonsCost) * currentOrder.quantity;
  }
}

function handleChangeQuantity(item, currentOrder, setCurrentOrder, direction) {
  playBeep();
  let quantity = 1;
  if (currentOrder.quantity === undefined && direction === 'up') {
    quantity = 2;
  } else if (direction === 'up') {
    quantity = currentOrder.quantity + 1;
  } else if (direction === 'down' && currentOrder.quantity > 1) {
    quantity = currentOrder.quantity - 1;
  }
  setCurrentOrder({
    name: item.name,
    price: item.price,
    quantity,
    priceCheck: item.priceCheck === undefined ? '' : item.priceCheck,
    addons: item.addons,
  });
}

function handleExitItemPage(setMenuState, setCurrentOrder) {
  playBeep();

  log(`Exiting item page to main menu and deleting current order`);
  setMenuState('');
  setCurrentOrder('');
}

export function handleAddToOrder(
  item,
  setMenuState,
  currentOrder,
  setCurrentOrder,
  order,
  setOrder
) {
  playBeep();

  let parsedOrder = {
    name: item.name,
    price: computePriceNoQuantity(item, currentOrder),
    quantity: currentOrder.quantity === undefined ? 1 : currentOrder.quantity,
  };

  parsedOrder.addons = [];
  if (currentOrder.addons !== undefined) {
    currentOrder.addons.forEach((addon) => {
      if (addon.selected === true) {
        log(`Addon ${addon.name} put into order`);
        parsedOrder.addons.push(addon.name);
      }
    });
  }

  let itemWasDupe = false;

  for (let index = 0; index < order.length; index++) {
    let orderItem = order[index];

    if (
      parsedOrder.name === orderItem.name &&
      arrayEquals(parsedOrder.addons, orderItem.addons)
    ) {
      log(`Detected duplicate item in order`);
      order[index].quantity += parsedOrder.quantity;
      setOrder([...order]);
      itemWasDupe = true;
    }
  }

  if (!itemWasDupe) {
    log(`Added item ${item.name} to order, was not a duplicate`);
    setOrder((order) => [...order, parsedOrder]);
  }

  log(`Exiting item page`);
  handleExitItemPage(setMenuState, setCurrentOrder);
}

function computePriceNoQuantity(item, currentOrder) {
  console.log(currentOrder);
  log(`Computing price of individual item ${item.name}`);
  if (currentOrder == '') {
    return item.price;
  } else if (
    currentOrder.priceCheck == '' ||
    currentOrder.priceCheck === undefined
  ) {
    let addonsCost = 0;
    currentOrder.addons.forEach((addon) => {
      if (addon.selected === true) {
        addonsCost += addon.price;
      }
    });
    return currentOrder.price + addonsCost;
  } else {
    log(`Computing price of addons using priceCheck function`);
    const addonsCost = currentOrder.priceCheck(currentOrder.addons);
    return currentOrder.price + addonsCost;
  }
}

function arrayEquals(a, b) {
  log(`Detecting if two orders are equal`);
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}
