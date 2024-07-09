import * as React from 'react';

import playBeep from '../../tools/playBeep';
import checkSVG from '../../assets/appicons/check.svg';
import { cF } from '../../tools/numbers';
import Button from '../Reusables/Button.jsx';

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
    <div className='w-72 max-w-full flex-grow flex flex-row h-16'>
      <Button
        type='secondary'
        className='flex-grow'
        onClick={() => {
          handleAddonToggle(item, currentOrder, setCurrentOrder, index);
        }}>
        <div className='flex flex-row gap-2'>
          <div className='text-xl'>{addon.name}</div>
          <div className='text-base cnter'>{cF(addon.price)}</div>
        </div>
      </Button>
      {addon.selected ? (
        <Button
          type='success'
          className='aspect-square'
          icon={checkSVG}
          onClick={() => {
            handleAddonToggle(item, currentOrder, setCurrentOrder, index);
          }}></Button>
      ) : (
        ''
      )}
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
