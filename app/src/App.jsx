import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Saved from "./pages/Saved";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/saved" element={<Saved />} />
          </Routes>
        </main>

        <ToastContainer 
          position="bottom-right" 
          autoClose={1000}
          theme='dark'
          hideProgressBar={true}
        />
      </div>
    </Router>
  );
}

export default App;
