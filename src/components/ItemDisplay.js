import * as React from "react";
import * as ReactDOM from "react-dom/client";

import {updateItems, resetMenu} from "../app.jsx";

export default function (items) {
let backButtonCount = 0;

const listItems = items.items.map((item) => {
    //Check if item is a category and adds the category class
    let classes = "listItem";
    if (item.type === "category") {
      classes += " category";
    } else if (item.name === 'backButton') {
      //Checks if item is a backbutton
      if (backButtonCount !== 0) return;
      backButtonCount++;
      classes += " backbutton"
      //duplicate backbuttons were being added, this counter fixes it

      return (
        <div key={item.name}
        id={item.name}
        className={classes} 
        onClick={(event) => handleBackButton(event, item)}
        >
          Back
        </div>
      )
    } else {
      //Add the item class so that we can detect when items are clicked
    }


    return (
      <div
        key={item.name}
        id={item.name}
        className={classes}
        onClick={(event) => handleClick(event, item)}
      >
        <div className="listItemText">{item.name}</div>
      </div>
    );
  });
  return (
    <div id="items">
      {listItems}
      <div className="emptyDiv"></div>
      <div className="emptyDiv"></div>
      <div className="emptyDiv"></div>
      <div className="emptyDiv"></div>
      <div className="emptyDiv"></div>
      <div className="emptyDiv"></div>
      <div className="emptyDiv"></div>
      <div className="emptyDiv"></div>
    </div>
  );
}

const handleClick = (event, item) => {

  // Runs if user has clicked on a category
  if (item.type === "category") {
    const backButton = {
      name: "backButton",
      within: item.name,
    };

    item.items.unshift(backButton);
    updateItems(item.items);
  }
};

const handleBackButton = (event, item) => {
resetMenu();
}

