import React from "react";
import Card from "react-bootstrap/Card";

export default function MessageBox({ message }) {
  return (
    <Card style={cardStyle}>
      <Card.Body>
        <Card.Text data-testid="messagebox-message">{message}</Card.Text>
      </Card.Body>
    </Card>
  );
}

const cardStyle = {
  width: "90%",
  marginBottom: 15,
  marginTop: 15,
  marginRight: "auto",
  marginLeft: "auto",
  backgroundColor: "#FFF",
  borderWidth: 3,
  borderColor: "lightgreen",
  fontSize: "1.3rem",
};
