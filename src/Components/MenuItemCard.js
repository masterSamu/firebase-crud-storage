import React, { useState, useEffect, useRef } from "react";
import "../styles/MenuItemCard.css";

import { db } from "../firebase-config";
import { doc, updateDoc } from "firebase/firestore";

import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function MenuItemCard({ item, deleteItem }) {
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price);
  const [image, setImage] = useState(item.image);
  const [imageFileName, setImageFileName] = useState(item.imageFileName);
  const [active, setActive] = useState(item.active);
  const [id, setId] = useState(item.id);
  const [cardClass, setCardClass] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [update, setUpdate] = useState(false);
  const [updateBtnText, setUpdateBtnText] = useState("Edit");
  const [updatedName, setUpdatedName] = useState(item.name);
  const [updatedPrice, setUpdatedPrice] = useState(item.price);

  useEffect(() => {
    toggleCardClass();
  }, [active]);

  const updateItemActivityToDb = async (e) => {
    let newActive = e.target.checked;
    setActive(newActive);
    const itemDocRef = doc(db, "MenuItems", id);
    await updateDoc(itemDocRef, { active: newActive })
      .then(() => {})
      .catch((error) => {});
  };

  const toggleCardClass = () => {
    if (active) setCardClass("menu-item-card-active");
    else setCardClass("menu-item-card-disabled");
  };

  const handleDelete = () => {
    deleteItem(id, imageFileName);
  };

  const handleUpdate = async () => {
    setUpdate(!update);
    if (update) setUpdateBtnText("Edit");
    else setUpdateBtnText("Save");

    const isEmptyValues = updatedName !== "" && updatedPrice !== "";
    const isItemsChanged = name !== updatedName || price !== updatedPrice;

    if (isItemsChanged && !isEmptyValues) {
      const itemDocRef = doc(db, "MenuItems", id);
      await updateDoc(itemDocRef, { name: updatedName, price: updatedPrice })
        .then(() => {
          setName(updatedName);
          setPrice(updatedPrice);
        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
        });
    }
  };

  return (
    <Card className={["menu-item-card", cardClass]}>
      <Card.Img
        variant="top"
        src={image}
        alt={name}
        className="menu-item-card-image"
      />
      <Card.Body className="menu-item-card-body">
      <Card.Title>
      {update ? (
          <Form.Control
            type="text"
            defaultValue={name}
            placeholder="Enter name for item..."
            onChange={(e) => setUpdatedName(e.target.value)}
          />
      ) : (
        name
      )}
      </Card.Title>
        <Row className="menu-item-card-row">
          <Col>
            <Form.Label>Price:</Form.Label>
          </Col>
          <Col>
            {update ? (
              <Form.Control
                type="number"
                defaultValue={price}
                step="0.01"
                onChange={(e) => setUpdatedPrice(e.target.value)}
              />
            ) : (
              <span>{price}</span>
            )}
          </Col>
        </Row>
        <Row className="menu-item-card-row">
          <Col>
            <Form.Label>Visible:</Form.Label>
          </Col>
          <Col>
            <Form.Check
              type="switch"
              checked={active}
              onChange={(e) => updateItemActivityToDb(e)}
            ></Form.Check>
          </Col>
        </Row>
        <Row className="menu-item-card-row-buttons">
          <Col className="button-container">
            <Button onClick={handleDelete} variant="danger">
              <i class="bi bi-trash"></i>
            </Button>

            <Button
              onClick={handleUpdate}
              variant={update ? "success" : "warning"}
            >
              {update ? <i class="bi bi-save"></i> : <i class="bi bi-pencil"></i>}
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
