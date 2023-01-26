import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productList: [],
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    loadProductsList: (state) => {
      state.productList = JSON.parse(localStorage.getItem('productStore'));
    },
    addProduct: (state, action) => {
      state.productList.unshift(action.payload);
    },
    removeProduct: (state, action) => {
      state.productList = state.productList.filter((p) => p.name !== action.payload);
    }
  }
});

export const { loadProductsList, addProduct, removeProduct } = productSlice.actions;

export default productSlice;
