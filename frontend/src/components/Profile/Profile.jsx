import React, { useState } from "react";
import { Button, Modal, Form, Input, notification } from "antd";
import { useSelector, useDispatch } from "react-redux";
import PublicService from "../../services/Public.service";
import { updateUserInfo } from "../../redux/features/profileSlice";

const Profile = () => {
  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
  const [isEditPasswordVisible, setIsEditPasswordVisible] = useState(false);
  const [isOTPVisible, setIsOTPVisible] = useState(false);

  // Lấy thông tin user từ Redux store
  const userInfo = useSelector((state) => state.profile);
  const accountInfo = useSelector((state) => state.accountBanking);
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [otpForm] = Form.useForm();

  const handleEditProfile = () => {
    setIsEditProfileVisible(true);
    form.setFieldsValue({
      full_name: userInfo.full_name,
      phone: userInfo.phone,
      email: userInfo.email,
    });
  };

  const handleEditPassword = () => {
    setIsEditPasswordVisible(true);
    passwordForm.resetFields();
  };

  const handleSaveProfile = async () => {
    try {
      const values = await form.validateFields();
      const response = await PublicService.proifle.updateProfile(
        userInfo._id,
        values.full_name,
        values.email,
        values.phone
      );

      if (response.data) {
        dispatch(updateUserInfo(response.data));
        setIsEditProfileVisible(false);
        notification.success({
          message: "Cập nhật thông tin thành công!",
        });
      } else {
        notification.error({
          message: "Cập nhật thất bại!",
          description: response.error,
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng kiểm tra lại thông tin!",
      });
    }
  };

  const handleSavePassword = () => {
    passwordForm.validateFields().then(() => {
      setIsEditPasswordVisible(false);
      setIsOTPVisible(true);
    });
  };

  const handleVerifyOTP = () => {
    otpForm.validateFields().then((values) => {
      if (values.otp === "123456") {
        notification.success({
          message: "Mật khẩu đã được thay đổi thành công!",
        });
        setIsOTPVisible(false);
      } else {
        notification.error({ message: "Mã OTP không chính xác!" });
      }
    });
  };

  return (
    <div className="flex justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold mb-4">Thông Tin Người Dùng</h1>
        <div className="mb-4">
          <p>
            <strong>ID</strong> {userInfo._id}
          </p>
          <p>
            <strong>Họ và tên:</strong> {userInfo.full_name}
          </p>
          <p>
            <strong>Tên đăng nhập:</strong> {userInfo.username}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {userInfo.phone}
          </p>
          <p>
            <strong>Email:</strong> {userInfo.email}
          </p>{" "}
        </div>

        <Button type="primary" onClick={handleEditProfile} className="mr-2">
          Chỉnh Sửa Thông Tin
        </Button>
        <Button type="default" onClick={handleEditPassword}>
          Chỉnh Sửa Mật Khẩu
        </Button>

        {/* Modal for Editing Profile */}
        <Modal
          title="Chỉnh Sửa Thông Tin"
          open={isEditProfileVisible}
          onOk={handleSaveProfile}
          onCancel={() => setIsEditProfileVisible(false)}
          okText="Lưu"
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="full_name"
              label="Họ và Tên"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Số Điện Thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
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
          </Form>
        </Modal>

        {/* Modal for Editing Password */}
        <Modal
          title="Chỉnh Sửa Mật Khẩu"
          open={isEditPasswordVisible}
          onOk={handleSavePassword}
          onCancel={() => setIsEditPasswordVisible(false)}
          okText="Lưu"
          cancelText="Hủy"
        >
          <Form form={passwordForm} layout="vertical">
            <Form.Item
              name="newPassword"
              label="Mật Khẩu Mới"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu mới" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Xác Nhận Mật Khẩu"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu xác nhận không khớp!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Xác nhận mật khẩu mới" />
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal for OTP Verification */}
        <Modal
          title="Xác Minh OTP"
          open={isOTPVisible}
          onOk={handleVerifyOTP}
          onCancel={() => setIsOTPVisible(false)}
          okText="Xác Nhận"
          cancelText="Hủy"
        >
          <Form form={otpForm} layout="vertical">
            <Form.Item
              name="otp"
              label="Mã OTP"
              rules={[{ required: true, message: "Vui lòng nhập mã OTP!" }]}
            >
              <Input placeholder="Nhập mã OTP" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Profile;
