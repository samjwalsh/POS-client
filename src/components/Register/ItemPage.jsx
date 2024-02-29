import * as React from 'react';

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
    playBeep();
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
    } else {
      item.priceCheck = addon.priceCheck;
    }
  }

  let quantity;
  if (currentOrder.quantity === undefined) {
    quantity = 1;
  } else {
    quantity = currentOrder.quantity;
  }

  const price = computePrice(item, currentOrder, setCurrentOrder).toFixed(2);
  return (
    <>
      <Alert />
      <div className='flex flex-col h-full content-start'>
        <div className='grid grid-cols-2 grid-rows-1 h-min p-2 border-b bc'>
          <div className='col-span-1 text-left w-auto h-full whitespace-nowrap mt-2 title'>
            {menuState.name}
          </div>
          <div className='col-span-1 text-right self-end justify-self-end flex flex-row gap-4'>
            <button
              className='whitespace-nowrap text-lg btn btn-primary'
              onAuxClick={() => handleClickHelp()}
              onTouchEnd={() => handleClickHelp()}>
              Help
            </button>
            <button
              className='col-span-1 text-right self-end justify-self-end w-min h-min whitespace-nowrap p-2 text-lg btn btn-error'
              onAuxClick={() =>
                handleExitItemPage(setMenuState, setCurrentOrder)
              }
              onTouchEnd={() =>
                handleExitItemPage(setMenuState, setCurrentOrder)
              }>
              Cancel
            </button>
          </div>
        </div>
        <div className='w-full h-full flex-grow flex flex-col '>
          <div className='flex flex-row gap-2 flex-grow border-b bc p-2 max-h-[14rem] min-h-[10rem]'>
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
          <div className='flex flex-row flex-wrap gap-2 p-2 overflow-y-scroll no-scrollbar'>
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
        <div className='w-full flex flex-row mt-auto gap-2 p-2 h-16 border-t bc'>
          <div className='flex flex-row '>
            <div
              className='w-14 h-auto cnter-items btn btn-error '
              onAuxClick={() =>
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
              <img src={minusSVG} className='w-6 icon' />
            </div>
            <div className=' w-16 h-auto num cnter-items text-2xl'>
              {quantity}
            </div>
            <div
              className='btn btn-success w-14 h-auto cnter-items'
              onAuxClick={() =>
                handleChangeQuantity(item, currentOrder, setCurrentOrder, 'up')
              }
              onTouchEnd={() =>
                handleChangeQuantity(item, currentOrder, setCurrentOrder, 'up')
              }>
              <img src={addSVG} className='w-6 icon' />
            </div>
          </div>
          <div className='text-2xl w-full h-auto num cnter-items'>€{price}</div>
          <div
            className='btn btn-primary text-xl h-full positive w-48'
            onAuxClick={() =>
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
      order[index].quantity += parsedOrder.quantity;
      setOrder([...order]);
      itemWasDupe = true;
    }
  }

  if (!itemWasDupe) {
    setOrder((order) => [...order, parsedOrder]);
  }

  handleExitItemPage(setMenuState, setCurrentOrder);
}

function computePriceNoQuantity(item, currentOrder) {
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
    const addonsCost = currentOrder.priceCheck(currentOrder.addons);
    return currentOrder.price + addonsCost;
  }
}

function arrayEquals(a, b) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}
