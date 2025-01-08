import React, { useState } from "react";
import { Form, Input, Button, Alert, Card, Steps } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import AuthService from "../../services/Auth.service";
import { useNavigate } from "react-router-dom";

const { Step } = Steps;

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form] = Form.useForm();
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  // Xử lý gửi mã OTP
  const handleGetOTP = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.customer.getCodeOTP(
        values.email,
        values.username
      );
      if (response.data) {
        setUserInfo(values);
        setCurrentStep(1);
        form.resetFields(["code", "password", "confirm_password"]);
      } else {
        setError("Email hoặc tên đăng nhập không chính xác");
      }
    } catch (error) {
      setError("Có lỗi xảy ra khi gửi mã OTP");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đặt lại mật khẩu
  const handleResetPassword = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.customer.resetPassword(
        userInfo.username,
        values.code,
        values.password,
        values.confirm_password
      );
      if (response.data) {
        navigate("/");
      } else {
        setError("Mã OTP không chính xác hoặc đã hết hạn");
      }
    } catch (error) {
      setError("Có lỗi xảy ra khi đặt lại mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Xác thực thông tin",
      content: (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleGetOTP}
          requiredMark={false}
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Tên đăng nhập"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full"
              size="large"
            >
              Gửi mã OTP
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Đặt lại mật khẩu",
      content: (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleResetPassword}
          requiredMark={false}
        >
          <Form.Item
            name="code"
            rules={[{ required: true, message: "Vui lòng nhập mã OTP!" }]}
          >
            <Input placeholder="Nhập mã OTP" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu mới"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="confirm_password"
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
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full"
              size="large"
            >
              Đặt lại mật khẩu
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Quên mật khẩu</h1>
          <p className="text-gray-600">
            {currentStep === 0
              ? "Nhập thông tin để lấy mã OTP"
              : "Nhập mã OTP và mật khẩu mới"}
          </p>
        </div>

        <Steps current={currentStep} className="mb-8">
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className="mb-4"
            closable
            onClose={() => setError(null)}
          />
        )}

        {steps[currentStep].content}

        <div className="text-center mt-4">
          <Button type="link" onClick={() => navigate("/")}>
            Quay lại đăng nhập
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;
