import ReactDOM from 'react-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import ChangePasswordForm from '../ChangePasswordForm';

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<ChangePasswordForm />, div)
  })