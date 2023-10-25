import * as React from 'react';

import hamburger from '../assets/appicons/hamburger.svg';

import playBeep from '../tools/playBeep';

export default function TitleBar (props) {
    const {setHamburger} = props
    return (
        <div className='p-2 border-b-2 border-colour'>
          <div
            className='btn gradient1 w-8'
            onClick={(e) => handleClickHamburger(setHamburger)}>
            <img src={hamburger} id='hamburgerSVG' className='w-8' />
          </div>
        </div>
      );
}

function handleClickHamburger( setHamburger) {
    playBeep();
    setHamburger(true);
  }