import React, { useState, useEffect } from "react";

import { db } from "../firebase-config";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

import AddMenuItem from "../Components/AddMenuItem";
import MenuItemCard from "../Components/MenuItemCard";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export default function MenuItems() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMenuItemsFromDb();
  }, []);

  const getMenuItemsFromDb = async () => {
    setLoading(true);
    const data = await getDocs(collection(db, "MenuItems"));
    setMenuItems(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setLoading(false);
  };

  // Still not deleting image from storage!
  const deleteItem = (id) => {
    const itemDoc = doc(db, "MenuItems", id);
    deleteDoc(itemDoc);
    const items = menuItems.filter(item => item.id !== id);
    setMenuItems(items)
  }

  return (
    <Container>
      <Row>MenuItems</Row>
      <Row>
        <AddMenuItem menuItems={menuItems} setMenuItems={setMenuItems} />
      </Row>
      <Row className="container-menu-item-cards">
          {loading ? (
            <p>Loading...</p>
          ) : (
            menuItems.map((item) => {
              return (
                <MenuItemCard
                  key={item.id}
                  name={item.name}
                  image={item.image}
                  price={item.price}
                  active={item.active}
                  id={item.id}
                  deleteItem={deleteItem}
                />
              );
            })
          )}
      </Row>
    </Container>
  );
}
