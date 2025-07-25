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

  // Handle user state changes
  useEffect(() => {
    console.log("Current user state:", user);
  }, [user]);

  // Handle user login/logout events
  useEffect(() => {
    const handleUserLogin = (event) => {
      const userData = event.detail;
      dispatch(signIn(userData));
      console.log("User signed in via event:", userData);
    };

    const handleUserLogout = () => {
      dispatch(signOut());
      console.log("User signed out via event");
    };

    window.addEventListener("userLogin", handleUserLogin);
    window.addEventListener("userLogout", handleUserLogout);

    return () => {
      window.removeEventListener("userLogin", handleUserLogin);
      window.removeEventListener("userLogout", handleUserLogout);
    };
  }, [dispatch]);

  // Token validation on app mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      try {
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        if (tokenData.exp * 1000 > Date.now()) {
          console.log("Token is valid");
          // If token is valid but no user, you might want to fetch user data
          if (!user) {
            // You could dispatch an action to fetch user data here
            // dispatch(fetchUserFromToken(token));
          }
        } else {
          localStorage.removeItem("accessToken");
          if (user) {
            dispatch(signOut());
          }
        }
      } catch (error) {
        localStorage.removeItem("accessToken");
        if (user) {
          dispatch(signOut());
        }
      }
    } else if (user) {
      dispatch(signOut());
    }
  }, [dispatch, user]);

  return (
    <div className="app">
      {user ? (
        <>
          <Sidebar />
          <Chat />
        </>
      ) : (
        <SignIn />
      )}
    </div>
  );
}

export default App;
