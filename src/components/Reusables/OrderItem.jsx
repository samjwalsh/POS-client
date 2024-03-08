import * as React from 'react';
import { cF } from '../../tools/numbers';

export default function OrderItem({ orderItem, index }) {
  return (
    <div className='w-full min-h-[3.5rem] flex flex-col justify-between text-base py-1 px-2 bg-secondary text-secondary-content'>
      <div className='flex flex-row justify-between text-lg'>
        <div className='pr-1'>
          {orderItem.name +
            (orderItem.quantity > 1 ? ` (${orderItem.quantity})` : '')}
        </div>
        <div className=' text-right num'>
          {cF(orderItem.price * orderItem.quantity)}
        </div>
      </div>
      <div className='flex flex-row justify-between text-base'>
        <div className='pr-4'>
          {orderItem.addons === undefined ? '' : orderItem.addons.join(', ')}
        </div>
        <div className='text-right num whitespace-nowrap'>
          {cF(orderItem.price)} EA
        </div>
      </div>
    </div>
  );
}
