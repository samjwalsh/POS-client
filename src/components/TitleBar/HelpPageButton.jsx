import React, { useState, useEffect } from 'react';

import question from '../../assets/appicons/question.svg';

import useHelpPage from './HelpPage.jsx';

export default function HelpPageButton() {
  const [HelpPage, help] = useHelpPage()
  ;
  async function openHelp() {
    const result = await useHelpPage();
  }

  return (
    <>
    <HelpPage/>
      <div className='h-full cnter-items positiveFill'>
        <img
          src={question}
          className='w-8 invert-icon cnter-items h-full'
          onContextMenu={() => {
            help('hullo');
          }}
          onClick={() => {
            help('hullo');
          }}
        />
      </div>
    </>
  );
}
