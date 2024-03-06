import * as React from 'react';
import { cF } from '../../tools/numbers';

export default function OrderItem({ orderItem, index }) {
  return (
    <div className='w-full grid grid-cols-1 grid-rows-[min-content_min-content] text-base py-1 px-2 rounded-btn border bc bg-secondary text-secondary-content'>
      <div className='flex flex-row justify-between'>
        <div className='pr-1 font-bold'>
          {orderItem.name +
            (orderItem.quantity > 1 ? ` (${orderItem.quantity})` : '')}
        </div>
        <div className=' text-right num font-bold'>
          {cF(orderItem.price * orderItem.quantity)}
        </div>
      </div>
      <div className='flex flex-row justify-between'>
        <div className='pr-4 text-sm'>
          {orderItem.addons === undefined ? '' : orderItem.addons.join(', ')}
        </div>
        <div className='text-right num text-sm whitespace-nowrap'>
          {cF(orderItem.price)} EA
        </div>
      </div>
    </div>
  );
}
