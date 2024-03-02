import * as React from 'react';

import { handleAddToOrder } from './ItemPage.jsx';
import playBeep from '../../tools/playBeep';

export default function ShortcutBox({
  shortcut,
  item,
  setMenuState,
  currentOrder,
  setCurrentOrder,
  order,
  setOrder,
}) {
  if (shortcut !== undefined) {
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
      <div
        className='btn btn-primary basis-1 flex-grow h-auto flex flex-col justify-between p-2'
        onAuxClick={() =>
          handleClickShortcut(
            item,
            setMenuState,
            currentOrder,
            setCurrentOrder,
            order,
            setOrder,
            addons
          )
        }
        onTouchEnd={() =>
          handleClickShortcut(
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
        <div className='title'>{shortcut.name}</div>
        <div>
          <div className='num text-lg'>€{shortcut.price.toFixed(2)}</div>
          <div className='text-lg'>{addonsString}</div>
        </div>
      </div>
    );
  }
}

function handleClickShortcut(
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
    item.quantity = 1;
  } else {
    item.quantity = currentOrder.quantity;
  }

  handleAddToOrder(item, setMenuState, item, setCurrentOrder, order, setOrder);
}
