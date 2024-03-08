import { useState } from 'react';
import * as React from 'react';

import playBeep from '../../tools/playBeep.js';
import Modal from './Modal.jsx';
import ButtonStack from './ButtonStack.jsx';
import Button from './Button.jsx';
const useConfirm = () => {
  const [promise, setPromise] = useState(null);
  const [text, setText] = useState(['Continue?', 'Cancel', 'Confirm']);
  const [danger, setDanger] = useState(false);

  const confirm = (args, danger) =>
    new Promise((resolve, reject) => {
      if (args) setText(args);
      if (danger) setDanger(true);
      setPromise({ resolve });
    });

  const handleClose = () => {
    setText();
    setDanger(false);
    setPromise(null);
  };

  const handleConfirm = () => {
    playBeep();
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    playBeep();
    promise?.resolve(false);
    handleClose();
  };
  const ConfirmationDialog = () => {
    if (promise === null) return;
    else
      return (
        <Modal title={text[0]} text={text[3]} z={50}>
          <ButtonStack>
            <Button
              type='secondary'
              className='flex-grow basis-1'
              onClick={handleCancel}>
              {text[1]}
            </Button>
            <Button
              type={danger ? 'danger' : 'primary'}
              className='flex-grow basis-1'
              onClick={handleConfirm}>
              {text[2]}
            </Button>
          </ButtonStack>
        </Modal>
      );
  };
  return [ConfirmationDialog, confirm];
};

export default useConfirm;
