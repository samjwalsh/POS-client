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
      setOrders(localOrders.reverse());
    })();
  }, []);

  // {
  //   paymentMethod: 'Cash',
  //   time: 1696614274500,
  //   subtotal: 11.25,
  //   items: [
  //     { name: 'Family Special', price: 10, quantity: 1, addons: [] },
  //     { name: 'Adjustment', value: 1.25 }
  //   ]
  // }

  let ordersHTML;
  if (Array.isArray(orders)) {
    ordersHTML = orders.map((order, index) => {
      let itemsHTML = order.items.map((item) => {
        return <div className="reportsOrderItem">{item.name}</div>;
      });

      const orderDateString = calculateDateString(order.time);

      return (
        <div key={order.time} className="reportsOrder">
            <div className="reportsOrderTableDeleteOrder">X</div>
            <div className="reportsOrderTableTitle reportsOrderTableTitleTime ">
              Time:
            </div>
            <div className="reportsOrderTableValue reportsOrderTableValueTime">
              {orderDateString}
            </div>
            <div className="reportsOrderTableTitle reportsOrderTableTitleSubTotal">
              Subtotal:
            </div>
            <div className="reportsOrderTableValue reportsOrderTableValueSubTotal">
              {Math.round(order.subtotal).toFixed(2)}
            </div>
            <div className="reportsOrderTableTitle reportsOrderTableTitlePayment">
              Payment:
            </div>
            <div className="reportsOrderTableValue reportsOrderTableValuePayment">
              {order.paymentMethod}
            </div>
            <div className="reportsOrderTableItems"></div>
          </div>
      );
    });
  }

  return (
    <div className="reports">
      <div className="reportsTitleBar">
        <div
          id="hamburgerIcon"
          onClick={(event) => handleClickHamburger(event, setHamburgerOpen)}
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

function calculateDateString(time) {
  const date = new Date(time);

  let dateString = "";
  dateString += date.getHours().toString().padStart(2, "0");
  dateString += ":";
  dateString += date.getMinutes().toString().padStart(2, "0");
  dateString += ":";
  dateString += date.getSeconds().toString().padStart(2, "0");
  // dateString += " ";
  // dateString += date.getDate().toString().padStart(2, "0");
  // dateString += "/";
  // dateString += date.getMonth().toString().padStart(2, "0");
  // dateString += "/";
  // dateString += date.getFullYear().toString().padStart(2, "0");

  return dateString;
}
