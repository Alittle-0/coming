import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, TextField, Box, Typography, Alert } from "@mui/material";
import apiService from "../app/services/apiServices";
import { signIn } from "../app/features/userSlice";
import "../styles/SignIn.css";

function SignIn() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await apiService.login(formData.username, formData.password);

      dispatch(signIn(user));
      console.log("Login successful");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin">
      <div className="signin__logo">
        <img src="/logoComing.jpg" alt="logo" />
      </div>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 2, width: "300px" }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          margin="normal"
          name="username"
          label="Username or Email"
          type="text"
          value={formData.username}
          onChange={handleChange}
          required
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "var(--white-color)",
              "& fieldset": { borderColor: "var(--light-grey-color)" },
              "&:hover fieldset": { borderColor: "var(--white-color)" },
            },
            "& .MuiInputLabel-root": { color: "var(--light-grey-color)" },
          }}
        />

        <TextField
          fullWidth
          margin="normal"
          name="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "var(--white-color)",
              "& fieldset": { borderColor: "var(--light-grey-color)" },
              "&:hover fieldset": { borderColor: "var(--white-color)" },
            },
            "& .MuiInputLabel-root": { color: "var(--light-grey-color)" },
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          className="signin__button"
          sx={{ mt: 2 }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </Box>
    </div>
  );
}

export default SignIn;
