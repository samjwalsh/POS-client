import * as React from "react";
import { useState, useEffect } from "react";

import useConfirm from "./Reusables/ConfirmDialog.jsx";

import closeSVG from "../assets/appicons/close.svg";

import {
  getAllOrders,
  overwriteOrders,
  removeAllOrders,
  removeOrder,
} from "../tools/ipc";

import playBeep from "../tools/playBeep";

export default function Reports(props) {
  const [orders, setOrders] = useState([]);

  const [Dialog, confirm] = useConfirm("Continue?", "");

  useEffect(() => {
    (async () => {
      const localOrders = await getAllOrders();
      setOrders(localOrders.reverse());
    })();
  }, []);

  // FUNCTIONS

  async function handleEndOfDay() {
    playBeep();
    const choice = await confirm();
    if (!choice) return;
    await removeAllOrders();
    let localOrders = await getAllOrders();
    if (Array.isArray(localOrders)) {
      setOrders(localOrders.reverse());
    }
  }

  const handleDeleteOrder = async (deletedOrder) => {
    playBeep();
    
    const choice = await confirm();
    if (!choice) return;

    let localOrders = await removeOrder(deletedOrder);

    setOrders(localOrders.reverse());
  };

  async function handleDeleteOldOrders() {
    playBeep();

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

  // HTML GENERATORS

  function createOrdersHTML() {
    let ordersHTML;
    if (Array.isArray(orders)) {
      ordersHTML = orders.map((order, index) => {
        let itemsHTML = createItemsHTML(order);

        const orderDateString = calculateDateString(order.time);

        return (
          <div key={order.time} className="reportsOrder y">
            <div className="reportsOrderTableOrderNo y">
              Order No. {orders.length - index}
            </div>
            <div
              className="reportsOrderTableDeleteOrder r"
              onClick={(e) => handleDeleteOrder(order)}
            >
              <img src={closeSVG} className="closeSVG r"/>
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
            <div className="reportsOrderTableValue reportsOrderTableValueSubTotal num">
              €{order.subtotal.toFixed(2)}
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

  function reportsStatsHTML() {
    return (
      <div className="reportsStats">
        {createReportsStatsInfo()}
        <div className="reportsStatsButtonsContainer">
          <div
            className="reportsStatsButtons button b"
            onClick={(event) => handleDeleteOldOrders()}
          >
            Del. Old Orders
          </div>
          <div
            className="reportsStatsButtons button r"
            onClick={(event) => handleEndOfDay()}
          >
            End Of Day
          </div>
        </div>
      </div>
    );
  }

  function createReportsStatsInfo() {
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
          <div className="reportsStatsInfoTableEntryValue num">
            €{cashTotal.toFixed(2)}
          </div>
        </div>
        <div className="reportsStatsInfoTableEntry">
          <div className="reportsStatsInfoTableEntryKey">Card:</div>
          <div className="reportsStatsInfoTableEntryValue num">
            €{cardTotal.toFixed(2)}
          </div>
        </div>
        <div className="reportsStatsInfoTableEntry reportsStatsInfoTableEntryLast">
          <div className="reportsStatsInfoTableEntryKey">X-Total:</div>
          <div className="reportsStatsInfoTableEntryValue num">
            €{xTotal.toFixed(2)}
          </div>
        </div>
      </div>
    );
  }

  function createItemsHTML(order) {
    let itemsHTML = order.items.map((item, index) => {
      if (item.value !== undefined || item.price === undefined) {
        removeAllOrders();
      }

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
          key={index}
        >
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

    return itemsHTML;
  }

  return (
    <>
      <Dialog />
      <div className="overflow-y-scroll no-scrollbar h-full">
        <div className="overflow-y-scroll no-scrollbar">
          {createOrdersHTML()}
          <div className="reportsOrderFiller"></div>
          <div className="reportsOrderFiller"></div>
        </div>
        {reportsStatsHTML()}
      </div>
    </>
  );
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
  dateString += (date.getMonth() + 1).toString().padStart(2, "0");
  // dateString += "/";
  // dateString += date.getFullYear().toString().padStart(2, "0");

  return dateString;
}
