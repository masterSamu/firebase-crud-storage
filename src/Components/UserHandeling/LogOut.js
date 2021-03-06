import React, { useEffect, useContext } from "react";
import { auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
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
        localStorage.removeItem("user");
      })
      .catch((error) => {
        return <ErrorMessage message={error.message} />
      });
  }, []);
  return <></>;
}
