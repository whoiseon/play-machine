import { createSlice } from "@reduxjs/toolkit";
import {userList} from "../../public/data/user";

const initialState = {
  myInfo: null,
  userData: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loadUserData: (state, action) => {
      state.userData = userList;
    },
    requestLoginUser: (state, action) => {
      state.myInfo = action.payload;
    },
    signOut: (state) => {
      state.myInfo = null;
    },
    myMoneyInvest: (state, action) => {
      const findUserIndex = state.userData.findIndex((user) => user.id === action.payload.userId);
      state.userData[findUserIndex].money -= action.payload.moneyInvested;
      state.myInfo.money -= action.payload.moneyInvested;
    },
    myMoneyInvestedReturn: (state, action) => {
      const findUserIndex = state.userData.findIndex((user) => user.id === action.payload.userId);
      state.userData[findUserIndex].money += action.payload.changes;
      state.myInfo.money += action.payload.changes;
    },
    buyProductUser: (state, action) => {
      const findUserIndex = state.userData.findIndex((user) => user.id === action.payload.userId);
      state.userData[findUserIndex].totalSalesCount += 1;
      state.userData[findUserIndex].totalSales += action.payload.price;
      state.myInfo.totalSalesCount += 1;
      state.myInfo.totalSales += action.payload.price;
    }
  }
});

export const { loadUserData, myMoneyInvest, requestLoginUser, myMoneyInvestedReturn, buyProductUser, signOut } = userSlice.actions;

export default userSlice;
