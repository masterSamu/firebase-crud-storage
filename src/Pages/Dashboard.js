import React from "react";
import { Link } from "react-router-dom";

import "../styles/Dashboard.css";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

export default function Dashboard() {
  return (
    <Container className="dashboard-container">
      <Row>
        <Col className="dashboard-link-container">
            <Link to="menuitems">
                MenuItems
            </Link>
        </Col>
      </Row>
    </Container>
  );
}
