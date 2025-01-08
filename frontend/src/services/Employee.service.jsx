import instance from "./axios.config";

const EmployeeService = {
  getAllEmployee: async () => {
    try {
      const response = await instance.get("/api/employee");
      return response;
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  },

  createEmployee: async (employeeData) => {
    try {
      const response = await instance.post("/api/employee", employeeData);
      return response;
    } catch (error) {
      console.error("Error creating employee:", error);
      throw error;
    }
  },

  updateEmployee: async (employeeId, employeeData) => {
    try {
      const response = await instance.patch(
        `/api/employee/${employeeId}`,
        employeeData
      );
      return response;
    } catch (error) {
      console.error("Error updating employee:", error);
      throw error;
    }
  },

  updateEmployeePassword: async (employeeId, password) => {
    try {
      const response = await instance.patch(
        `/api/employee/${employeeId}/password`,
        {
          password,
        }
      );
      return response;
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  },

  deleteEmployee: async (employeeId) => {
    try {
      const response = await instance.delete(`/api/employee/${employeeId}`);
      return response;
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw error;
    }
  },
};

export default EmployeeService;
