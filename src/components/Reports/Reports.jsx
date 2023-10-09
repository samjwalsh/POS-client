import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { useState, useEffect } from "react";

import log from "../../tools/logging";

import { getAllOrders, removeAllOrders } from "../../tools/ipc";
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

  console.log(orders);

  let ordersHTML;
  if (Array.isArray(orders)) {
    ordersHTML = orders.map((order, index) => {
      //Should fix bugs on machines where the adjustment has a value instead of price

      if (order.price === undefined) {
        removeAllOrders();
      }

      let itemsHTML = order.items.map((item) => {
        let formattedQuantity = "";
        if (item.quantity === 1 || item.quantity === undefined) {
        } else {
          formattedQuantity = `(${item.quantity})`;
        }

        let formattedAddons = "";
        if (Array.isArray(item.addons)) {
          formattedAddons = item.addons.join(", ");
        }

        // the adjustment doesnt have a quantity, fix this

        return (
          <div className="reportsOrderItem">
            <div className="reportsOrderItemName">
              {item.name} {formattedQuantity}
            </div>
            <div className="reportsOrderTotalPrice">
              €{(item.price * item.quantity).toFixed(2)}
            </div>
            <div className="reportsOrderPriceEach">
              €{item.price.toFixed(2)} EA
            </div>
            <div className="reportsOrderAddons">{formattedAddons}</div>
          </div>
        );
      });
      const orderDateString = calculateDateString(order.time);

      console.log(order);

      return (
        <div key={order.time} className="reportsOrder">
          <div className="reportsOrderTableOrderNo">
            Order No. {orders.length - index}
          </div>
          <div className="reportsOrderTableDeleteOrder"> X </div>
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
            {order.subtotal.toFixed(2)}
          </div>
          <div className="reportsOrderTableTitle reportsOrderTableTitlePayment">
            Payment:
          </div>
          <div className="reportsOrderTableValue reportsOrderTableValuePayment">
            {order.paymentMethod}
          </div>
          <div className="reportsOrderTableItems">{itemsHTML}</div>
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
      <div className="reportsOrders">
        {ordersHTML}
        <div className="reportsOrderFiller"></div>
        <div className="reportsOrderFiller"></div>
        <div className="reportsOrderFiller"></div>
        <div className="reportsOrderFiller"></div>
        <div className="reportsOrderFiller"></div>
      </div>
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
