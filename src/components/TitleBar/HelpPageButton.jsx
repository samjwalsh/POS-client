import React, { useState, useEffect } from 'react';

import question from '../../assets/appicons/question.svg';

import useHelpPage from './HelpPage.jsx';

export default function HelpPageButton() {
  const [HelpPage, help] = useHelpPage();

  async function useHelp() {
    const result = await help();
  }

  return (
    <>
      <HelpPage />
      <div className='h-full cnter-items primary'>
        <img
          src={question}
          className='w-8 icon cnter-items h-full'
          onContextMenu={useHelp}
          onClick={useHelp}
        />
      </div>
    </>
  );
}
