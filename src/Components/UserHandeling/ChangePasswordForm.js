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

import "../../styles/UserSettings.css";

export default function ChangePasswordForm() {
  const user = auth.currentUser;
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [succesfull, setSuccesfull] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPasswordsAreEquals = newPassword1 === newPassword2;
    const newPasswordIsNotEqualWithOldPassword = oldPassword !== newPassword1;
    if (!newPasswordsAreEquals) {
      setSuccesfull(false);
      setSuccessMessage("");
      setError(true);
      setErrorMessage("New passwords are not equals!");
    } else if (!newPasswordIsNotEqualWithOldPassword) {
      setSuccesfull(false);

      setError(true);
      setErrorMessage(
        "New password is equal with old password! Can't use same password again."
      );
    } else if (newPasswordsAreEquals && newPasswordIsNotEqualWithOldPassword) {
      updatePassword(user, newPassword1)
        .then(() => {
          setSuccesfull(true);
          setSuccessMessage("Password updated succesfully!");
          setError(false);
          setErrorMessage("");
        })
        .catch((error) => {
          setSuccesfull(false);
          setError(true);
          setErrorMessage(error.message);
          setSuccessMessage("");
        });
    }
  };

  return (
    <Container>
      <h2>Change password</h2>
      <p>Password should be at minimum 6 characters long.</p>
      <Form onSubmit={handleSubmit} className="form-passwords">
        <Form.Label>Type current password</Form.Label>
        <Form.Control
          type="password"
          minLength="6"
          name="old-password"
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <Form.Label>Type new password</Form.Label>
        <Form.Control
          type="password"
          minLength="6"
          name="new-password-1"
          onChange={(e) => setNewPassword1(e.target.value)}
        />
        <Form.Label>Confirm new password</Form.Label>
        <Form.Control
          type="password"
          minLength="6"
          name="new-password-2"
          onChange={(e) => setNewPassword2(e.target.value)}
        />
        <Row>
            <Col>
                <Button type="submit" variant="success">Save</Button>
            </Col>
        </Row>
      </Form>
      {error == true && <ErrorMessage message={errorMessage} />}
      {succesfull == true && <MessageBox message={successMessage} />}
    </Container>
  );
}
