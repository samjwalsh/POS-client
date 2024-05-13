import * as React from 'react';
import RollingRevenue from './RollingRevenue.jsx';
import { cF, nF } from '../../tools/numbers.js';
import { calculateDateString } from './Reports.jsx';

export default function OrdersStats({ stats }) {
  const {
    cashTotal,
    cardTotal,
    quantityItems,
    quantityOrders,
    averageSale,
    xTotal,
    reconcilledCard,
    reconcilledCash,
    mostRecentReconcilliation
  } = stats;
  return (
    <div className='flex flex-col w-full text-2xl p-2 pt-0 gap-2'>
      <div className='flex flex-row w-full justify-between bc'>
        <div className=''>Cash:</div>
        <div className='num text-right justify-end'>{cF(cashTotal)}</div>
      </div>
      <div className='flex flex-row w-full justify-between border-b bc pb-2 text-base'>
        <div className=''>Of Which Adjusted:</div>
        <div className='num text-right justify-end'>{cF(reconcilledCash)}</div>
      </div>
      <div className='flex flex-row w-full justify-between bc'>
        <div className=''>Card:</div>
        <div className='num text-right justify-end '>{cF(cardTotal)}</div>
      </div>
      <div className='flex flex-row w-full justify-between border-b bc pb-2 text-base'>
        <div className=''>Of Which Adjusted:</div>
        <div className='num text-right justify-end'>{cF(reconcilledCard)}</div>
      </div>
      <div className='flex flex-row w-full justify-between pb-2 font-bold '>
        <div className=''>X-Total:</div>
        <div className='num text-right justify-end'>{cF(xTotal)}</div>
      </div>
      <div className='flex flex-row w-full justify-between border-b bc pb-2 text-base'>
        <div className=''>Last Updated:</div>
        <div className='num text-right justify-end'>{new Date(mostRecentReconcilliation).toLocaleTimeString()}</div>
      </div>
      <div className='flex flex-row w-full justify-between border-b bc pb-2 text-base'>
        <div className=''>No. Orders:</div>
        <div className='num text-right justify-end'>{nF(quantityOrders)}</div>
      </div>
      {/* <div className='flex flex-row w-full justify-between border-b bc pb-2 text-base'>
        <div className=''>No. Items:</div>
        <div className='num text-right justify-end'>{nF(quantityItems)}</div>
      </div> */}
      <div className='flex flex-row w-full justify-between border-b bc pb-2 text-base'>
        <div className=''>Average Sale:</div>
        <div className='num text-right justify-end'>{cF(averageSale)}</div>
      </div>
      <RollingRevenue />
    </div>
  );
}
