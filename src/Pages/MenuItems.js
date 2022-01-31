import React, { useState, useEffect, useContext } from "react";

import { db, storage } from "../firebase-config";
import { collection, getDocs, doc, deleteDoc, where, query } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { UserContext } from "../Helper/Context";

import PageNav from "../Components/Navbar/PageNav";
import AddMenuItemForm from "../Components/AddMenuItemForm";
import MenuItemCard from "../Components/MenuItemCard";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ErrorMessage from "../Components/Messages/ErrorMessage";

export default function MenuItems() {
  const {user, setUser} = useContext(UserContext);
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
    const q = query(collection(db, "MenuItems"), where("userId", "==", user?.id));
    await getDocs(q)
      .then((data) => {
        setMenuItems(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      })
      .catch((error) => {
        setError(false);
        setErrorMessage(error.message);
      });
      setLoading(false);
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
            <Button
              variant="primary"
              role="button"
              data-testid="button-toggle-addMenuItemVisible"
              onClick={toggleAddMenuItemVisible}
            >
              {addBtnText}
            </Button>
          </Col>
        </Row>
        {addMenuItemVisible ? (
          <AddMenuItemForm
            menuItems={menuItems}
            setMenuItems={setMenuItems}
          />
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
