import React, { useState, useEffect } from "react";

import "../styles/MenuItemsPage.css";

import { db } from "../firebase-config";
import { collection, getDocs, doc } from "firebase/firestore";

import Container from "react-bootstrap/Container";

import MenuItemCard from "./MenuItemCard";

export default function ShowMenuItems() {
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

  /*
    useEffect(() => {
        getMenuItemsFromDb();
    }, [menuItems])
    */

  return (
    <Container className="container-menu-item-cards">
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
            />
          );
        })
      )}
    </Container>
  );
}
