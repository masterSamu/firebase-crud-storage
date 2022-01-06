import React from "react";
import { Link } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

export default function Dashboard() {
  return (
    <Container>
      <Row>
        <Col>
            <Link to="menuitems">
                MenuItems
            </Link>
        </Col>
      </Row>
    </Container>
  );
}
