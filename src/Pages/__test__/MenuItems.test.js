import React from 'react';
import ReactDOM from 'react-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import MenuItems from "../MenuItems";
import AddMenuItem from "../../Components/AddMenuItem";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<MenuItems />, div)
})

test('renders add new item button', () => {
  render(<MenuItems />);
  const button = screen.getByText("Add new item");
  expect(button).toBeInTheDocument("Add new item");
});

test("don't render add menu item form", () => {
  render(<AddMenuItem />);
  const component = screen.getByTestId("add-menu-item-form");
  expect(component).toBeInTheDocument();
});

test("click 'Add new item' button, and check that button text changes to 'Close'", () => {
  render(<MenuItems />)
  const button = screen.getByText("Add new item")
  fireEvent.click(button);
  expect(button).toHaveTextContent("Close");
})

test("click 'Add new item' button, and check if Form is rendering", () => {
  render(<MenuItems />)
  const button = screen.getByText("Add new item")
  fireEvent.click(button);
  const form = screen.getByTestId("add-menu-item-form");
  expect(form).toBeInTheDocument();
})


