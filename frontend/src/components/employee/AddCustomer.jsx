import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import CustomerService from "../../services/Customer.service";

const AddCustomer = ({ onSuccess }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const response = await CustomerService.createCustomer(
        values.username,
        values.full_name,
        values.email,
        values.phone,
        values.password
      );

      if (response.data) {
        message.destroy("loading");
        message.success("Tạo tài khoản thành công!");
        handleCancel();
        onSuccess();
      }
    } catch (error) {
      message.destroy("loading");
      if (error.response?.data?.message === "Username already exists") {
        message.error("Tên đăng nhập đã tồn tại!");
      } else {
        message.error("Có lỗi xảy ra khi tạo tài khoản!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="primary" onClick={showModal} className="mb-4">
        Thêm Khách Hàng Mới
      </Button>

      <Modal
        title="Thêm Khách Hàng Mới"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
              { min: 6, message: "Tên đăng nhập phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input placeholder="Nhập tên đăng nhập" />
          </Form.Item>

          <Form.Item
            name="full_name"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^\+84[0-9]{9}$/,
                message:
                  "Số điện thoại phải bắt đầu bằng +84 và có 9 chữ số phía sau!",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại (VD: +84123456789)" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item
            name="confirm_password"
            label="Xác nhận mật khẩu"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Xác nhận mật khẩu" />
          </Form.Item>

          <Form.Item className="text-right">
            <Button type="default" onClick={handleCancel} className="mr-2">
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Tạo Tài Khoản
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddCustomer;
