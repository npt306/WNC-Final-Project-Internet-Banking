import React, { useState, useEffect, useRef } from "react";
import { Table, Button, Modal, Form, Input, message, Popconfirm } from "antd";
import ColumnSearch from "~/hooks/useSearchTable";
import EmployeeService from "../../services/Employee.service";
import { debounce } from "lodash";

// Cấu hình message global
message.config({
  duration: 2,
  maxCount: 1, // Chỉ hiển thị tối đa 1 message cùng lúc
});

const ManagerEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const errorShownRef = useRef(false);

  // Tạo debounced message
  const debouncedError = debounce((msg) => {
    message.error(msg);
  }, 300);

  useEffect(() => {
    fetchEmployees();
    // Cleanup
    return () => {
      debouncedError.cancel();
    };
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await EmployeeService.getAllEmployee();
      if (response.data) {
        setEmployees(response.data);
        errorShownRef.current = false;
      }
    } catch (error) {
      if (!errorShownRef.current) {
        message.error("Không thể tải danh sách nhân viên");
        errorShownRef.current = true;
      }
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleEditEmployee = (record) => {
    setEditingEmployee(record);
    setIsModalVisible(true);
    form.setFieldsValue({
      username: record.username,
      full_name: record.full_name,
      email: record.email,
    });
  };

  const handleChangePassword = (record) => {
    setEditingEmployee(record);
    setIsPasswordModalVisible(true);
    passwordForm.resetFields();
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await EmployeeService.deleteEmployee(employeeId);
      message.success("Xóa nhân viên thành công");
      fetchEmployees();
    } catch (error) {
      message.error("Không thể xóa nhân viên");
    }
  };

  const handleSaveEmployee = async () => {
    try {
      const values = await form.validateFields();
      if (editingEmployee) {
        // Cập nhật nhân viên
        await EmployeeService.updateEmployee(editingEmployee._id, values);
        message.success("Cập nhật thông tin nhân viên thành công");
      } else {
        // Thêm nhân viên mới
        await EmployeeService.createEmployee(values);
        message.success("Thêm nhân viên mới thành công");
      }
      setIsModalVisible(false);
      fetchEmployees();
    } catch (error) {
      message.error("Có lỗi xảy ra");
      console.error("Error saving employee:", error);
    }
  };

  const handleSavePassword = async () => {
    try {
      const values = await passwordForm.validateFields();
      await EmployeeService.updateEmployeePassword(
        editingEmployee._id,
        values.password
      );
      message.success("Cập nhật mật khẩu thành công");
      setIsPasswordModalVisible(false);
    } catch (error) {
      message.error("Không thể cập nhật mật khẩu");
      console.error("Error updating password:", error);
    }
  };

  const columns = [
    {
      title: "Tên Đăng Nhập",
      dataIndex: "username",
      key: "username",
      ...ColumnSearch("username"),
    },
    {
      title: "Họ và Tên",
      dataIndex: "full_name",
      key: "full_name",
      ...ColumnSearch("full_name"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...ColumnSearch("email"),
    },
    {
      title: "Hành Động",
      key: "action",
      render: (_, record) => (
        <div className="space-x-2">
          <Button type="link" onClick={() => handleEditEmployee(record)}>
            Chỉnh Sửa
          </Button>
          <Button type="link" onClick={() => handleChangePassword(record)}>
            Đổi Mật Khẩu
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa nhân viên này?"
            onConfirm={() => handleDeleteEmployee(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Quản Lý Nhân Viên</h1>
      <Button type="primary" onClick={handleAddEmployee} className="mb-4">
        Thêm Nhân Viên
      </Button>
      <Table
        columns={columns}
        dataSource={employees}
        rowKey="_id"
        loading={loading}
      />

      {/* Modal Thêm/Sửa Nhân Viên */}
      <Modal
        title={editingEmployee ? "Chỉnh Sửa Nhân Viên" : "Thêm Nhân Viên"}
        open={isModalVisible}
        onOk={handleSaveEmployee}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Tên Đăng Nhập"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            ]}
          >
            <Input placeholder="Nhập tên đăng nhập" />
          </Form.Item>
          <Form.Item
            name="full_name"
            label="Họ và Tên"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Vui lòng nhập email hợp lệ!",
              },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
          {!editingEmployee && (
            <Form.Item
              name="password"
              label="Mật Khẩu"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* Modal Đổi Mật Khẩu */}
      <Modal
        title="Đổi Mật Khẩu"
        open={isPasswordModalVisible}
        onOk={handleSavePassword}
        onCancel={() => setIsPasswordModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item
            name="password"
            label="Mật Khẩu Mới"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManagerEmployee;
