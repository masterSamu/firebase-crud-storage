import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
//import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./Pages/Dashboard";
import MenuItems from "./Pages/MenuItems";

function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route exact path="/" element={<Dashboard />} />
          <Route path="/menuitems" element={<MenuItems />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
