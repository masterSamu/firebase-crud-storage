import React, { useState, useEffect, useContext } from "react";
import { auth } from "../../firebase-config";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import ErrorMessage from "../Messages/ErrorMessage";
import { UserContext } from "../../Helper/Context";
import { signOut } from "firebase/auth";

export default function LogOut() {
  const {user, setUser} = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    signOut(auth)
      .then(() => {
        setUser(undefined);
        navigate("/login", { replace: true });
      })
      .catch((error) => {
        return <ErrorMessage message={error.message} />
      });
  }, []);
  return <></>;
}
