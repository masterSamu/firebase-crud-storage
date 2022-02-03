import React, { useState, useEffect, useContext } from "react";

import { db, storage } from "../firebase-config";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  where,
  query,
} from "firebase/firestore";
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
import MessageBox from "../Components/Messages/MessageBox";

import {
  getMenuItemsFromDb,
  deleteItemFromDb,
} from "../FirebaseFunctions/Firestore";
import { deleteFileFromStorage } from "../FirebaseFunctions/Storage";

export default function MenuItems() {
  const { user } = useContext(UserContext);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successfullMessage, setSuccessfullMessage] = useState(null);
  const [addBtnText, setAddBtnText] = useState("Add new item");
  const [addMenuItemVisible, setAddMenuItemVisible] = useState(false);

  useEffect(() => {
    getMenuItems();
  }, []);

  useEffect(() => {
    if (addMenuItemVisible) setAddBtnText("Close");
    if (!addMenuItemVisible) setAddBtnText("Add new item");
  }, [addMenuItemVisible]);

  const getMenuItems = async () => {
    setLoading(true);
    const data = await getMenuItemsFromDb(user?.id);
    if (data) {
      setError(false);
      if (data.length > 0) {
        setMenuItems(data);
      }
    } else {
      setError(true);
      setErrorMessage("Could not find data!");
    }
    setLoading(false);
  };

  // Delete item from db and storage.
  const deleteItem = async (id, imageFileName) => {
    if (imageFileName === null) {
      deleteItemFromDb(id);
      setSuccessfullMessage("Item succesfully deleted!");
    } else {
      console.log(imageFileName)
      const deleted = await deleteFileFromStorage("MenuItems/" + imageFileName);
      if (deleted) {
        deleteItemFromDb(id);
        const items = menuItems.filter((item) => item.id !== id);
        setMenuItems(items);
        setSuccessfullMessage("Item succesfully deleted!");
      } else {
        setSuccessfullMessage(null);
        setError(true);
        setErrorMessage("Could not delete image file from storage.");
      }
    }
  };

  const toggleAddMenuItemVisible = () => {
    setAddMenuItemVisible(!addMenuItemVisible);
  };

  return (
    <Container className="container-page">
      <Row>
        <PageNav title="Menu Items" url="menuitems" />
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
          <AddMenuItemForm menuItems={menuItems} setMenuItems={setMenuItems} />
        ) : null}
      </Row>
      <Row className="container-menu-item-cards">
        {error ? <ErrorMessage message={errorMessage} /> : null}
        {successfullMessage !== null &&  <MessageBox message={successfullMessage} /> }
        {loading ? (
          <p>Loading...</p>
        ) : (
          menuItems.map((item) => {
            return (
              <MenuItemCard
                key={item.id}
                item={item}
                deleteItem={deleteItem}
                setError={setError}
                setErrorMessage={setErrorMessage}
                setSuccessfullMessage={setSuccessfullMessage}
              />
            );
          })
        )}
      </Row>
    </Container>
  );
}
