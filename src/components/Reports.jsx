import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { useState, useEffect } from "react";

import log from "../tools/logging";

import {
  getAllOrders,
  overwriteOrders,
  removeAllOrders,
  removeOrder,
} from "../tools/ipc";
import playBeep from "../tools/playBeep";

export default function Reports(props) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    (async () => {
      const localOrders = await getAllOrders();
      setOrders(localOrders.reverse());
    })();
  }, []);

  return (
    <div className="reports">
      <div className="ordersTitle titleStyle y">Orders</div>
      <div className="reportsTitle titleStyle y">Reports</div>
      <div className="reportsOrders">
        {createOrdersHTML(orders, setOrders)}
        <div className="reportsOrderFiller"></div>
        <div className="reportsOrderFiller"></div>
      </div>
      {reportsStatsHTML(orders, setOrders)}
    </div>
  );
}

function reportsStatsHTML(orders, setOrders) {
  return (
    <div className="reportsStats">
      {createReportsStatsInfo(orders, setOrders)}
      <div className="reportsStatsButtonsContainer">
        <div
          className="reportsStatsButtons button b"
          onClick={(event) => handleDeleteOldOrders(orders, setOrders)}
        >
          Del. Old Orders
        </div>
        <div
          className="reportsStatsButtons button r"
          onClick={(event) => handleEndOfDay(orders, setOrders)}
        >
          End Of Day
        </div>
      </div>
    </div>
  );
}

function createReportsStatsInfo(orders, setOrders) {
  let cashTotal = 0;
  let cardTotal = 0;

  orders.forEach((order) => {
    if (order.paymentMethod === "Card") {
      cardTotal += order.subtotal;
    } else {
      cashTotal += order.subtotal;
    }
  });

  let xTotal = cashTotal + cardTotal;

  return (
    <div className="reportsStatsInfoTable">
      <div className="reportsStatsInfoTableEntry">
        <div className="reportsStatsInfoTableEntryKey">Cash:</div>
        <div className="reportsStatsInfoTableEntryValue">
          €{cashTotal.toFixed(2)}
        </div>
      </div>
      <div className="reportsStatsInfoTableEntry">
        <div className="reportsStatsInfoTableEntryKey">Card:</div>
        <div className="reportsStatsInfoTableEntryValue">
          €{cardTotal.toFixed(2)}
        </div>
      </div>
      <div className="reportsStatsInfoTableEntry reportsStatsInfoTableEntryLast">
        <div className="reportsStatsInfoTableEntryKey">X-Total:</div>
        <div className="reportsStatsInfoTableEntryValue">
          €{xTotal.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

function createOrdersHTML(orders, setOrders) {
  let ordersHTML;
  if (Array.isArray(orders)) {
    ordersHTML = orders.map((order, index) => {
      let itemsHTML = createItemsHTML(order);

      const orderDateString = calculateDateString(order.time);

      return (
        <div key={order.time} className="reportsOrder">
          <div className="reportsOrderTableOrderNo">
            Order No. {orders.length - index}
          </div>
          <div
            className="reportsOrderTableDeleteOrder r"
            onClick={(event) => handleDeleteOrder(event, order, setOrders)}
          >
            X
          </div>
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

  return ordersHTML;
}

function createItemsHTML(order) {
  let itemsHTML = order.items.map((item) => {
    if (item.value !== undefined || item.price === undefined) {
      removeAllOrders();
    }

    //Should fix bugs on machines where the adjustment has a value instead of price

    let formattedQuantity = "";
    if (item.quantity === 1 || item.quantity === undefined) {
    } else {
      formattedQuantity = `(${item.quantity})`;
    }

    let formattedAddons = "";
    if (Array.isArray(item.addons)) {
      formattedAddons = item.addons.join(", ");
    }

    return (
      <div
        className="reportsOrderItem"
        key={`${order.time}-${item.name}${formattedQuantity}(${item.price})`}
      >
        <div className="reportsOrderItemName">
          {item.name} {formattedQuantity}
        </div>
        <div className="reportsOrderTotalPrice">
          €{(item.price * item.quantity).toFixed(2)}
        </div>
        <div className="reportsOrderPriceEach">€{item.price.toFixed(2)} EA</div>
        <div className="reportsOrderAddons">{formattedAddons}</div>
      </div>
    );
  });

  return itemsHTML;
}

function calculateDateString(time) {
  const date = new Date(time);

  let dateString = "";
  dateString += date.getHours().toString().padStart(2, "0");
  dateString += ":";
  dateString += date.getMinutes().toString().padStart(2, "0");
  dateString += ":";
  dateString += date.getSeconds().toString().padStart(2, "0");
  dateString += " ";
  dateString += date.getDate().toString().padStart(2, "0");
  dateString += "/";
  dateString += date.getMonth().toString().padStart(2, "0");
  // dateString += "/";
  // dateString += date.getFullYear().toString().padStart(2, "0");

  return dateString;
}

async function handleDeleteOrder(event, deletedOrder, setOrders) {
  let localOrders = await removeOrder(deletedOrder);

  setOrders(localOrders.reverse());
}

async function handleDeleteOldOrders(orders, setOrders) {
  let localOrders = await getAllOrders();

  const currentDate = new Date().getDate();

  let newOrders = [];
  if (Array.isArray(localOrders)) {
    localOrders.forEach((order, index) => {
      const orderDate = new Date(order.time).getDate();
      if (orderDate == currentDate) {
        newOrders.push(order);
      }
    });
    overwriteOrders(newOrders);

    setOrders(newOrders.reverse());
  }
}

async function handleEndOfDay(orders, setOrders) {
  await removeAllOrders();

  let localOrders = await getAllOrders();
  if (Array.isArray(localOrders)) {
    setOrders(localOrders.reverse());
  }
}
