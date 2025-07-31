import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "./pages/Sidebar";
import Chat from "./pages/Chat";
import SignIn from "./pages/SignIn";
import { signIn, signOut, selectUser } from "./app/features/userSlice";
import { selectServers, setServers } from "./app/features/appSlice";
import apiService from "./app/services/apiServices";
import "./App.css";

function App() {
  const user = useSelector(selectUser);
  const servers = useSelector(selectServers);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  // Handle user state changes
  useEffect(() => {
    console.log("Current user state:", user);
  }, [user]);

  // Token validation on app mount
  useEffect(() => {
    const validateUser = async () => {
      try {
        setIsLoading(true);
        const result = await apiService.validateTokenLocally();

        if (result.isValid) {
          console.log("Valid token found");
          dispatch(signIn(result.userData));
        } else if (result.shouldSignOut) {
          dispatch(signOut());
        }
      } catch (error) {
        console.error("Token validation error:", error);
        dispatch(signOut());
      } finally {
        setIsLoading(false);
      }
    };

    validateUser();
  }, [dispatch]);

  // Fetch servers when user is authenticated
  useEffect(() => {
    const fetchServers = async () => {
      try {
        console.log("Fetching servers for user:", user.id);
        const response = await apiService.getUserServers();

        if (response && Array.isArray(response)) {
          console.log("Servers fetched:", response);
          dispatch(setServers(response));
        }
      } catch (error) {
        console.error("Error fetching servers in App:", error);
      }
    };

    // Fetch servers if user exists and servers haven't been loaded yet
    if (user && servers.length === 0) {
      fetchServers();
    }
  }, [user, dispatch, servers.length]);

  if (isLoading) {
    return (
      <div
        className="app"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  } else {
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
}

export default App;
