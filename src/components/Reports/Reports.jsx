import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { useState, useEffect } from "react";

import log from "../../tools/logging";

import { getAllOrders } from "../../tools/ipc";
import playBeep from "../../tools/playBeep";

import hamburger from "../../assets/hamburger.svg";

export default function Reports(props) {
  const [orders, setOrders] = useState([]);

  const setHamburgerOpen = props.setHamburgerOpen;

  useEffect(() => {
    (async () => {
      const localOrders = await getAllOrders();
      setOrders(localOrders);
    })();
  }, []);

  console.log(orders);

  const ordersHTML = [];
  if (Array.isArray(orders)) {
    orders.forEach((order, index) => {
      ordersHTML.push(<div id={index}>order</div>);
    });
  }

  return (
    <div className="reports">
      <div className="reportsTitleBar">
        <div
          id="hamburgerIcon"
          onClick={(event) =>
            handleClickHamburger(event, setHamburgerOpen)
          }
        >
          <img src={hamburger} id="hamburgerSVG" />
        </div>
      </div>
      <div className="reportsOrders">{ordersHTML}</div>
    </div>
  );
}

function handleClickHamburger(event, setHamburgerOpen) {
  playBeep();
  setHamburgerOpen(true);
}
