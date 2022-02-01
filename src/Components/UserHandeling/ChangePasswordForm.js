import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { auth } from "../../firebase-config";
import { updatePassword } from "firebase/auth";
import ErrorMessage from "../Messages/ErrorMessage";
import MessageBox from "../Messages/MessageBox";

import reAuthenticateUser from "./reAuthenticateUser";
import "../../styles/UserSettings.css";

export default function ChangePasswordForm() {
  const user = auth.currentUser;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [succesfull, setSuccesfull] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [validateUser, setValidateUser] = useState(false);

  const clearInputValues = () => {
    setEmail("");
    setPassword("");
    setNewPassword1("");
    setNewPassword2("");
    setValidateUser(false);
  };

  const handleSuccessfullSubmit = (message) => {
    setSuccesfull(true);
    setSuccessMessage(message);
    setError(false);
    setErrorMessage("");
  };

  const handleError = (message) => {
    setSuccesfull(false);
    setSuccessMessage("");
    setError(true);
    setErrorMessage(message);
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
    setError(false);
    const newPasswordsAreEquals = newPassword1 === newPassword2;
    const newPasswordIsNotEqualWithOldPassword = password !== newPassword1;
    if (validateUser) {
      if (!newPasswordsAreEquals) {
        handleError("New passwords are not equals!");
      } else if (!newPasswordIsNotEqualWithOldPassword) {
        handleError(
          "New password is equal with old password! Can't use same password again."
        );
      } else if (
        newPasswordsAreEquals &&
        newPasswordIsNotEqualWithOldPassword
      ) {
        updatePassword(user, newPassword1)
          .then(() => {
            handleSuccessfullSubmit(
              "Password updated succesfully! From now on you must use your new password to log in."
            );
            clearInputValues();
          })
          .catch((error) => {
            handleError(error.message);
          });
      }
    }
  };

  return (
    <Container>
      <h2>Change password</h2>
      <p>Verify your credentials before password change.</p>
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
        <Form onSubmit={handleSubmit} className="form-passwords">
          <span>Password must be at minimum 6 characters long.</span>
          <Form.Label>Type new password</Form.Label>
          <Form.Control
            type="password"
            minLength="6"
            name="new-password-1"
            onChange={(e) => setNewPassword1(e.target.value)}
            defaultValue={newPassword1}
            required
          />
          <Form.Label>Confirm new password</Form.Label>
          <Form.Control
            type="password"
            minLength="6"
            name="new-password-2"
            onChange={(e) => setNewPassword2(e.target.value)}
            defaultValue={newPassword2}
            required
          />
          <Row>
            <Col>
              <Button type="submit" variant="success">
                Save new password
              </Button>
            </Col>
          </Row>
        </Form>
      )}
      {error === true && <ErrorMessage message={errorMessage} />}
      {succesfull === true && <MessageBox message={successMessage} />}
    </Container>
  );
}
