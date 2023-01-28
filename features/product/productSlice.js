import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sales: true,
  moneyInvested: 0,
  productList: [],
  history: [],
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    addMoneyInvest: (state, action) => {
      state.moneyInvested = state.moneyInvested + action.payload;
    },
    resetMoneyInvested: (state) => {
      state.moneyInvested = 0;
    },
    addProduct: (state, action) => {
      state.productList.unshift(action.payload.productObject);
      state.history.unshift(action.payload.historyObject);
    },
    removeProduct: (state, action) => {
      const findHistoryIndex = state.history.findIndex((h) => h.dateTime.timestamp === action.payload.timestamp);
      state.productList = state.productList.filter((p) => p.name !== action.payload.productName);
      state.history.splice(findHistoryIndex, 1);
    },
    resetProductCount: (state, action) => {
      state.productList = state.productList.map((product) => {
        return ({
          ...product,
          count: product.count === 0 ? product.initialCount : product.count,
          refill: product.refill + 1
        })
      });
      state.history.unshift(...action.payload);
    },
    buyProduct: (state, action) => {
      state.moneyInvested = state.moneyInvested - action.payload.price;
      state.history.unshift(action.payload.newHistoryObject);

      const getProductIndex = state.productList.findIndex((product) => product.name === action.payload.name);
      const findProduct = state.productList[getProductIndex];

      state.productList[getProductIndex].count -= 1;
      state.productList[getProductIndex].salesCount += 1;
      state.productList[getProductIndex].totalSales = findProduct?.totalSales + (findProduct?.price * 0.6);
    },
    stopSalesState: (state, action) => {
      const getProductIndex = state.productList.findIndex((product) => product.name === action.payload.name);

      state.productList = state.productList.map((product) => {
        return ({
          ...product,
          best: false,
        })
      });

      state.productList[getProductIndex].price += 100;
      state.productList[getProductIndex].best = true;
      state.sales = false;
    },
    updateRestartProduct: (state) => {
      state.productList = state.productList.map((product) => {
        return ({
          ...product,
          totalSales: 0,
          salesCount: 0,
        })
      });

      state.history = [];
      state.moneyInvested = 0;
      state.sales = true;
    }
  }
});

export const { addMoneyInvest, resetMoneyInvested, resetProductCount, addProduct, removeProduct, buyProduct, stopSalesState, updateRestartProduct } = productSlice.actions;

export default productSlice;
