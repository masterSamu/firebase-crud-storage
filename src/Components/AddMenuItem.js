/**
 * Add menu item to Firestore database
 */

import React, { useState, useEffect } from "react";
import "../styles/MenuItemsPage.css";

import { db, storage } from "../firebase-config";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";

import ErrorMessage from "./Messages/ErrorMessage";

export default function AddMenuItem(props) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [active, setActive] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const addItemToDb = async (e) => {
    e.preventDefault();
    if (imageFile === null) {
      uploadDataToDb(null);
    } else {
      uploadImageToStorage();
    }
  };

  const uploadDataToDb = async (imageURL) => {
    const item = {
      name: name,
      price: price,
      image: imageURL,
      active: active,
    };
    const docRef = await addDoc(collection(db, "MenuItems"), item);
    item.id = docRef.id;
    props.setMenuItems((prevState) => [...prevState, item]);
  };

  const uploadImageToStorage = () => {
    let imageURL = null;
    const storageRef = ref(storage, "MenuItems/" + imageFile.name);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        setError(true);
        setErrorMessage(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          uploadDataToDb(downloadURL);
        });
      }
    );
    return imageURL;
  };

  return (
    <Form onSubmit={addItemToDb} className="menu-add-form">
      <Row>
        <Col className="">
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
          <Form.Label>Image</Form.Label>
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
          <Form.Label>Preview:</Form.Label>
          <Card className="menu-item-card-preview">
            {imageFile !== null && (
              <Card.Img src={URL.createObjectURL(imageFile)} />
            )}
          </Card>
        </Col>
      </Row>

      <Button variant="success" type="submit">
        Save new item
      </Button>
      {error ? (
        <Row>
          <ErrorMessage message="Could not upload data." />
        </Row>
      ) : null}
    </Form>
  );
}
