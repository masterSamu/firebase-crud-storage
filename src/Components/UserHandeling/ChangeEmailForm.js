import React, { useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { auth } from "../../firebase-config";
import { updateEmail } from "firebase/auth";

import "../../styles/UserSettings.css";
import ErrorMessage from "../Messages/ErrorMessage";
import MessageBox from "../Messages/MessageBox";

export default function ChangeEmailForm() {
  const user = auth.currentUser;
  const [oldEmail, setOldEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [confirmNewEmail, setConfirmNewEmail] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successful, setSuccessfull] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSuccessfullSubmit = (message) => {
    setError(false);
    setErrorMessage("");
    setSuccessMessage(message);
    setSuccessfull(true);
  };

  const handleErrorInSubmit = (message) => {
    setSuccessfull(false);
    setSuccessMessage("");
    setErrorMessage(message);
    setError(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validateEmail = user.email === oldEmail;
    const oldEmailIsEqualToNewEmail = oldEmail === newEmail;
    const newEmailIsEqualToConfirmEmail = newEmail === confirmNewEmail;

    if (validateEmail) {
      if (!oldEmailIsEqualToNewEmail && newEmailIsEqualToConfirmEmail) {
        updateEmail(user, newEmail)
          .then(() => {
            handleSuccessfullSubmit(
              "Email updated successfully! You can now log on with your new email."
            );
          })
          .catch((error) => {
            handleErrorInSubmit(error.message);
          });
      } else if (oldEmailIsEqualToNewEmail) {
        handleErrorInSubmit("New email is equal to your current email!");
      } else if (!newEmailIsEqualToConfirmEmail) {
        handleErrorInSubmit("New email does not equal with confirm email!");
      }
    } else {
      handleErrorInSubmit("Current email is unavalaible.");
    }
  };

  return (
    <Container>
      <h2>Change email</h2>
      <p>Email is used as username to log in to service.</p>
      <Form onSubmit={handleSubmit}>
        <Form.Label>Current email</Form.Label>
        <Form.Control
          type="email"
          name="current-email"
          onChange={(e) => setOldEmail(e.target.value)}
        />
        <Form.Label>New email</Form.Label>
        <Form.Control
          type="email"
          name="new-email"
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <Form.Label>Confirm email</Form.Label>
        <Form.Control
          type="email"
          name="confirm-new-email"
          onChange={(e) => setConfirmNewEmail(e.target.value)}
        />
        <Row>
          <Col>
            <Button type="submit" variant="success">
              Update
            </Button>
          </Col>
        </Row>
      </Form>
      {error === true && <ErrorMessage message={errorMessage} />}
      {successful === true && <MessageBox message={successMessage} />}
    </Container>
  );
}
