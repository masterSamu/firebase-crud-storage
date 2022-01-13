import React, { useState, useEffect } from "react";
import "../styles/MenuItemCard.css";

import { db } from "../firebase-config";
import { doc, updateDoc } from "firebase/firestore";

import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function MenuItemCard(props) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [active, setActive] = useState(false);
  const [id, setId] = useState("");
  const [cardClass, setCardClass] = useState("");

  useEffect(() => {
    setName(props?.item.name);
    setPrice(props?.item.price);
    setImage(props?.item.image);
    setImageFileName(props?.item.imageFileName);
    setActive(props?.item.active);
    setId(props?.item.id);
  }, [props]);



  useEffect(() => {
    toggleCardClass();
  }, [active]);

  const updateItemActivityToDb = async (e) => {
    let newActive = e.target.checked;
    setActive(newActive);
    const itemDocRef = doc(db, "MenuItems", id);
    await updateDoc(itemDocRef, { active: newActive });
  };

  const toggleCardClass = () => {
    if (active) setCardClass("menu-item-card-active");
    else setCardClass("menu-item-card-disabled");
  };


  return (
    <Card className={["menu-item-card", cardClass]}>
      <Card.Img variant="top" src={image} maxHeight="150" maxWidth="220" alt={name} className="menu-item-card-image" />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Body className="menu-item-card-body">
          <Row className="menu-item-card-row">
            <Col>
              <Form.Label>Price:</Form.Label>
            </Col>
            <Col>
              <span>{price}</span>
            </Col>
          </Row>
          <Row className="menu-item-card-row">
            <Col>
              <Form.Label>Visibility:</Form.Label>
            </Col>
            <Col>
              <Form.Check
                type="switch"
                checked={active}
                onChange={(e) => updateItemActivityToDb(e)}
              ></Form.Check>
            </Col>
          </Row>
            <Button onClick={() => props.deleteItem(id, imageFileName)}>Delete</Button>
        </Card.Body>
      </Card.Body>
    </Card>
  );
}
