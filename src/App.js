import React, { useState } from "react";

import "./styles/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth } from "./firebase-config";
import { onAuthStateChanged } from "firebase/auth";

import { UserContext } from "./Helper/Context";
import Login from "./Pages/Login";
import LogOut from "./Components/UserHandeling/LogOut";
import Dashboard from "./Pages/Dashboard";
import MenuItems from "./Pages/MenuItems";
import RequireAuth from "./Helper/RequireAuth";

function App() {
  const [user, setUser] = useState(null);

  return (
    <main>
      <Router>
        <UserContext.Provider value={{ user, setUser }}>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/logout" element={<LogOut />} />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/menuitems"
              element={
                <RequireAuth>
                  <MenuItems />
                </RequireAuth>
              }
            />
          </Routes>
        </UserContext.Provider>
      </Router>
    </main>
  );
}

export default App;
