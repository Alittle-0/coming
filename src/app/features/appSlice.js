import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    currentServer: null,
    servers: [],
  },
  reducers: {
    setServers: (state, action) => {
      state.servers = action.payload;
    },
    setCurrentServer: (state, action) => {
      state.currentServer = action.payload;
    },
    updateServerInList: (state, action) => {
        const index = state.servers.findIndex(server => server._id === action.payload._id);
        if (index !== -1) {
          state.servers[index] = action.payload;
        }
      },
  },
});

export const { setServers, setCurrentServer, updateServerInList } = appSlice.actions;

export const selectServers = (state) => state.app.servers;
export const selectCurrentServer = (state) => state.app.currentServer;

export default appSlice.reducer;
