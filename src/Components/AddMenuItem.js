/**
 * Add menu item to Firestore database
 */

import React, { useState, useEffect, useRef } from "react";
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
  const [inputKey, setInputKey] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const clearStates = () => {
    setName("");
    setPrice(0);
    setImageFile(null);
    setInputKey(Date.now());
    setError(false);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (imageFile === null) {
      uploadDataToDb();
    } else {
      const currentTime = Date.now();
      let userId = "123456789"; // replace this later with real user id
      let fileName = `${userId}-${currentTime}-${imageFile.name}`;
      uploadImageToStorage(fileName);
    }
  };

  const uploadDataToDb = async (imageURL, fileName) => {
    const item = {
      name: name,
      price: price,
      image: imageURL,
      imageFileName: fileName,
      active: active,
    };
    const docRef = await addDoc(collection(db, "MenuItems"), item);
    item.id = docRef.id;
    props.setMenuItems((prevState) => [...prevState, item]);
    clearStates();
  };

  // Upload image to stroage, and data to db.
  const uploadImageToStorage = (fileName) => {
    const storageRef = ref(storage, "MenuItems/" + fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        setError(true);
        setErrorMessage(error);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          uploadDataToDb(downloadURL, fileName);
        });
      }
    );
  };

  return (
    <Form onSubmit={submitForm} className="menu-add-form">
      <Row>
        <Col className="">
          <Form.Label>Product name</Form.Label>
          <Form.Control
            className="menu-add-form-input"
            type="text"
            placeholder="Enter name for product"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Form.Label>Price</Form.Label>
          <Form.Control
            className="menu-add-form-input"
            type="number"
            step="0.01"
            min="0"
            placeholder="Enter price for product"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <Form.Label>Image</Form.Label>
          <Form.Control
            className="menu-add-form-input"
            type="file"
            accept=".jpg, .jpeg, .png, .jfif"
            key={inputKey}
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
