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

  let ordersHTML;
  if (Array.isArray(orders)) {
    ordersHTML = orders.map((order, index) => {
      let itemsHTML = order.items.map((item) => {
        return (
          <div className="reportsOrderItem">
            {item.name}
          </div>
        );
      });

      const orderDate = new Date(order.time);

      return (
        <div key={order.time}>
          Date:{" "}
          {orderDate.getDate() +
            "/" +
            (orderDate.getMonth() + 1) +
            "/" +
            orderDate.getFullYear() +
            " " +
            orderDate.getHours() +
            ":" +
            orderDate.getMinutes() +
            ":" +
            orderDate.getSeconds()}{" "}
          <br />
          Total:{Math.round(order.subtotal, 2)} (
          {order.paymentMethod}) Items:
          {itemsHTML}
        </div>
      );
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
