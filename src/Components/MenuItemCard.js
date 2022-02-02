import React, { useState, useEffect, useContext } from "react";
import "../styles/MenuItemCard.css";

import { db, storage } from "../firebase-config";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { UserContext } from "../Helper/Context";

export default function MenuItemCard({ item, deleteItem }) {
  const { user } = useContext(UserContext);
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price);
  const [image, setImage] = useState(item.image);
  const [imageFileName, setImageFileName] = useState(item.imageFileName);
  const [active, setActive] = useState(item.active);
  const [itemId, setItemId] = useState(item.id);
  const [cardClass, setCardClass] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [update, setUpdate] = useState(false);
  const [updatedName, setUpdatedName] = useState(item.name);
  const [updatedPrice, setUpdatedPrice] = useState(item.price);
  const [updatedImage, setUpdatedImage] = useState(null);
  const [fileURL, setFileURL] = useState("");
  const itemDocRef = doc(db, "MenuItems", itemId);

  useEffect(() => {
    toggleCardClass();
  }, [active]);

  const updateItemActivityToDb = async (e) => {
    let newActive = e.target.checked;
    setActive(newActive);
    const itemDocRef = doc(db, "MenuItems", itemId);
    await updateDoc(itemDocRef, { active: newActive })
      .then(() => {})
      .catch((error) => {});
  };

  const toggleCardClass = () => {
    if (active) setCardClass("menu-item-card-active");
    else setCardClass("menu-item-card-disabled");
  };

  const handleDelete = () => {
    deleteItem(itemId, imageFileName);
  };

  const handleImageUpdate = () => {
    let path = "MenuItems/";
    const currentTime = Date.now();
    let fileName = `${user.id}-${currentTime}-${updatedImage?.name}`;

    const storageRef = ref(storage, path + fileName);
    const uploadTask = uploadBytesResumable(storageRef, updatedImage);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        setError(true);
        console.log(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          updateDoc(itemDocRef, { image: downloadURL });
          setImage(downloadURL);
          setError(false);
        });
      }
      );
      const fileRef = ref(storage, path + imageFileName);
      deleteObject(fileRef)
  };

  const handleUpdate = async () => {
    const isEmptyValues = updatedName === "" && updatedPrice === "";
    const isItemsChanged = name !== updatedName || price !== updatedPrice;

    if (updatedImage !== null) {
      handleImageUpdate();
    }

    if (isItemsChanged && !isEmptyValues) {
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
    setUpdate(!update);
  };

  return (
    <Card className={["menu-item-card", cardClass]}>
      <Card.Img
        variant="top"
        src={image}
        alt={name}
        className="menu-item-card-image"
      />
      {update === true && (
        <Form.Control
          type="file"
          onChange={(e) => setUpdatedImage(e.target.files[0])}
          className="input-update-image"
          accept=".jpg, .jpeg, .png, .jfif"
        />
      )}
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
              <i className="bi bi-trash"></i>
            </Button>

            <Button
              onClick={handleUpdate}
              variant={update ? "success" : "warning"}
            >
              {update ? (
                <i className="bi bi-save"></i>
              ) : (
                <i className="bi bi-pencil"></i>
              )}
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
