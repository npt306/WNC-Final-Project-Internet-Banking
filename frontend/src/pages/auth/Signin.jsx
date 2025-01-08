import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Alert, Tabs, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import AuthService from "../../services/Auth.service";
import AccountService from "../../services/Account.service";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUserInfo, setRole } from "../../redux/features/profileSlice";
import { updateAccount } from "../../redux/features/accountSlice";
import ReCAPTCHA from "react-google-recaptcha";

const SignIn = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogintest = async (role) => {
    dispatch(setRole(role));
  };
  const handleLogin = async (values, role) => {
    // if (!isVerified) {
    //   message.error("Vui lòng xác thực Captcha trước khi đăng nhập!");
    //   return;
    // }

    setLoading(true);
    setErrorMessage(null);
    try {
      let response;
      switch (role) {
        case "customer":
          response = await AuthService.customer.login(
            values.username,
            values.password
          );
          if (response.data) {
            dispatch(updateUserInfo(response.data.user));
            localStorage.setItem(
              "accessToken",
              response.data.tokens.accessToken
            );
            localStorage.setItem(
              "refreshToken",
              response.data.tokens.refreshToken
            );

            try {
              const accountResponse =
                await AccountService.selectAccountByCustomerid(
                  response.data.user._id
                );
              dispatch(updateAccount(accountResponse.data[0]));
              navigate("/");
            } catch (accountError) {
              console.error("Error fetching account:", accountError);
            }
          }
          break;
        case "employee":
          response = await AuthService.employee.login(
            values.username,
            values.password
          );
          if (response.data) {
            dispatch(updateUserInfo(response.data.user));
            localStorage.setItem(
              "accessToken",
              response.data.tokens.accessToken
            );
            localStorage.setItem(
              "refreshToken",
              response.data.tokens.refreshToken
            );
            navigate("/");
          }
          break;
        case "admin":
          response = await AuthService.admin.login(
            values.username,
            values.password
          );
          if (response.data) {
            dispatch(updateUserInfo(response.data.user));
            localStorage.setItem(
              "accessToken",
              response.data.tokens.accessToken
            );
            localStorage.setItem(
              "refreshToken",
              response.data.tokens.refreshToken
            );
            navigate("/");
          }
          break;
      }

      if (response.error) {
        setErrorMessage(response.error);
      }
    } catch (error) {
      setErrorMessage(error.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };
  const onRecaptchaChange = (value) => {
    console.log("value", value);
    if (value) {
      setIsVerified(true);
      message.success("Xác thực Captcha thành công!");
    } else {
      setIsVerified(false);
    }
  };

  const LoginForm = ({ role }) => (
    <Form
      form={form}
      name={`${role}_login`}
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={(values) => handleLogin(values, role)}
      preserve={true}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: "Please input your Username!" }]}
        preserve={true}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Username"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your Password!" }]}
        preserve={true}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="Password"
        />
      </Form.Item>
      {!isVerified && (
        <Form.Item>
          <ReCAPTCHA
            sitekey={
              import.meta.env.VITE_RECAPTCHA_SITE_KEY ||
              "6Lf30qkqAAAAAEQ8dVaN-zQBy4XtjP-VnlR3ZsJ6"
            }
            onChange={(value) => onRecaptchaChange(value)}
          />
        </Form.Item>
      )}
      {isVerified && (
        <Form.Item>
          <div className="text-green-500">✓ Xác thực Captcha thành công</div>
        </Form.Item>
      )}
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <a
          className="login-form-forgot"
          onClick={() => {
            navigate("/forgot-password");
          }}
          style={{ float: "right" }}
        >
          Quên mật khẩu?
        </a>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button"
          style={{ width: "100%" }}
          loading={loading}
          // disabled={!isVerified}
        >
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  );

  const items = [
    {
      key: "customer",
      label: "Khách hàng",
      children: <LoginForm role="customer" />,
    },
    {
      key: "employee",
      label: "Nhân viên",
      children: <LoginForm role="employee" />,
    },
    {
      key: "admin",
      label: "Quản trị",
      children: <LoginForm role="admin" />,
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <div className=" flex  flex-col">
        đăng nhập không cần mật khẩu
        <Button onClick={() => handleLogintest("ADMIN")}>Admin </Button>
        <Button onClick={() => handleLogintest("EMPLOYEE")}>employree</Button>
        <Button onClick={() => handleLogintest("CUSTOMER")}>Customer</Button>
      </div>
      <div
        style={{
          width: 400,
          padding: 24,
          backgroundColor: "#fff",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: 8,
        }}
      >
        <h1
          className="text-xl font-semibold mb-4"
          style={{ textAlign: "center" }}
        >
          Đăng Nhập
        </h1>
        {errorMessage && (
          <Alert
            message="Tên đăng nhập hoặc mật khẩu không chính xác!"
            // description={errorMessage}
            type="error"
            showIcon
            closable
            onClose={() => setErrorMessage(null)}
            style={{ marginBottom: 16 }}
          />
        )}

        <Tabs defaultActiveKey="customer" items={items} centered />
      </div>
    </div>
  );
};

export default SignIn;
