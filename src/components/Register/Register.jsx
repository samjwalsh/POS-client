import * as React from 'react';

import Order from './Order.jsx';
import Menu from './Menu.jsx';

export default function RegisterState(props) {
  const {
    menuState,
    setMenuState,
    currentOrder,
    setCurrentOrder,
    order,
    setOrder,
  } = props;

  return (
    <div className='grid grid-cols-12 grid-rows-1 h-full mb-0'>
      <Menu
        menuState={menuState}
        setMenuState={setMenuState}
        currentOrder={currentOrder}
        setCurrentOrder={setCurrentOrder}
        order={order}
        setOrder={setOrder}
      />
      <Order order={order} setOrder={setOrder} />
    </div>
  );
}
