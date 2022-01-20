import React from "react";
import { Link } from "react-router-dom";

import "../styles/Dashboard.css";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Dashboard() {
  return (
    <Row className="dashboard-container">
      <Col className="dashboard-link-container">
        <Link to="/menuitems" className="dashboard-link">
          MenuItems
        </Link>
      </Col>
      <Col className="dashboard-link-container">
        <Link to="/menuitems" className="dashboard-link">
          MenuItems
        </Link>
      </Col>
      <Col className="dashboard-link-container">
        <Link to="/menuitems" className="dashboard-link">
          MenuItems
        </Link>
      </Col>
      <Col className="dashboard-link-container">
        <Link to="/menuitems" className="dashboard-link">
          MenuItems
        </Link>
      </Col>
      <Col className="dashboard-link-container">
        <Link to="/menuitems" className="dashboard-link">
          MenuItems
        </Link>
      </Col>
      <Col className="dashboard-link-container">
        <Link to="/menuitems" className="dashboard-link">
          MenuItems
        </Link>
      </Col>
      <Col className="dashboard-link-container">
        <Link to="/menuitems" className="dashboard-link">
          MenuItems
        </Link>
      </Col>
    </Row>
  );
}
