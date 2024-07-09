import * as React from 'react';
import { cF } from '../../tools/numbers';
import Color from "colorjs.io/dist/color.js";

export default function OrderItem({ orderItem, index }) {
  let style = {};
  if (orderItem.colour && false) {
    let colourObj = new Color(orderItem.colour);
    let colourStr = colourObj.toString();
    let white = new Color('white');
    let black = new Color('black');
    let whiteContrast = colourObj.contrast(white, 'Lstar');
    let blackContrast = colourObj.contrast(black, 'Lstar');
    if (whiteContrast > blackContrast) {
      style.color = white.toString();
    } else {
      style.color = black.toString();
    }
    style.background = colourStr;
  }
  return (
    <div className='w-full min-h-[3.5rem] flex flex-col justify-between text-base py-1 px-2 bg-secondary text-secondary-content'
    style={style ? style : undefined}>
      <div className='flex flex-row justify-between text-lg'>
        <div className='pr-1'>
          {orderItem.name +
            (orderItem.quantity > 1 ? ` (${orderItem.quantity})` : '')}
        </div>
        <div className=' text-right num whitespace-nowrap'>
          {cF(orderItem.price * orderItem.quantity)}
        </div>
      </div>
      <div className='flex flex-row justify-between text-sm'>
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
