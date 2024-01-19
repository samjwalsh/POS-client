import * as React from 'react';

export default function OrdersStats({ orders }) {
  let cashTotal = 0;
  let cardTotal = 0;

  let quantityItems = 0;
  for (const order of orders) {
    if (order.paymentMethod === 'Card') {
      cardTotal += order.subtotal;
    } else {
      cashTotal += order.subtotal;
    }
    for (const item of order.items) {
      if (item.quantity === undefined) {
        quantityItems++;
      } else {
        quantityItems += item.quantity;
      }
    }
  }

  const xTotal = cashTotal + cardTotal;

  return (
    <div className='flex flex-col w-full text-2xl p-2 pt-0 gap-2'>
      <div className='flex flex-row w-full justify-between border-b border-colour pb-2'>
        <div className=''>Cash:</div>
        <div className='num text-right justify-end'>
          €{cashTotal.toFixed(2)}
        </div>
      </div>
      <div className='flex flex-row w-full justify-between border-b border-colour pb-2'>
        <div className=''>Card:</div>
        <div className='num text-right justify-end '>
          €{cardTotal.toFixed(2)}
        </div>
      </div>
      <div className='flex flex-row w-full justify-between pb-2 font-bold'>
        <div className=''>X-Total:</div>
        <div className='num text-right justify-end'>€{xTotal.toFixed(2)}</div>
      </div>
      <div className='flex flex-row w-full justify-between pb-2 text-xl'>
        <div className=''></div>
      </div>
      <div className='flex flex-row w-full justify-between border-b border-colour pb-2 text-base'>
        <div className=''>No. Orders:</div>
        <div className='num text-right justify-end'>{orders.length}</div>
      </div>
      <div className='flex flex-row w-full justify-between border-b border-colour pb-2 text-base'>
        <div className=''>No. Items:</div>
        <div className='num text-right justify-end'>{quantityItems}</div>
      </div>
      <div className='flex flex-row w-full justify-between pb-2 text-base'>
        <div className=''>Average Sale:</div>
        <div className='num text-right justify-end'>
          €{(xTotal / (orders.length === 0 ? 1 : orders.length)).toFixed(2)}
        </div>
      </div>
    </div>
  );
}
