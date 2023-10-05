import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { useState } from "react";

import log from "../../tools/logging";

export default function OrderBar() {
    log(`Set title for order bar to Order`);
    return <div id="orderTitle">Order</div>;
  }
  