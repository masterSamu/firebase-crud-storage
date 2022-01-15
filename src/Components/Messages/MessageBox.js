import React, { useState } from "react";
import Card from "react-bootstrap/Card";

export default function MessageBox({ message }) {
  const [message, setMessage] = useState(message);

  return (
        <Card style={cardStyle}>
          <Card.Body>
            <Card.Text>{message}</Card.Text>
          </Card.Body>
        </Card>
  );
}

const cardStyle = {
  width: "100%",
  marginBottom: 15,
  marginTop: 15,
  marginRight: "auto",
  marginLeft: "auto",
  backgroundColor: "#FFF",
  borderWidth: 3,
  borderColor: "lightgreen",
  fontSize: "1.3rem",
};
