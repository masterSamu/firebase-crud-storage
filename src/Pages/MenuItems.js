import React, { useState } from "react";

import AddMenuItem from "../Components/AddMenuItem";
import ShowMenuItems from "../Components/ShowMenuItems";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export default function MenuItems() {

  return (
    <Container>
      <Row>MenuItems</Row>
      <Row>
        <AddMenuItem />
      </Row>
      <Row>
          <ShowMenuItems />
      </Row>
    </Container>
  );
}
