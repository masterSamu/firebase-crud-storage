/**
 * Add menu item to Firestore database
 */

import React, { useState, useEffect, useContext } from "react";
import "../styles/MenuItemsPage.css";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Image from "react-bootstrap/Image";

import ErrorMessage from "./Messages/ErrorMessage";
import { UserContext } from "../Helper/Context";

export default function AddMenuItem({ menuItems }) {
  const { user } = useContext(UserContext);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [active, setActive] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [inputKey, setInputKey] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileValid, setFileValid] = useState(true);
  const [formError, setFormError] = useState(false);

  useEffect(() => {
    setError(menuItems.error);
  }, [menuItems.error]);

  useEffect(() => {
    setLoading(menuItems.laoding);
  }, [menuItems.loading])

  const clearInputStates = () => {
    setName("");
    setPrice(0);
    setImageFile(null);
    setInputKey(Date.now());
    setError(null);
  };

  const submitForm = (e) => {
    e.preventDefault();
    const item = {
      name: name,
      price: price,
      image: null,
      imageFileName: null,
      active: active,
      userId: user.id,
    };
    if (!formError) {
      const addedMenuItem = menuItems.addItem(item, imageFile);
      if (addedMenuItem) clearInputStates();
    } else {
      setError("Form has unresolved errors!");
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size < 2000000) {
        setFileValid(true);
        setFormError(false);
        setImageFile(file);
      } else {
        setFileValid(false);
        setFormError(true);
      }
    }
  };
  
  return (
    <Form
      onSubmit={submitForm}
      className="menu-add-form"
      data-testid="add-menu-item-form"
    >
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
      {error !== null && (
        <Row>
          <ErrorMessage message={error} />
        </Row>
      )}
    </Form>
  );
}
