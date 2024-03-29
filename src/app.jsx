import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { useState } from 'react';

import './index.css';
import './fonts.css';

import Register from './components/Register/Register.jsx';
import Reports from './components/Reports/Reports.jsx';
import Settings, { executeSettings } from './components/Settings/Settings.jsx';

import HamburgerMenu from './components/TitleBar/HamburgerMenu.jsx';
import { getSettings } from './tools/ipc.js';

const domNode = document.getElementById('App');
const root = ReactDOM.createRoot(domNode);

(async () => {
  const settings = await getSettings();
  executeSettings(settings);
})();

function App() {
  const [appState, setAppState] = useState('Register');

  const [menuState, setMenuState] = useState('');
  const [currentOrder, setCurrentOrder] = useState('');
  const [order, setOrder] = useState([]);

  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  const [updateOrders, setUpdateOrders] = useState(false);

  const [settings, setSettings] = useState();

  return (
    <div className='flex flex-col h-screen'>
      <HamburgerMenu
        hamburgerOpen={hamburgerOpen}
        setHamburger={setHamburgerOpen}
        appState={appState}
        setAppState={setAppState}
        order={order}
        setOrder={setOrder}
        updateOrders={updateOrders}
        setUpdateOrders={setUpdateOrders}
      />

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
            return (
              <Reports
              updateOrders={updateOrders}
              setUpdateOrders={setUpdateOrders}
              />
            );
          } else if (appState === 'Settings') {
            return <Settings settings={settings} setSettings={setSettings} />;
          }
        })()}
      </div>
    </div>
  );
}

root.render(<App />);
