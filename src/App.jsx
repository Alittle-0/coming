import React from "react";
import { useSelector } from "react-redux";
import Sidebar from "./pages/Sidebar";
import Chat from "./pages/Chat";
import "./App.css";

import { selectUser } from "./app/features/userSlice";

function App() {
  const user = useSelector(selectUser);
  return (
    <div className="app">
      {/* Sidebar */}
      <Sidebar />
      {/* Chat */}
      <Chat />
    </div>
  );
}

export default App;
