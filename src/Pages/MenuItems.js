import React, { useState, useEffect } from "react";

import { db, storage } from "../firebase-config";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

import PageNav from "../Components/Navbar/PageNav";
import AddMenuItem from "../Components/AddMenuItem";
import MenuItemCard from "../Components/MenuItemCard";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ErrorMessage from "../Components/Messages/ErrorMessage";

export default function MenuItems() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [addBtnText, setAddBtnText] = useState("Add new item");
  const [addMenuItemVisible, setAddMenuItemVisible] = useState(false);

  useEffect(() => {
    getMenuItemsFromDb();
  }, []);

  useEffect(() => {
    if (addMenuItemVisible) setAddBtnText("Close");
    if (!addMenuItemVisible) setAddBtnText("Add new item");
  }, [addMenuItemVisible]);

  const getMenuItemsFromDb = async () => {
    setLoading(true);
    await getDocs(collection(db, "MenuItems"))
      .then((data) => {
        setMenuItems(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setLoading(false);
      })
      .catch((error) => {
        setError(false);
        setErrorMessage(error.message);
        setLoading(false);
      });
  };

  // Delete item from db and storage.
  const deleteItem = (id, fileName) => {
    const fileRef = ref(storage, "MenuItems/" + fileName);
    deleteObject(fileRef)
      .then(() => {
        // File deleted, do something...
      })
      .catch((error) => {
        console.log(error);
      });
    const itemDoc = doc(db, "MenuItems", id);
    deleteDoc(itemDoc);
    const items = menuItems.filter((item) => item.id !== id);
    setMenuItems(items);
  };

  const toggleAddMenuItemVisible = () => {
    setAddMenuItemVisible(!addMenuItemVisible);
  };

  return (
    <Container className="container-page">
      <Row>
        <PageNav title="Menu Items" />
      </Row>
      <Row className="container-menu-add-form">
        <Row>
          <Col>
            <Button variant="primary" onClick={toggleAddMenuItemVisible}>
              {addBtnText}
            </Button>
          </Col>
        </Row>
        {addMenuItemVisible ? (
          <AddMenuItem menuItems={menuItems} setMenuItems={setMenuItems} />
        ) : null}
      </Row>
      <Row className="container-menu-item-cards">
        {error ? <ErrorMessage message={errorMessage} /> : null}
        {loading ? (
          <p>Loading...</p>
        ) : (
          menuItems.map((item) => {
            return (
              <MenuItemCard key={item.id} item={item} deleteItem={deleteItem} />
            );
          })
        )}
      </Row>
    </Container>
  );
}
