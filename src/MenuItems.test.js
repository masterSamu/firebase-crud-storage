import { fireEvent, render, screen } from '@testing-library/react';
import MenuItems from "./Pages/MenuItems";
import AddMenuItem from "./Components/AddMenuItem";

test('renders add new item button', () => {
  render(<MenuItems />);
  const button = screen.getByText(/Add new item/i);
  expect(button).toBeInTheDocument(/Add new item/i);
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

