import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { useState } from "react";

import log from "../../tools/logging";

export default function OrderBar() {
    log(`Set title for order bar to Order`);
    return <div className="col-span-3 row-span-1 text-center bg-black text-white">Order</div>;
  }
  