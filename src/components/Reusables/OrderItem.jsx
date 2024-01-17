import * as React from 'react';

export default function OrderItem({ orderItem, index }) {
  return (
    <div className='w-full grid grid-cols-1 grid-rows-[min-content_min-content] text-base py-1 px-2 rounded-btn bg-neutral text-neutral-content'>
      <div className='flex flex-row justify-between'>
        <div className='pr-1'>
          {orderItem.name +
            (orderItem.quantity > 1 ? ` (${orderItem.quantity})` : '')}
        </div>
        <div className=' text-right num'>
          €{(orderItem.price * orderItem.quantity).toFixed(2)}
        </div>
      </div>
      <div className='flex flex-row justify-between'>
        <div className='pr-4 text-sm'>
          {orderItem.addons === undefined ? '' : orderItem.addons.join(', ')}
        </div>
        <div className='text-right num text-sm whitespace-nowrap'>
          €{orderItem.price.toFixed(2)} EA
        </div>
      </div>
    </div>
  );
}
