import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        <Dashboard className="w-screen" />
      </main>
      <Footer className="w-screen" />
    </div>
  );
}

export default App;
