import instance from "./axios.config";

const AuthService = {
  customer: {
    async login(username, password) {
      try {
        const response = await instance.post(`/api/auth/customer/login`, {
          username,
          password,
        });
        return response;
      } catch (error) {
        console.error("Error fetching data: ", error);
        return { data: null, error: error.message || "An error occurred" };
      }
    },
    async register(username, full_name, email, phone, password) {
      try {
        const response = await instance.post(`/api/auth/customer/register`, {
          username,
          full_name,
          email,
          phone,
          password,
        });
        return response;
      } catch (error) {
        console.error("Error fetching data: ", error);
        return { data: null, error: error.message || "An error occurred" };
      }
    },
    async logout(username) {
      try {
        const response = await instance.get(`/api/auth/customer/logout`, {
          username,
        });
        return response;
      } catch (error) {
        console.error("Error fetching data: ", error);
        return { data: null, error: error.message || "An error occurred" };
      }
    },
    async refresh(username, refresh_token) {
      try {
        const response = await instance.get(`/api/auth/customer/refresh`, {
          username,
          refresh_token,
        });
        return response;
      } catch (error) {
        console.error("Error fetching data: ", error);
        return { data: null, error: error.message || "An error occurred" };
      }
    },
    async getCodeOTP(email, username) {
      try {
        const response = await instance.post(
          `/api/auth/customer/forgot-password`,
          {
            email,
            username,
          }
        );
        return response;
      } catch (error) {
        console.error("Error fetching data: ", error);
        return { data: null, error: error.message || "An error occurred" };
      }
    },
    async resetPassword(username, code, password, confirm_password) {
      try {
        const response = await instance.post(
          `/api/auth/customer/reset-password`,
          {
            username,
            code,
            password,
            confirm_password,
          }
        );
        return response;
      } catch (error) {
        console.error("Error fetching data: ", error);
        return { data: null, error: error.message || "An error occurred" };
      }
    },
  },
  employee: {
    async login(username, password) {
      try {
        const response = await instance.post(`/api/auth/employee/login`, {
          username,
          password,
        });
        return response;
      } catch (error) {
        console.error("Error fetching data: ", error);
        return { data: null, error: error.message || "An error occurred" };
      }
    },
    async register(username, full_name, email, password) {
      try {
        const response = await instance.post(`/api/auth/employee/register`, {
          username,
          full_name,
          email,
          password,
        });
        return response;
      } catch (error) {
        console.error("Error fetching data: ", error);
        return { data: null, error: error.message || "An error occurred" };
      }
    },
    async logout(username) {
      try {
        const response = await instance.post(`/api/auth/employee/logout`, {
          username,
        });
        return response;
      } catch (error) {
        console.error("Error fetching data: ", error);
        return { data: null, error: error.message || "An error occurred" };
      }
    },
    async refresh(username, refresh_token) {
      try {
        const response = await instance.post(`/api/auth/employee/refresh`, {
          username,
          refresh_token,
        });
        return response;
      } catch (error) {
        console.error("Error fetching data: ", error);
        return { data: null, error: error.message || "An error occurred" };
      }
    },
  },
  admin: {
    async login(username, password) {
      try {
        const response = await instance.post(`/api/auth/admin/login`, {
          username,
          password,
        });
        return response;
      } catch (error) {
        console.error("Error fetching data: ", error);
        return { data: null, error: error.message || "An error occurred" };
      }
    },
    async register(username, full_name, email, password) {
      try {
        const response = await instance.post(`/api/auth/admin/register`, {
          username,
          full_name,
          email,
          password,
        });
        return response;
      } catch (error) {
        console.error("Error fetching data: ", error);
        return { data: null, error: error.message || "An error occurred" };
      }
    },
    async logout(username) {
      try {
        const response = await instance.post(`/api/auth/admin/logout`, {
          username,
        });
        return response;
      } catch (error) {
        console.error("Error fetching data: ", error);
        return { data: null, error: error.message || "An error occurred" };
      }
    },
    async refresh(username, refresh_token) {
      try {
        const response = await instance.post(`/api/auth/admin/refresh`, {
          username,
          refresh_token,
        });
        return response;
      } catch (error) {
        console.error("Error fetching data: ", error);
        return { data: null, error: error.message || "An error occurred" };
      }
    },
  },
};

export default AuthService;
