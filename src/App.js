import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
//import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./Pages/Dashboard"

function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route exact path="/" element={<Dashboard />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
