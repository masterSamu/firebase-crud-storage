import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen } from '@testing-library/react';

import ErrorMessage from '../ErrorMessage';

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<ErrorMessage />, div)
})

it("renders message properly", () => {
    render(<ErrorMessage message="Hello world" />)
    const component = screen.getByTestId("error-message");
    expect(component).toHaveTextContent("Hello world");
})