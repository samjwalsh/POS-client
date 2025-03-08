import { useState } from 'react';
import * as React from 'react';

import playBeep from '../../tools/playBeep.js';
import Modal from './Modal.jsx';
import Button from './Button.jsx';
import ButtonStack from './ButtonStack.jsx';
const useAlert = () => {
  const [promise, setPromise] = useState(null);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');

  const alert = (title, text) =>
    new Promise((resolve, reject) => {
      if (text) setText(text);
      if (title) setTitle(title);
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    playBeep();
    promise?.resolve(true);
    handleClose();
  };

  const alertDialog = () => {
    if (promise === null) return;
    else
      return (
        <Modal title={title} text={text} z={50}>
          <ButtonStack>
            <Button
              type='primary'
              className='w-full'
              onClick={handleConfirm}
              onClick={handleConfirm}>
              Okay
            </Button>
          </ButtonStack>
        </Modal>
      );
  };
  return [alertDialog, alert];
};
export default useAlert;
