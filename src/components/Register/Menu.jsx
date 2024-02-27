import * as React from 'react';

import getMenu from '../../tools/menuAPI';
import { handleAddToOrder } from './ItemPage.jsx';

import undoSVG from '../../assets/appicons/undo.svg';

import ItemPage from './ItemPage.jsx';

import playBeep from '../../tools/playBeep';

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
        <div
          key={item.name}
          className={`${
            item.name === 'Back'
              ? 'btn-error'
              : 'btn-neutral text-neutral-content'
          } ${classes}`}
          id={item.name}
          onContextMenu={() => handleItemClick(item, passProps)}
          onClick={() => handleItemClick(item, passProps)}>
          {item.name === 'Back' ? (
            <img src={undoSVG} className='w-8 invert-icon' />
          ) : (
            item.name
          )}
        </div>
      );
    });

    return (
      <div className='col-span-8 row-span-1 flex flex-wrap gap-2 p-2 overflow-y-scroll no-scrollbar content-start'>
        {itemsHTML}
        <div className='menu-itm-filler'></div>
        <div className='menu-itm-filler'></div>
        <div className='menu-itm-filler'></div>
      </div>
    );
  } else if (menuState.modifiers !== undefined) {
    return (
      <div className='col-span-8 row-span-1'>
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
