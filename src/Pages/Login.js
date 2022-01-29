import React, { useState, useContext } from "react";
import "../styles/login.css";
import { auth } from "../firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../Helper/Context";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ErrorMessage from "../Components/Messages/ErrorMessage";

export default function Login() {
  const { user, setUser } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        let currentUser = {id: userCredential.user.uid}
        setUser(currentUser);
        setError(false);
        navigate("/dashboard", { replace: true });
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setError(true);
      });
  };

  return (
    <Container className="container-page">
      <h1>Login to system</h1>
      <Form onSubmit={(e) => handleSubmit(e)} className="login-form">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          onChange={(e) => setUsername(e.target.value)}
          name="email"
        />
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          name="password"
        />
        <div>
          <Button type="submit" variant="primary">
            Login
          </Button>
        </div>
      </Form>
      {error && <ErrorMessage message={errorMessage} />}
    </Container>
  );
}
