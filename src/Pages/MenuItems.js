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

import { deleteFileFromStorage } from "../FirebaseHooks/Storage";
import useMenuItems from "../FirebaseHooks/useMenuItems";

export default function MenuItems() {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successfullMessage, setSuccessfullMessage] = useState(null);
  const [addBtnText, setAddBtnText] = useState("Add new item");
  const [addMenuItemVisible, setAddMenuItemVisible] = useState(false);
  const menuItems = useMenuItems(user.id);
  
 
  useEffect(() => {
    setErrorMessage(menuItems.error);
  }, [menuItems.error])

  useEffect(() => {
    setLoading(menuItems.loading);
  }, [menuItems.loading])

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
          <AddMenuItemForm menuItems={menuItems.data} setMenuItems={menuItems.setData} />
        ) : null}
      </Row>
      <Row className="container-menu-item-cards">
        {error ? <ErrorMessage message={errorMessage} /> : null}
        {successfullMessage !== null &&  <MessageBox message={successfullMessage} /> }
        {loading ? (
          <p>Loading...</p>
        ) : (
          menuItems.data.map((item) => {
            return (
              <MenuItemCard
                key={item.id}
                item={item}
                deleteItem={menuItems?.deleteItem}
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
