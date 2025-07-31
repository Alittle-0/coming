const API_BASE_URL =
  process.env.REACT_APP_BACKEND_BASE_URL || "http://localhost:6001";

console.log("API_BASE_URL:", API_BASE_URL);
class ApiService {
  constructor() {
    this.refreshPromise = false;
  }
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
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
            Authorization: `Bearer ${token}`,
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

      return { success: true };
    } catch (error) {
      // Even if API call fails, clear local state
      localStorage.removeItem("accessToken");
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

  async refreshAccessToken() {
    // Return existing promise if refresh is already in progress
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this._performTokenRefresh();
    return this.refreshPromise;
  }

  async _performTokenRefresh() {
    try {
      const response = await fetch(`${API_BASE_URL}/user/requestRefreshToken`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Token refresh failed");
      }

      const { accessToken } = await response.json();

      if (!accessToken) {
        throw new Error("No access token received");
      }

      localStorage.setItem("accessToken", accessToken);
    } catch (error) {
      localStorage.removeItem("accessToken");
      throw error;
    } finally {
      this.refreshPromise = null;
    }
  }

  async validateTokenLocally() {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.log("No access token found in localStorage");
      return { isValid: false, shouldSignOut: true };
    }
    const tokenData = JSON.parse(atob(accessToken.split(".")[1]));
    console.log("Token payload:", tokenData);

    if (tokenData.exp * 1000 > Date.now()) {
      return {
        isValid: true,
        userData: {
          id: tokenData.id,
          email: tokenData.email,
          username: tokenData.username,
        },
      };
    } else {
      console.log("Access token expired, attempting refresh...");
      try {
        await this.refreshAccessToken();
        const newToken = localStorage.getItem("accessToken");

        if (!newToken) {
          return { isValid: false, shouldSignOut: true };
        }

        const newTokenData = JSON.parse(atob(newToken.split(".")[1]));

        return {
          isValid: true,
          userData: {
            id: newTokenData.id,
            username: newTokenData.username,
          },
        };
      } catch (error) {
        console.error("Token refresh failed:", error);
        localStorage.removeItem("accessToken");
        return { isValid: false, shouldSignOut: true };
      }
    }
  }

  async getUserServers() {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found");
    }
    try {
      const response = await fetch(`${API_BASE_URL}/server`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch channels");
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching channels:", error);
      throw error;
    }
  }

  async getServerById(serverId) {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found");
    }

    try {
      console.log("Fetching server by ID:", serverId);
      const response = await fetch(`${API_BASE_URL}/server/${serverId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch server");
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching server by ID:", error);
      throw error;
    }
  }

  async createChannel(serverId, channelData) {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found");
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/server/${serverId}/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
          body: JSON.stringify(channelData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create channel");
      }

      return response.json();
    } catch (error) {
      console.error("Error creating channel:", error);
      throw error;
    }
  }

  async sendMessage(channelId, messageContent) {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/messages/${channelId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({ message: messageContent }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send message");
      }

      return response.json();
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  async getMessages(channelId, limit = 50) {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found");
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/messages/${channelId}?limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch messages");
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  }
}

const apiService = new ApiService();
export default apiService;
