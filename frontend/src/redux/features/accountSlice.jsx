import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  customer_id: "",
  account_number: "",
  account_type: "",
  balance: 0,
  bank: "",
};

const accountBankingSlice = createSlice({
  name: "accountBanking",
  initialState,
  reducers: {
    updateAccount: (state, action) => {
      return {
        ...state,
        _id: action.payload._id,
        customer_id: action.payload.customer_id,
        account_number: action.payload.account_number,
        account_type: action.payload.account_type,
        balance: action.payload.balance,
        bank: action.payload.bank,
      };
    },
    updateBalance: (state, action) => {
      return {
        ...state,
        balance: action.payload,
      };
    },
    clearAccount: () => {
      return initialState;
    },
  },
});

export const { updateAccount, updateBalance, clearAccount } =
  accountBankingSlice.actions;

export default accountBankingSlice.reducer;
