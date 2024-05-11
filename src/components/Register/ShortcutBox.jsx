import * as React from 'react';

import { handleAddToOrder } from './ItemPage.jsx';
import playBeep from '../../tools/playBeep';
import { cF } from '../../tools/numbers.js';
import Button from '../Reusables/Button.jsx';

export default function ShortcutBox({
  shortcut,
  item,
  setMenuState,
  currentOrder,
  setCurrentOrder,
  order,
  setOrder,
}) {
  if (shortcut == undefined) return;
  let addons = shortcut.addons;
  let addonsString = '';
  if (addons.length > 0) {
    addons.forEach((addon, index) => {
      if (index + 1 !== addons.length) {
        addonsString += `${addon.name}, `;
      } else {
        addonsString += `${addon.name}`;
      }
    });
  } else {
    addonsString = 'No Addons';
  }
  return (
    <Button
      onClick={() => {
        handleClickShortcut(
          item,
          setMenuState,
          currentOrder,
          setCurrentOrder,
          order,
          setOrder,
          addons,
          shortcut.colour
        );
      }}
      type='primary'
      className='basis-1 flex-grow flex flex-col justify-between p-2'
      key={shortcut.name}
      colour={shortcut.colour ? shortcut.colour : undefined}>
      <div className='w-full text-3xl'>{shortcut.name}</div>
      <div className='w-full mt-auto'>
        <div className='num text-lg'>{cF(shortcut.price)}</div>
        <div className='text-lg'>{addonsString}</div>
      </div>
    </Button>
  );
}

function handleClickShortcut(
  item,
  setMenuState,
  currentOrder,
  setCurrentOrder,
  order,
  setOrder,
  addons,
  colour
) {
  if (colour) item.colour = colour;
  playBeep();
  addons.forEach((shortcutAddon) => {
    item.addons.forEach((itemAddon) => {
      if (shortcutAddon.name == itemAddon.name) {
        itemAddon.selected = true;
      }
    });
  });

  if (currentOrder.quantity == undefined) {
    item.quantity = 1;
  } else {
    item.quantity = currentOrder.quantity;
  }

  handleAddToOrder(item, setMenuState, item, setCurrentOrder, order, setOrder);
}
