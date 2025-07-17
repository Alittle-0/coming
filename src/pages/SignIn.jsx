import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, TextField, Box, Typography, Alert } from '@mui/material';
import { signIn } from '../app/features/userSlice';
import ApiService from '../app/services/apiServices';
import "../styles/SignIn.css";

function SignIn() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await ApiService.login(formData.username, formData.password);
      
      // Store access token
      localStorage.setItem('accessToken', response.accessToken);
      
      // Dispatch sign in action with user data
      dispatch(signIn({
        userId: response._id,
        userName: response.username,
        email: response.email,
        avatar: response.avatar || "defaultAvatar.jpg",
      }));

      console.log("Login successful:", response);
    } catch (error) {
      setError(error.message);
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='signin'>
      <div className="signin__logo">
        <img src="/logoComing.jpg" alt="Coming Logo"/>
      </div>

      <Box component="form" onSubmit={handleSignIn} sx={{ width: '300px' }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <TextField
          fullWidth
          name="username"
          label="Username or Email"
          value={formData.username}
          onChange={handleChange}
          margin="normal"
          required
          sx={{ mb: 2 }}
        />
        
        <TextField
          fullWidth
          name="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          required
          sx={{ mb: 2 }}
        />

        <Button 
          className='signin__button' 
          type="submit"
          fullWidth
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </Box>
    </div>
  );
}

/*function SignIn() {
    const signIn = () => {
        // Logic for signing in
        console.log("Sign in clicked");
    }
  return (
    <div className='signin'>
      <div className="signin__logo">
        <img src="/logoComing.jpg" alt="Coming Logo"/>
      </div>

      <Button className='signin__button' onClick={signIn}>Sign in</Button>
    </div>
  )
}*/

export default SignIn
