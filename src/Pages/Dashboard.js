import React from "react";
import { Link } from "react-router-dom";

import "../styles/Dashboard.css";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Dashboard() {
  return (
    <Row className="dashboard-container">
      <Col className="dashboard-link-container">
        <Link to="/menuitems" className="dashboard-link">
          Menu Items
        </Link>
      </Col>
      <Col className="dashboard-link-container">
        <Link to="/usersettings" className="dashboard-link">
          User Settings
        </Link>
      </Col>
    </Row>
  );
}
