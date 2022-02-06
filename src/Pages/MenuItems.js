import React, { useState, useEffect, useContext } from "react";

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

import useMenuItems from "../FirebaseHooks/useMenuItems";

export default function MenuItems() {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successfull, setSuccessfull] = useState(null);
  const [addBtnText, setAddBtnText] = useState("Add new item");
  const [addMenuItemVisible, setAddMenuItemVisible] = useState(false);
  const menuItems = useMenuItems(user.id);
  
 
  useEffect(() => {
    setError(menuItems.error);
  }, [menuItems.error])

  useEffect(() => {
    setLoading(menuItems.loading);
  }, [menuItems.loading])

  useEffect(()=> {
    setSuccessfull(menuItems.succesfull);
  }, [menuItems.succesfull])

  useEffect(() => {
    if (addMenuItemVisible) setAddBtnText("Close");
    if (!addMenuItemVisible) setAddBtnText("Add new item");
  }, [addMenuItemVisible]);

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
          <AddMenuItemForm menuItems={menuItems} />
        ) : null}
      </Row>
      <Row className="container-menu-item-cards">
        {error !== null && <ErrorMessage message={error} />}
        {successfull !== null &&  <MessageBox message={successfull} /> }
        {loading ? (
          <p>Loading...</p>
        ) : (
          menuItems.data.map((item) => {
            return (
              <MenuItemCard
                key={item.id}
                item={item}
                updateItem={menuItems?.updateItem}
                deleteItem={menuItems?.deleteItem}
                updateItemActicity={menuItems?.updateItemActivity}
                setError={setError}
                setSuccessfull={setSuccessfull}
              />
            );
          })
        )}
      </Row>
    </Container>
  );
}
