import { message } from "antd";
import instance from "./axios.config";

const AccountService = {
  getAllAccount: async () => {
    try {
      const response = await instance.get("/api/account/all");
      return response;
    } catch (error) {
      console.error("Error fetching accounts:", error);
      throw error;
    }
  },

  selectAccountByCustomerid: async (customer_id) => {
    try {
      const response = await instance.get(`/api/account/${customer_id}`);
      return response;
    } catch (error) {
      console.error("Error fetching account:", error);
      throw error;
    }
  },

  createAccount: async (accountData) => {
    try {
      const response = await instance.post("/api/account", accountData);
      return response;
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  },

  updateAccount: async (accountId, accountData) => {
    try {
      const response = await instance.put(
        `/api/account/${accountId}`,
        accountData
      );
      return response;
    } catch (error) {
      console.error("Error updating account:", error);
      throw error;
    }
  },
  depositAcount: async (receiver, amount) => {
    try {
      const response = await instance.post(`/api/transaction/deposit`, {
        receiver: receiver,
        amount: Number(amount),
      });
      return response;
    } catch (error) {
      console.error("Error depositing account:", error);
      throw error;
    }
  },

  updateBalance: async (account_number, balance) => {
    try {
      const response = await instance.post(`/api/account/balance`, {
        balance: Number(balance),
        account_number: account_number,
      });
      return response;
    } catch (error) {
      console.error("Error updating balance:", error);
      throw error;
    }
  },

  deleteAccount: async (accountId) => {
    try {
      const response = await instance.delete(`/api/account/${accountId}`);
      return response;
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  },
  getInfoAccountNumberID: async (account_number) => {
    try {
      const response = await instance.get(
        `/api/account/customer-information/${account_number}`
      );
      return response;
    } catch (error) {
      console.error("Error fetching account:", error);
      throw error;
    }
  },
};

export default AccountService;
