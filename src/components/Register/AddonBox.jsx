import * as React from 'react';

import playBeep from '../../tools/playBeep';
import log from '../../tools/logging';

export default function AddonBox({
  addon,
  index,
  item,
  currentOrder,
  setCurrentOrder,
}) {
  if (currentOrder.addons == undefined) {
    addon.selected = false;
  }
  return (
    <div
      className='w-72 max-w-full flex-grow flex flex-row h-16'
      id={index}
      onContextMenu={() => {
        handleAddonToggle(item, currentOrder, setCurrentOrder, index);
      }}
      onTouchEnd={() => {
        handleAddonToggle(item, currentOrder, setCurrentOrder, index);
      }}>
      <div className='flex flex-row justify-between w-full gap-2'>
        <div className='flex-grow flex flex-row justify-between p-2 btn-neutral btn h-full'>
          <div className='flex flex-row gap-2'>
            <div className='text-xl cnter-items'>{addon.name}</div>
            <div className='num cnter-items'>€{addon.price.toFixed(2)}</div>
          </div>
          <div className='cnter-items h-full'>
            <input
              readOnly
              type='checkbox'
              checked={addon.selected ? 'checked' : ''}
              className='checkbox checkbox-lg checkbox-secondary border-0 '
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function handleAddonToggle(item, currentOrder, setCurrentOrder, index) {
  playBeep();
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
