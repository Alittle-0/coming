import { createSlice } from "@reduxjs/toolkit";

export const serverSlice = createSlice({
  name: "server",
  initialState: {
    channelId: null,
    channelName: null,
    channelType: null,
    channelDescription: null,
  },
  reducers: {
    setChannelInfo: (state, action) => {
      state.channelId = action.payload.channelId;
      state.channelName = action.payload.channelName;
      state.channelType = action.payload.channelType;
      state.channelDescription = action.payload.channelDescription;
    },
  },
});

export const { setChannelInfo } = serverSlice.actions;

export const selectChannelId = (state) => state.server.channelId;
export const selectChannelName = (state) => state.server.channelName;
export const selectChannelType = (state) => state.server.channelType;
export const selectChannelDescription = (state) => state.server.channelDescription;

export default serverSlice.reducer;
