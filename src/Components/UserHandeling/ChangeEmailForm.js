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

import reAuthenticateUser from "./reAuthenticateUser";

export default function ChangeEmailForm() {
  const user = auth.currentUser;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [confirmNewEmail, setConfirmNewEmail] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successful, setSuccessfull] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [validateUser, setValidateUser] = useState(false);

  const clearInputValues = () => {
    setEmail("");
    setPassword("");
    setNewEmail("");
    setConfirmNewEmail("");
    setValidateUser(false);
  }

  const handleSuccessfull = (message) => {
    setError(false);
    setErrorMessage("");
    setSuccessMessage(message);
    setSuccessfull(true);
  };

  const handleError = (message) => {
    setSuccessfull(false);
    setSuccessMessage("");
    setErrorMessage(message);
    setError(true);
  };

  const handleUserValidate = async (e) => {
    e.preventDefault();
    const reAuth = await reAuthenticateUser(user, email, password);
    if (reAuth) {
      setError(false);
      setValidateUser(true);
    } else {
      setValidateUser(false);
      handleError("Failed to verificate user! Check your credentials.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const oldEmailIsEqualToNewEmail = email === newEmail;
    const newEmailIsEqualToConfirmEmail = newEmail === confirmNewEmail;

    if (validateUser) {
      if (!oldEmailIsEqualToNewEmail && newEmailIsEqualToConfirmEmail) {
        updateEmail(user, newEmail)
          .then(() => {
            handleSuccessfull(
              "Email updated successfully! You can now log in with your new email."
            );
            clearInputValues();
          })
          .catch((error) => {
            handleError(error.message);
          });
      } else if (oldEmailIsEqualToNewEmail) {
        handleError("New email is equal to your current email!");
      } else if (!newEmailIsEqualToConfirmEmail) {
        handleError("New email does not equal with confirm email!");
      }
    } else {
      handleError("Current email is unavalaible.");
    }
  };

  return (
    <Container>
      <h2>Change email</h2>
      <p>Verify your credentials before updating email.</p>
      <Form onSubmit={handleUserValidate}>
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          defaultValue={email}
          required
        />
        <Form.Label>Type current password</Form.Label>
        <Form.Control
          type="password"
          minLength="6"
          name="old-password"
          onChange={(e) => setPassword(e.target.value)}
          defaultValue={password}
          required
        />
        <Row>
          <Col>
            <Button type="submit" variant="primary">
              Verify credentials
            </Button>
          </Col>
        </Row>
      </Form>
      {validateUser === true && (
        <Form onSubmit={handleSubmit}>
          <Form.Label>New email</Form.Label>
          <Form.Control
            type="email"
            name="new-email"
            onChange={(e) => setNewEmail(e.target.value)}
            defaultValue={newEmail}
            required
          />
          <Form.Label>Confirm email</Form.Label>
          <Form.Control
            type="email"
            name="confirm-new-email"
            onChange={(e) => setConfirmNewEmail(e.target.value)}
            defaultValue={confirmNewEmail}
            required
          />
          <Row>
            <Col>
              <Button type="submit" variant="success">
                Update
              </Button>
            </Col>
          </Row>
        </Form>
      )}
      {error === true && <ErrorMessage message={errorMessage} />}
      {successful === true && <MessageBox message={successMessage} />}
    </Container>
  );
}
