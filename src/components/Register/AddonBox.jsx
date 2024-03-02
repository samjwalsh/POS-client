import * as React from 'react';

import playBeep from '../../tools/playBeep';
import checkSVG from '../../assets/appicons/check.svg';

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
      className='w-72 max-w-full flex-grow flex flex-row h-auto min-h-[3.5rem]'
      id={index}
      onAuxClick={() => {
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
            {addon.selected ? (
              <img src={checkSVG} className='w-8 icon border bc' />
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function handleAddonToggle(item, currentOrder, setCurrentOrder, index) {
  playBeep();

  if (item.addons[index].selected === true) {
    item.addons[index].selected = false;
  } else {
    item.addons[index].selected = true;
  }

  let quantity;
  if (currentOrder.quantity == undefined) {
    quantity = 1;
  } else {
    quantity = currentOrder.quantity;
  }

  setCurrentOrder({
    name: item.name,
    price: item.price,
    quantity: quantity,
    priceCheck: item.priceCheck == undefined ? '' : item.priceCheck,
    addons: item.addons,
  });
}
