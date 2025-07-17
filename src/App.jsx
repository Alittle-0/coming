import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "./pages/Sidebar";
import Chat from "./pages/Chat";
import SignIn from "./pages/SignIn";
import { signIn, signOut, selectUser } from "./app/features/userSlice";
import "./App.css";


function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check for stored token on app load
    const token = localStorage.getItem('accessToken');
    
    if (token && !user) {
      // You could validate the token here by making an API call
      // For now, we'll just check if token exists
      console.log("Token found, but no user data");
      // You might want to fetch user data or validate token here
    } else if (!token && !user) {
      dispatch(signOut());
      console.log("No token found, user signed out");
    }
  }, [dispatch, user]);

  return (
    <div className="app">
    {user ? (
      <>
      {/* Sidebar */}
      <Sidebar />
      {/* Chat */}
      <Chat />
      </>
    ) : (
      <SignIn />
    )}
    </div>
  );
}

export default App;
