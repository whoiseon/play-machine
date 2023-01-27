import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  moneyInvested: 0,
  productList: [],
  history: [],
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    loadProductsStore: (state) => {
      state.moneyInvested = JSON.parse(localStorage.getItem('productStore')).moneyInvested;
      state.history = JSON.parse(localStorage.getItem('productStore')).history;
      state.productList = JSON.parse(localStorage.getItem('productStore')).productList;
    },
    addMoneyInvest: (state, action) => {
      state.moneyInvested = state.moneyInvested + action.payload;
    },
    returnMoneyInvested: (state, action) => {
      state.moneyInvested = 0;
    },
    addProduct: (state, action) => {
      state.productList.unshift(action.payload.productObject);
      state.history.unshift(action.payload.historyObject);
    },
    removeProduct: (state, action) => {
      state.productList = state.productList.filter((p) => p.name !== action.payload);
    },
    buyProduct: (state, action) => {
      state.moneyInvested = state.moneyInvested - action.payload.price;
      state.history.unshift(action.payload.newHistoryObject);

      const getProductIndex = state.productList.findIndex((product) => product.name === action.payload.name);
      const findProduct = state.productList[getProductIndex]
      state.productList[getProductIndex].count = findProduct?.count - 1;
      state.productList[getProductIndex].salesCount = findProduct?.salesCount + 1;
      state.productList[getProductIndex].totalSales = findProduct?.totalSales + (findProduct?.price * 0.6);
    }
  }
});

export const { loadProductsStore, addMoneyInvest, returnMoneyInvested, addProduct, removeProduct, buyProduct } = productSlice.actions;

export default productSlice;
