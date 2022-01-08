/**
 * Add menu item to Firestore database
 */

import React, { useState, useEffect } from "react";
import "../styles/MenuItemsPage.css";

import { db, storage } from "../firebase-config";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";

import MenuItemCard from "./MenuItemCard";

export default function MenuItems() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [active, setActive] = useState(true);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    console.log(imageFile);
  }, [imageFile]);

  const addItemToDb = async (e) => {
    e.preventDefault();
    uploadImageToStorage();
    const item = {
      name: name,
      price: price,
      image: image,
      active: active,
    };
    await addDoc(collection(db, "MenuItems"), item);
  };

  const uploadImageToStorage = async () => {
    const storageRef = ref(storage, "MenuItems/" + imageFile.name);
    uploadBytes(storageRef, imageFile).then((snapshot) => {
      console.log("Image uploaded: " + snapshot);
    })
    
  };

  return (
    <Form onSubmit={addItemToDb} className="menu-add-form">
      <Row>
        <Col>
        <Form.Label>Product name</Form.Label>
      <Form.Control
        className="menu-add-form-input"
        type="text"
        placeholder="Enter name for product"
        onChange={(e) => setName(e.target.value)}
      />
      <Form.Label>Price</Form.Label>
      <Form.Control
        className="menu-add-form-input"
        type="number"
        step="0.01"
        min="0"
        placeholder="Enter price for product"
        onChange={(e) => setPrice(e.target.value)}
      />
      <Form.Label>Image URL</Form.Label>
      <Form.Control
        className="menu-add-form-input"
        type="text"
        placeholder="Enter image address"
        onChange={(e) => setImage(e.target.value)}
      />
      <Form.Control
        className="menu-add-form-input"
        type="file"
        accept=".jpg, .jpeg, .png, .jfif"
        onChange={(e) => setImageFile(e.target.files[0])}
      />
      <Form.Check
        className="menu-add-form-input"
        type="switch"
        label={active ? "Visible" : "Hidden"}
        checked={active}
        onChange={(e) => setActive(e.target.checked)}
      />
        </Col>
        <Col className="menu-item-container-image-preview">
          {imageFile !== null && (
            <Container>
              <Form.Label>Preview:</Form.Label>
              <MenuItemCard 
                name={name}
                price={price}
                image={URL.createObjectURL(imageFile)}
                active={active}
                id={null}
              />
            </Container>
        )}
        </Col>
      </Row>


      <Button variant="success" type="submit">
        Save new item
      </Button>

    </Form>
  );
}
