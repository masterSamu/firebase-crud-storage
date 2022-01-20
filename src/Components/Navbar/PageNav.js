import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import "../../styles/Nav.css";

export default function PageNav({ title }) {
  return (
    <Navbar className="navbar-container">
      <Nav>
        <Nav.Link href="/dashboard" className="nav-item">
          <i
            className="bi bi-arrow-left-square nav-icon"
            aria-label="Back"
            role="Button"
          ></i>
        </Nav.Link>
      </Nav>
        <Nav.Link href="/menuitems" className="nav-item page-name">
          {title}
        </Nav.Link>
    </Navbar>
  );
}
