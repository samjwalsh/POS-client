import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { useState } from "react";

import getMenu from "../tools/menuAPI";
import { handleAddToOrder } from "./ItemPage.jsx";

import ItemPage from "./ItemPage.jsx";

import log from "../tools/logging";
import playBeep from "../tools/playBeep";

export default function Menu(props) {
  const menuState = props.menuState;
  const setMenuState = props.setMenuState;
  const currentOrder = props.currentOrder;
  const setCurrentOrder = props.setCurrentOrder;
  const order = props.order;
  const setOrder = props.setOrder;

  let items = [];

  if (menuState === "" || menuState.type === "category") {
    if (menuState === "") {
      log(`Rendering default menu`);
      // Render top-level menu if state is ''
      items = getMenu();
    } else if (menuState.type === "category") {
      log(`Rendering a category`);
      items = menuState.items;
      if (items[0].type !== "backButton") {
        log(`Added a back button`);
        items.unshift({
          name: "Back",
          type: "backButton",
        });
      }
    }

    let itemsHTML = [];

    let passProps = {
      setMenuState,
      currentOrder,
      setCurrentOrder,
      order,
      setOrder,
    };

    items.forEach((item) => {
      //Code for adding relevent classes to each item
      let classes = "listItem";
      if (item.type === "category") {
        log(`Added class "category" to ${item.name}`);
        classes += " category";
      } else if (item.type === "backButton") {
        log(`Added class "category" to the back button`);

        classes += " backButton";
      }

      log(`Added item ${item.name} to HTML`);
      itemsHTML.push(
        <div
          key={item.name}
          className={classes}
          id={item.name}
          onClick={(event) => handleItemClick(event, item, passProps)}
        >
          {item.name}
        </div>
      );
    });

    return (
      <div id="menu">
        <div className="items">
          {itemsHTML}
          <div className="emptyDiv"></div>
          <div className="emptyDiv"></div>
          <div className="emptyDiv"></div>
          <div className="emptyDiv"></div>
        </div>
      </div>
    );
  } else if (menuState.modifiers !== undefined) {
    log(`Rendering an item which has modifiers`);
    return (
      <div id="menu">
        {" "}
        <ItemPage
          menuState={menuState}
          setMenuState={setMenuState}
          currentOrder={currentOrder}
          setCurrentOrder={setCurrentOrder}
          order={order}
          setOrder={setOrder}
        />
      </div>
    );
  }
}

function handleItemClick(event, item, props) {
  playBeep();
  const setMenuState = props.setMenuState;
  const currentOrder = props.currentOrder;
  const setCurrentOrder = props.setCurrentOrder;
  const order = props.order;
  const setOrder = props.setOrder;

  log(`Item clicked`);
  if (item.type === "backButton") {
    log(`Item was the back button`);
    setMenuState("");
    //Back button pressed
    return;
  } else if (item.type === undefined && item.modifiers === undefined) {
    log(`Item had no modifiers, adding to order`);
    handleAddToOrder(
      event,
      item,
      setMenuState,
      currentOrder,
      setCurrentOrder,
      order,
      setOrder
    );
    // setMenuState('');
    return;
    // Item with no mods pressed
  } else if (item.type === undefined) {
    log(`Item had modifiers, opening item page`);
    //Item with mods pressed
    setMenuState(item);
  } else {
    // category pressed
    log(`Item was a category, opening category`);
    setMenuState(item);
  }
}
