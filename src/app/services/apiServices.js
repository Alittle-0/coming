const API_BASE_URL = process.env.BACKEND_BASE_URL || "http://localhost:6001";

console.log("API_BASE_URL:", API_BASE_URL);
class ApiService {
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for refresh token
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }

      const userData = {
        id: data._id,
        username: data.username,
        email: data.email,
        avatar: data.avatar,
      };

      // Emit login event from service layer
      const loginEvent = new CustomEvent("userLogin", {
        detail: userData,
      });
      window.dispatchEvent(loginEvent);

      return userData;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      const token = localStorage.getItem("accessToken");
      
      if (token) {
        const response = await fetch(`${API_BASE_URL}/user/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Logout failed");
        }
      }

      // Clear token regardless of API call success
      localStorage.removeItem("accessToken");
      
      // Emit logout event
      const logoutEvent = new CustomEvent("userLogout");
      window.dispatchEvent(logoutEvent);
      
      return { success: true };
    } catch (error) {
      // Even if API call fails, clear local state
      localStorage.removeItem("accessToken");
      
      // Still emit logout event to clear UI state
      const logoutEvent = new CustomEvent("userLogout");
      window.dispatchEvent(logoutEvent);
      
      throw error;
    }
  }

  async register(username, email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return data;
    } catch (error) {
      throw error;
    }
  }
}

const apiService = new ApiService();
export default apiService;
