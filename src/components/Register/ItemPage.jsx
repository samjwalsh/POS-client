import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { useState } from 'react';

import log from '../../tools/logging';
import playBeep from '../../tools/playBeep';

import checkSVG from '../../assets/appicons/check.svg';
import addSVG from '../../assets/appicons/add.svg';
import minusSVG from '../../assets/appicons/minus.svg';

export default function ItemPage(props) {
  const menuState = props.menuState;
  const setMenuState = props.setMenuState;
  const currentOrder = props.currentOrder;
  const setCurrentOrder = props.setCurrentOrder;
  const order = props.order;
  const setOrder = props.setOrder;

  // Create addon HTML
  const item = {};
  item.name = menuState.name;
  item.price = menuState.price;

  item.addons = [];
  menuState.modifiers.forEach((addon) => {
    if (addon.name !== undefined) {
      item.addons.push(addon);
      log(`Detected an addon`);
    } else {
      log(`Detected a priceCheck function`);
      item.priceCheck = addon.priceCheck;
    }
  });

  item.shortcuts = menuState.shortcuts;

  const addonsHTML = item.addons.map((addon, index) => {
    let selected;
    if (currentOrder.addons == undefined) {
      log(`Initialised addon selected string`);
      selected = false;
      addon.selected = false;
    } else if (currentOrder.addons[index].selected === true) {
      selected = true;
    } else {
      selected = false;
    }

    log(`Created HTML for addon ${addon.name}`);
    return (
      <div
        key={addon.name}
        className='w-72 max-w-full flex-grow flex flex-row gradient1 rounded h-16 justify-between'
        id={index}
        onContextMenu={(event) =>
          handleAddonToggle(
            event,
            item,
            item.addons[index],
            currentOrder,
            setCurrentOrder,
            index
          )
        }
        onClick={(event) =>
          handleAddonToggle(
            event,
            item,
            item.addons[index],
            currentOrder,
            setCurrentOrder,
            index
          )
        }>
        <div className='flex flex-row p-2'>
          <div className='text-xl cnter-items'>{addon.name}</div>
          <div className='pl-2 font-mono text-base cnter-items'>
            €{addon.price.toFixed(2)}
          </div>
        </div>
        <div className='btn gradientblack  cnter-items w-10 h-auto m-2'>
          <div className='toggleAddonButton' id={index}>
            {selected ? <img src={checkSVG} className='w-6 invert-icon' /> : ''}
          </div>
        </div>
      </div>
    );
  });

  let shortcutsHTML = '';

  if (item.shortcuts !== undefined) {
    shortcutsHTML = item.shortcuts.map((shortcut) => {
      let addons = shortcut.addons;
      return (
        <div
          className='mt-2 btn gradientgreen cnter-items w-full h-48 flex flex-col'
          onContextMenu={(shortcut) =>
            handleClickShortcut(
              event,
              item,
              setMenuState,
              currentOrder,
              setCurrentOrder,
              order,
              setOrder,
              addons
            )
          }
          onClick={(shortcut) =>
            handleClickShortcut(
              event,
              item,
              setMenuState,
              currentOrder,
              setCurrentOrder,
              order,
              setOrder,
              addons
            )
          }
          key={shortcut.name}>
          <div className=''>{shortcut.name}</div>
          <div className='font-mono font-normal'>
            €{shortcut.price.toFixed(2)}
          </div>
        </div>
      );
    });
  } else {
  }

  let quantity;
  if (currentOrder.quantity == undefined) {
    quantity = 1;
  } else {
    quantity = currentOrder.quantity;
  }

  log(`Computed price for item and addons`);
  const price = computePrice(item, currentOrder, setCurrentOrder).toFixed(2);
  6;
  log(`Created HTML for item page`);
  return (
    <div className='flex flex-col h-full content-start p-2'>
      <div className='grid grid-cols-2 grid-rows-1 text-2xl h-min border-b border-colour'>
        <div className='col-span-1 text-left w-auto h-min whitespace-nowrap self-center'>
          {menuState.name}
        </div>
        <div
          className='col-span-1 text-right self-end justify-self-end w-min h-min whitespace-nowrap p-2 btn--minus btn mb-2'
          onContextMenu={(event) =>
            handleExitItemPage(
              event,
              item,
              setMenuState,
              setCurrentOrder,
              currentOrder
            )
          }
          onClick={(event) =>
            handleExitItemPage(
              event,
              item,
              setMenuState,
              setCurrentOrder,
              currentOrder
            )
          }>
          Cancel
        </div>
      </div>
      <div className='w-full h-min flex-grow-0 overflow-y-scroll no-scrollbar'>
        <div className='flex flex-row justify-between gap-2 h-auto'>
          {shortcutsHTML}
        </div>
        <div className='flex flex-row flex-wrap  gap-2 pt-2 overflow-y-scroll no-scrollbar flex-grow-0'>
          {addonsHTML}
          <div className='w-72 max-w-full flex-grow flex flex-row '></div>
          <div className='w-72 max-w-full flex-grow flex flex-row '></div>
          <div className='w-72 max-w-full flex-grow flex flex-row '></div>
          <div className='w-72 max-w-full flex-grow flex flex-row '></div>
        </div>
      </div>
      <div className='w-full flex flex-row border-t border-colour mt-auto gap-2 pt-2 h-16'>
        <div className='flex flex-row '>
          <div
            className='btn gradientred w-14 h-auto cnter-items '
            onContextMenu={(event) =>
              handleDecreaseQuantity(event, item, currentOrder, setCurrentOrder)
            }
            onClick={(event) =>
              handleDecreaseQuantity(event, item, currentOrder, setCurrentOrder)
            }>
            <img src={minusSVG} className='w-6 invert-icon' />
          </div>
          <div className=' w-16 h-auto font-mono cnter-items text-2xl'>
            {quantity}
          </div>
          <div
            className='btn gradientgreen w-14 h-auto cnter-items'
            onContextMenu={(event) =>
              handleIncreaseQuantity(event, item, currentOrder, setCurrentOrder)
            }
            onClick={(event) =>
              handleIncreaseQuantity(event, item, currentOrder, setCurrentOrder)
            }>
            <img src={addSVG} className='w-6 invert-icon' />
          </div>
        </div>
        <div className='text-2xl w-full h-auto font-mono cnter-items'>
          €{price}
        </div>
        <div
          className='btn cnter-items gradientgreen w-72'
          onContextMenu={(event) =>
            handleAddToOrder(
              event,
              item,
              setMenuState,
              currentOrder,
              setCurrentOrder,
              order,
              setOrder
            )
          }
          onClick={(event) =>
            handleAddToOrder(
              event,
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
  );
}

function computePrice(item, currentOrder, setCurrentOrder) {
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

function handleAddonToggle(
  event,
  item,
  addon,
  currentOrder,
  setCurrentOrder,
  index
) {
  playBeep();
  //const index = event.target.id;
  log(`Addon ${item.addons[index].name} toggled`);

  if (item.addons[index].selected === true) {
    item.addons[index].selected = false;
    log(`Addon was toggled off`);
  } else {
    item.addons[index].selected = true;
    log(`Addon was toggled on`);
  }

  let quantity;
  if (currentOrder.quantity == undefined) {
    log(`Quantity set to 1`);
    quantity = 1;
  } else {
    log(`Quantity set to ${currentOrder.quantity}`);
    quantity = currentOrder.quantity;
  }

  log(`Current order updated`);
  setCurrentOrder({
    name: item.name,
    price: item.price,
    quantity: quantity,
    priceCheck: item.priceCheck == undefined ? '' : item.priceCheck,
    addons: item.addons,
  });
}

function handleIncreaseQuantity(event, item, currentOrder, setCurrentOrder) {
  playBeep();
  let quantity;
  if (currentOrder.quantity == undefined) {
    quantity = 2;
    log(`Increasing quantity of item from undefined to 2`);
  } else {
    quantity = currentOrder.quantity + 1;
    log(`Increasing quantity of item from ${quantity - 1} to ${quantity}`);
  }

  setCurrentOrder({
    name: item.name,
    price: item.price,
    quantity: quantity,
    priceCheck: item.priceCheck === undefined ? '' : item.priceCheck,
    addons: item.addons,
  });
}

function handleDecreaseQuantity(event, item, currentOrder, setCurrentOrder) {
  playBeep();
  let quantity;
  if (currentOrder.quantity == undefined) {
    log(`Quantity of item was undefined, setting to 1`);
    quantity = 1;
  } else if (currentOrder.quantity == 1) {
    log(`Quantity of item already 1`);
    quantity = 1;
  } else {
    quantity = currentOrder.quantity - 1;
    log(`Decreasing quantity of item from ${quantity + 1} to ${quantity}`);
  }

  setCurrentOrder({
    name: item.name,
    price: item.price,
    quantity: quantity,
    priceCheck: item.priceCheck === undefined ? '' : item.priceCheck,
    addons: item.addons,
  });
}

function handleExitItemPage(
  event,
  item,
  setMenuState,
  setCurrentOrder,
  currentOrder
) {
  playBeep();

  log(`Exiting item page to main menu and deleting current order`);
  setMenuState('');
  setCurrentOrder('');
}

export function handleAddToOrder(
  event,
  item,
  setMenuState,
  currentOrder,
  setCurrentOrder,
  order,
  setOrder
) {
  playBeep();

  let parsedOrder = {};

  parsedOrder.name = item.name;
  parsedOrder.price = computePriceNoQuantity(item, currentOrder);

  if (currentOrder.quantity == undefined) {
    parsedOrder.quantity = 1;
  } else {
    parsedOrder.quantity = currentOrder.quantity;
  }

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
      //Fucky stuff to allow me to edit an element in the array with only the react State shit

      // 1. Make a shallow copy of the array
      let temp_order = order;

      // 2. Make a shallow copy of the element you want to mutate
      let temp_orderItem = temp_order[index];

      // 3. Update the property you're interested in
      temp_orderItem.quantity += parsedOrder.quantity;

      log(`Changing quantity of already existing item in order`);

      // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
      temp_order[index] = temp_orderItem;

      // 5. Set the state to our new copy
      // More fuckery because react doesnt see changing quantity as a change to state, so we have to manually trigger a rerender with this method (destructuring?)

      setOrder([...temp_order]);

      itemWasDupe = true;
    }
  }

  if (!itemWasDupe) {
    log(`Added item ${item.name} to order, was not a duplicate`);
    setOrder((order) => [...order, parsedOrder]);
  }

  log(`Exiting item page`);
  handleExitItemPage(event, item, setMenuState, setCurrentOrder, currentOrder);
}

function computePriceNoQuantity(item, currentOrder) {
  log(`Computing price of individual item ${item.name}`);
  if (currentOrder == '') {
    return item.price;
  } else if (currentOrder.priceCheck == '') {
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

function handleClickShortcut(
  event,
  item,
  setMenuState,
  currentOrder,
  setCurrentOrder,
  order,
  setOrder,
  addons
) {
  playBeep();
  addons.forEach((shortcutAddon) => {
    item.addons.forEach((itemAddon) => {
      if (shortcutAddon.name == itemAddon.name) {
        itemAddon.selected = true;
      }
    });
  });

  if (currentOrder.quantity == undefined) {
    log(`Quantity set to 1`);
    item.quantity = 1;
  } else {
    log(`Quantity set to ${item.quantity}`);
    item.quantity = currentOrder.quantity;
  }

  handleAddToOrder(
    event,
    item,
    setMenuState,
    item,
    setCurrentOrder,
    order,
    setOrder
  );
}
