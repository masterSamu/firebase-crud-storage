/**
 * Add menu item to Firestore database
 */

import React, { useState, useEffect, useContext } from "react";
import "../styles/MenuItemsPage.css";

import { db, storage } from "../firebase-config";
import { collection, addDoc } from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
} from "firebase/storage";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Image from "react-bootstrap/Image";

import ErrorMessage from "./Messages/ErrorMessage";
import { UserContext } from "../Helper/Context";

export default function AddMenuItem(props) {
  const {user, setUser} = useContext(UserContext);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [active, setActive] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [inputKey, setInputKey] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileValid, setFileValid] = useState(true);
  const [formError, setFormError] = useState(false);
  const [menuItemsMaxed, setMenuItemsMaxed] = useState(false);

  useEffect(() => {
    checkFileCountInStorage();
  }, []);

  const clearInputStates = () => {
    setName("");
    setPrice(0);
    setImageFile(null);
    setInputKey(Date.now());
    setError(false);
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (!formError && !menuItemsMaxed) {
      setLoading(true);
      if (imageFile === null) {
        uploadDataToDb();
      } else {
        const currentTime = Date.now();
        let fileName = `${user.id}-${currentTime}-${imageFile.name}`;
        uploadImageToStorage(fileName);
      }
      setLoading(false);
    } else {
      setErrorMessage("Form has unresolved errors!");
      setError(true);
    }
  };

  const uploadDataToDb = async (imageURL, fileName) => {
    const item = {
      name: name,
      price: price,
      image: imageURL,
      imageFileName: fileName,
      active: active,
      userId: user.id
    };
    const docRef = await addDoc(collection(db, "MenuItems"), item)
      .then((docRef) => {
        item.id = docRef.id;
        props.setMenuItems((prevState) => [...prevState, item]);
        clearInputStates();
      })
      .catch((error) => {
        setError(true);
        setErrorMessage(error.message);
      });
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
        setErrorMessage(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          uploadDataToDb(downloadURL, fileName);
        });
      }
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    checkFileCountInStorage();
    if (file.size < 2000000) {
      setFileValid(true);
      setFormError(false);
      setImageFile(file);
    } else {
      setFileValid(false);
      setFormError(true);
    }
  };

  const checkFileCountInStorage = () => {
    const listRef = ref(storage, "MenuItems");
    listAll(listRef)
      .then((res) => {
        let maxCountOfItems = 20;
        const ItemsMaxxed =
          res.items.length >= maxCountOfItems ||
          props.menuItems.length >= maxCountOfItems;
        if (ItemsMaxxed) {
          setMenuItemsMaxed(true);
          setErrorMessage(
            "Storage is full, please delete item before adding new one."
          );
          setError(true);
        } else {
          setMenuItemsMaxed(false);
          setErrorMessage("");
          setError(false);
        }
      })
      .catch((error) => {
        errorMessage(error.message);
        setError(true);
      });
  };

  return (
    <Form onSubmit={submitForm} className="menu-add-form" data-testid="add-menu-item-form">
      <Row>
        <Col className="menu-add-input-container">
          <Form.Label>Product name</Form.Label>
          <Form.Control
            name="product-name"
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
            onChange={(e) => handleFileChange(e)}
            isInvalid={!fileValid}
          />
          <Form.Control.Feedback type="invalid">
            File size is too big! Maximum size of file is 2mb.
          </Form.Control.Feedback>
          <Form.Check
            className="menu-add-form-input"
            type="switch"
            label={active ? "Visible" : "Hidden"}
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
        </Col>
        <Col className="menu-item-container-image-preview">
          <Form.Label>Preview image:</Form.Label>
          <Container className="menu-item-card-preview">
            {imageFile !== null && (
              <Image
                className="preview-image"
                width="auto"
                height="250px"
                src={URL.createObjectURL(imageFile)}
              />
            )}
          </Container>
        </Col>
      </Row>
      <Row>
        <Col className="menu-form-submit-container">
          <Button
            variant="success"
            type="submit"
            disabled={menuItemsMaxed && "disabled"}
            data-testid="submit-button"
          >
            Save new item
          </Button>
          {loading ? (
            <Spinner
              variant="primary"
              animation="border"
              role="loading"
              className="menu-form-spinner"
            />
          ) : null}
        </Col>
      </Row>
      {error ? (
        <Row>
          <ErrorMessage message={errorMessage} />
        </Row>
      ) : null}
    </Form>
  );
}