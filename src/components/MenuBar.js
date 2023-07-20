import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

export default function (title) {
    return (
        <div id="menuBar">
            {title.title}
        </div>
    )
}