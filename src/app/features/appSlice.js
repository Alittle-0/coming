import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    channelId: null,
    channelName: null,
  },
  reducers: {
    setChannelId: (state, action) => {
      state.channelId = action.payload; // Fixed: removed +=
    },
    setChannelName: (state, action) => {
      state.channelName = action.payload; // Added this reducer
    },
  },
});

export const { setChannelId, setChannelName } = appSlice.actions;

export const selectChannelId = (state) => state.app.channelId;
export const selectChannelName = (state) => state.app.channelName;

export default appSlice.reducer;
