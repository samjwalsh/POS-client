import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { useState } from 'react';

import './index.css';

import Register from './components/Register/Register.jsx';
import Reports from './components/Reports.jsx';
import Settings, { executeSettings } from './components/Settings.jsx';

import HamburgerMenu from './components/TitleBar/HamburgerMenu.jsx';
import { getSettings } from './tools/ipc.js';

const domNode = document.getElementById('App');
const root = ReactDOM.createRoot(domNode);

(async () => {
  const settings = await getSettings();
  executeSettings(settings);
})();

function App() {
  const [appState, setAppState] = useState('Settings');

  const [menuState, setMenuState] = useState('');
  const [currentOrder, setCurrentOrder] = useState('');
  const [order, setOrder] = useState([]);

  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  const [settings, setSettings] = useState();

  return (
    <div className='flex flex-col h-screen'>
      <div className=''>
        <HamburgerMenu
          hamburgerOpen={hamburgerOpen}
          setHamburger={setHamburgerOpen}
          appState={appState}
          setAppState={setAppState}
        />
      </div>
      <div className='overflow-y-hidden h-full'>
        {(() => {
          if (appState === 'Register') {
            return (
              <Register
                menuState={menuState}
                setMenuState={setMenuState}
                currentOrder={currentOrder}
                setCurrentOrder={setCurrentOrder}
                order={order}
                setOrder={setOrder}
              />
            );
          } else if (appState === 'Reports') {
            return <Reports />;
          } else if (appState === 'Settings') {
            return <Settings settings={settings} setSettings={setSettings} />;
          }
        })()}
      </div>
    </div>
  );
}

root.render(<App />);
