import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchUserInfo: (state, action) => {
      state.userInfo = action.payload
    },
    updateUserInfo: (state, action) => {
      state.userInfo = JSON.parse(localStorage.getItem('loggingUser'))
    },
    signOut: (state) => {
      state.userInfo = null;
    },
  }
});

export const { fetchUserInfo, updateUserInfo, signOut } = userSlice.actions;

export default userSlice;
