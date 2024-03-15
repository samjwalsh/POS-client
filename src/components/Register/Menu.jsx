import * as React from 'react';

import { getMenu } from '../../tools/menuAPI.js';

import { handleAddToOrder } from './ItemPage.jsx';

import undoSVG from '../../assets/appicons/undo.svg';

import ItemPage from './ItemPage.jsx';

import playBeep from '../../tools/playBeep';
import Button from '../Reusables/Button.jsx';

export default function Menu(props) {
  const menuState = props.menuState;
  const setMenuState = props.setMenuState;
  const currentOrder = props.currentOrder;
  const setCurrentOrder = props.setCurrentOrder;
  const order = props.order;
  const setOrder = props.setOrder;

  let items = [];

  if (menuState === '' || menuState.type === 'category') {
    if (menuState === '') {
      // Render top-level menu if state is ''
      items = getMenu();
    } else if (menuState.type === 'category') {
      items = menuState.items;
      if (items[0].type !== 'backButton') {
        items.unshift({
          name: 'Back',
          type: 'backButton',
        });
      }
    }

    let itemsHTML = [];

    let passProps = {
      setMenuState,
      currentOrder,
      setCurrentOrder,
      order,
      setOrder,
    };

    items.forEach((item) => {
      //Code for adding relevent classes to each item
      let classes = 'menu-itm';

      itemsHTML.push(
        <Button
          key={item.name}
          type={`${item.name === 'Back' ? 'danger' : 'secondary'}`}
          onClick={() => handleItemClick(item, passProps)}
          className={classes}>
          {item.name === 'Back' ? (
            <img src={undoSVG} className='w-8 icon icon-danger' />
          ) : (
            <>
              {item.name}
              {/* <img src={item.icon} className='w-12 menuicon' /> */}
            </>
          )}
        </Button>
        // <div
        //   key={item.name}
        //   className={`${
        //     item.name === 'Back'
        //       ? 'btn-error'
        //       : 'btn-neutral text-neutral-content'
        //   } ${classes}`}
        //   id={item.name}
        //   onAuxClick={() => handleItemClick(item, passProps)}
        //   onTouchEnd={() => handleItemClick(item, passProps)}>
        //   {item.name === 'Back' ? (
        //     <img src={undoSVG} className='w-10 icon' />
        //   ) : (
        //     <div className='h-full w-full flex flex-col justify-between'>
        //       <div className='ml-auto'>
        // {/* <img src={item.icon} className='w-12 menuicon' />  */}
        //       </div>
        //       {item.name}
        //     </div>
        //   )}
        // </div>
      );
    });

    return (
      <div className='col-span-8 row-span-1 flex flex-wrap gap-x-2 pt-2 px-2 overflow-y-scroll no-scrollbar content-start'>
        {itemsHTML}
        <div className='menu-itm-filler'></div>
        <div className='menu-itm-filler'></div>
        <div className='menu-itm-filler'></div>
        <div className='menu-itm-filler'></div>
        <div className='menu-itm-filler'></div>
        <div className='menu-itm-filler'></div>
        <div className='menu-itm-filler'></div>
        <div className='menu-itm-filler'></div>
        <div className='menu-itm-filler'></div>
        <div className='menu-itm-filler'></div>
      </div>
      // <div className='col-span-8 row-span-1 grid grid-rows-4 grid-cols-3 gap-2 p-2'>
      //   {itemsHTML}
      // </div>
      // Put the following in index.css to use grid for menu items
      // .menu-itm {
      //   @apply btn p-2 text-left text-[1.7rem] items-end justify-start text-neutral-content row-span-1 col-span-1 h-full;
      // }
    );
  } else if (menuState.modifiers !== undefined) {
    return (
      <div className='col-span-8 row-span-1 '>
        <ItemPage
          menuState={menuState}
          setMenuState={setMenuState}
          currentOrder={currentOrder}
          setCurrentOrder={setCurrentOrder}
          order={order}
          setOrder={setOrder}
        />
      </div>
    );
  }
}

function handleItemClick(item, props) {
  playBeep();
  const setMenuState = props.setMenuState;
  const currentOrder = props.currentOrder;
  const setCurrentOrder = props.setCurrentOrder;
  const order = props.order;
  const setOrder = props.setOrder;

  if (item.type === 'backButton') {
    setMenuState('');
    //Back button pressed
    return;
  } else if (item.type === undefined && item.modifiers === undefined) {
    handleAddToOrder(
      item,
      setMenuState,
      currentOrder,
      setCurrentOrder,
      order,
      setOrder
    );
    // setMenuState('');
    return;
    // Item with no mods pressed
  } else if (item.type === undefined) {
    //Item with mods pressed
    setMenuState(item);
  } else {
    // category pressed
    setMenuState(item);
  }
}
