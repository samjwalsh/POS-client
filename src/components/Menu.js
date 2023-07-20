import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import ItemDisplay from './ItemDisplay'

export default function({menu}) {

    return (
        <div id="menu">
            <ItemDisplay
            items={menu}
            />
        </div>
    )
}