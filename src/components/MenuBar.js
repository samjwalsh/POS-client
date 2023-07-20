import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

export default function (title) {
    title = title.title
    console.log(title)
    return (
        <div id="menuBar">
            <Title 
            title={title}
            />
        </div>
    )
}

function Title (title) {
    return (title.title)
}

export function updateTitle (title) {
const menubar = document.getElementById("menuBar");
const menuRoot = ReactDOM.createRoot(menubar);

menuRoot.render(<Title 
title={title} />)
}



