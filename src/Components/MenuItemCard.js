import React, { useState, useEffect } from "react";
import "../styles/MenuItemCard.css";

import { db } from "../firebase-config";
import { doc, updateDoc } from "firebase/firestore";

import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";

export default function MenuItemCard(props) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [active, setActive] = useState(true);
  const [id, setId] = useState("");
  const [cardClass, setCardClass] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(props.name);
    setPrice(props.price);
    setImage(props.image);
    setActive(props.active);
    setId(props.id);
  }, []);

  useEffect(() => {
    updateItemActivityToDb();
    toggleCardClass();
  }, [active]);

  const updateItemActivityToDb = async () => {
    setLoading(true);
    const itemDocRef = doc(db, "MenuItems", id);
    await updateDoc(itemDocRef, { active: active });
    setLoading(false);
  };

  const toggleCardClass = () => {
    if (active) setCardClass("menu-item-card-active");
    else setCardClass("menu-item-card-disabled");
  };

  return (
    <Card className={["menu-item-card", cardClass]}>
      <Card.Img variant="top" src={image} className="menu-item-card-image" />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Body className="menu-item-card-body">
          <Row>
            <Col>{price}</Col>
            <Col>
              <Form.Check
                type="switch"
                checked={active}
                label={active ? "Visible" : "Hidden"}
                onChange={(e) => setActive(e.target.checked)}
              ></Form.Check>
              {loading ? <Spinner
                  className="menu-item-card-spinner"
                  animation="border"
                  variant="secondary"
                /> : null}
            </Col>
          </Row>
        </Card.Body>
      </Card.Body>
    </Card>
  );
}
