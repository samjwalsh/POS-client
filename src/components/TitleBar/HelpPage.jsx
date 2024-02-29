import { useState } from 'react';
import * as React from 'react';

import playBeep from '../../tools/playBeep.js';

const useHelpPage = () => {
  const [promise, setPromise] = useState(null);
  const [text, setText] = useState('hullo');

  const confirm = (args) =>
    new Promise((resolve, reject) => {
      if (args) setText(args);
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleCancel = () => {
    playBeep();
    promise?.resolve(false);
    handleClose();
  };

  // You could replace the Dialog with your library's version

  const HelpPageDialog = () => {
    if (promise === null) return;
    else
      return (
        <div className='fixed h-screen w-screen z-50'>
          <div
            className='fixed top-0 left-0 m-0 transparent h-screen w-screen z-50 p-2'
            onAuxClick={handleCancel}
            onTouchEnd={handleCancel}></div>
          <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 background border bc rounded-badge h-full overflow-y-scroll no-scrollbar'>
            Printing Receipts NOTE: The order has to have already been completed
            to print a receipt Tap the red menu button in the top left Tap on
            reports Click the receipt button that corresponds to the order you
            would like to print a receipt for Adding items On the main page tap
            one of the yellow buttons, this will either open a page to configure
            the addons for a specific item, add the item straight away (because
            it has no addons), or open a category in which there are more items.
            Item Pages Going Back At the top is a cancel button to go back to
            the main menu Shortcut Buttons Beneath that are shortcut buttons,
            clicking a shortcut button lets you quickly add a common item. E.G
            if you click the shortcut for a special 99, it is exactly the same
            as if you clicked the addons Flake and Toppings, and then clicked
            the add button at the bottom of the screen. NOTE: Clicking a
            shortcut button just adds on to the buttons you’ve already tapped,
            ie if you had already changed the quantity to 2 before clicking the
            shortcut button for a Special 99, you will add 2 Special 99’s to the
            cart. Addon Buttons Beneath the shortcut buttons are all the addons
            available for the selected item, you can tap each one to add or
            remove it. Quantity Buttons Beneath the addon buttons are the
            quantity buttons and the add button. The quantity buttons allow you
            to increase or decrease the quantity. The add button adds the
            current item to the cart. Categories If you click a category, you
            will see a similar screen to the main menu but the top-left-most
            item turns into a back button to bring you back to the main menu.
            The Cart Items you add on the left side of the screen appear on the
            right side in the cart. Removing Items You can remove an item from
            the cart by tapping the - to the left of the item, likewise you can
            increase the quantity by tapping the + to the right.
          </div>
        </div>
      );
  };
  return [HelpPageDialog, confirm];
};

export default useHelpPage;
