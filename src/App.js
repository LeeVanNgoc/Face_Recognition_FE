import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./layouts/Dashboard";
import Attendance01 from "./container/Attendance01/index";
import Attendance02 from "./container/Attendance02/index";

import User01 from "./container/User01/index";
import User02 from "./container/User02/index";
import User0102 from "./container/User0102/index";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/user" element={<User01/>} />
        <Route path="/user_add" element={<User0102 />} />
        <Route path="/user_collect" element={<User02 />} />
        <Route path="/attendance" element={<Attendance01/>} />
        <Route path="/attendance/collect" element={<Attendance02/>} />

      </Routes>
    </Router>
  );
}

export default App;
