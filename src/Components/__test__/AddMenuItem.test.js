import React from "react";
import ReactDOM from "react-dom";
import { fireEvent, render, screen } from "@testing-library/react";

import AddMenuItem from "../../Components/AddMenuItem";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<AddMenuItem />, div);
});
