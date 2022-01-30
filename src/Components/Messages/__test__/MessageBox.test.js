import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen } from '@testing-library/react';

import MessageBox from "../MessageBox";

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<MessageBox />, div)
  })

it("renders message properly", () => {
    render(<MessageBox message="Hello world" />);
    const component = screen.getByTestId("messagebox-message");
    expect(component).toHaveTextContent("Hello world");
})