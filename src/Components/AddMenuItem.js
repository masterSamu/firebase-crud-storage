/**
 * Add menu item to Firestore database
 */

import React, { useState } from "react";
import { db } from "../firebase-config";
import { collection, addDoc } from "firebase/firestore";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export default function MenuItems() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [active, setActive] = useState(true);

  const addItemToDb = async (e) => {
    e.preventDefault();
    const item = {
      name: name,
      price: price,
      image: image,
      active: active,
    };
    await addDoc(collection(db, "MenuItems"), item);
  };

  return (
    <Form onSubmit={addItemToDb} className="menu-add-form">
      <Form.Label>Product name</Form.Label>
      <Form.Control
        className="menu-add-form-input"
        type="text"
        placeholder="Enter name for product"
        onChange={(e) => setName(e.target.value)}
      ></Form.Control>
      <Form.Label>Price</Form.Label>
      <Form.Control
      className="menu-add-form-input"
        type="number"
        step="0.01"
        min="0"
        placeholder="Enter price for product"
        onChange={(e) => setPrice(e.target.value)}
      ></Form.Control>
      <Form.Label>Image URL</Form.Label>
      <Form.Control
      className="menu-add-form-input"
        type="text"
        placeholder="Enter image address"
        onChange={(e) => setImage(e.target.value)}
      ></Form.Control>
      <Form.Check
        className="menu-add-form-input"
        type="switch"
        label={
          active
            ? "Visible"
            : "Hidden"
        }
        checked={active}
        onChange={(e) => setActive(e.target.checked)}
      />
      <Button variant="primary" type="submit">
        Add item to db
      </Button>
    </Form>
  );
}
