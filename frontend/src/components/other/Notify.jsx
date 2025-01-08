import React, { useEffect, useState } from "react";
import {
  Drawer,
  Badge,
  List,
  Button,
  Tag,
  message,
  Modal,
  Form,
  Input,
} from "antd";
import { BellOutlined } from "@ant-design/icons";
import useSocket from "../../hooks/useSocket";
import CustomerService from "../../services/Customer.service";
import PublicService from "../../services/Public.service";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

const Notifications = () => {
  const [visible, setVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const profile = useSelector((state) => state.profile);

  // Thêm state cho OTP modal
  const [isOTPModalVisible, setIsOTPModalVisible] = useState(false);
  const [currentDebtId, setCurrentDebtId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [otpForm] = Form.useForm();

  const { state, initialize, send } = useSocket();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await CustomerService.notification.getNotification(
        profile._id
      );
      if (response.data) {
        const sortedNotifications = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotifications(sortedNotifications);
        const unreadCount = notifications.filter((item) => !item.isRead).length;
        if (unreadCount > 0) {
          message.info(`Bạn có thông báo mới`);
        }
      }
    } catch (error) {
      message.error("Không thể tải thông báo");
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialize(profile._id);
    fetchNotifications();
  }, [state]);

  const handleMarkAsRead = async (id) => {
    try {
      await CustomerService.notification.readNotification(id);
      setNotifications((prev) =>
        prev.map((item) => (item._id === id ? { ...item, isRead: true } : item))
      );
      message.success("Đã đánh dấu là đã đọc");
    } catch (error) {
      message.error("Không thể đánh dấu là đã đọc");
      console.error("Error marking as read:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await CustomerService.notification.deleteNotification(id);
      setNotifications((prev) => prev.filter((item) => item._id !== id));
      message.success("Đã xóa thông báo");
    } catch (error) {
      message.error("Không thể xóa thông báo");
      console.error("Error deleting notification:", error);
    }
  };

  const handlePayDebt = async (debtId) => {
    setIsProcessing(true);
    setCurrentDebtId(debtId);

    try {
      const response = await PublicService.debt.getCodeDebtOTP(debtId);
      if (response.statusCode === 200 || response.statusCode === 201) {
        message.success("Mã OTP đã được gửi đến email của bạn");
        setIsOTPModalVisible(true);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi tạo mã OTP");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOTPSubmit = async (values) => {
    setIsProcessing(true);
    try {
      const response = await PublicService.debt.payDebtReminder(
        currentDebtId,
        values.otpCode
      );
      if (response.data) {
        message.success("Thanh toán thành công!");
        setIsOTPModalVisible(false);
        otpForm.resetFields();
        fetchNotifications(); // Refresh notifications
        setCurrentDebtId(null);
      } else {
        message.error("Mã OTP không chính xác");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi thanh toán");
    } finally {
      setIsProcessing(false);
    }
  };

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <div className="mt-3">
      <Badge count={unreadCount}>
        <BellOutlined
          style={{ fontSize: "24px", cursor: "pointer" }}
          onClick={() => setVisible(true)}
        />
      </Badge>

      <Drawer
        title="Thông Báo"
        placement="right"
        onClose={() => setVisible(false)}
        open={visible}
        width={400}
      >
        <List
          loading={loading}
          itemLayout="vertical"
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              key={item._id}
              actions={[
                <Button
                  type="link"
                  onClick={() => handleMarkAsRead(item._id)}
                  disabled={item.isRead}
                >
                  {item.isRead ? "Đã đọc" : "Đánh dấu đã đọc"}
                </Button>,
                item.id_debt && (
                  <Button
                    type="primary"
                    onClick={() => handlePayDebt(item.id_debt)}
                  >
                    Thanh toán
                  </Button>
                ),
                <Button
                  type="link"
                  danger
                  onClick={() => handleDelete(item._id)}
                >
                  Xóa
                </Button>,
              ].filter(Boolean)}
              className={`${!item.isRead ? "bg-blue-50" : ""} rounded-lg mb-2`}
            >
              <List.Item.Meta
                title={
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{item.title}</span>
                    <div>
                      {!item.isRead && <Tag color="blue">Mới</Tag>}
                      {item.id_debt && <Tag color="orange">Nhắc nợ</Tag>}
                    </div>
                  </div>
                }
                description={
                  <div>
                    <p className="text-black">{item.content}</p>
                    <p className="text-gray-400 text-sm">
                      {dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")}
                    </p>
                  </div>
                }
              />
            </List.Item>
          )}
          locale={{
            emptyText: "Không có thông báo nào",
          }}
        />
      </Drawer>

      {/* Thêm Modal OTP */}
      <Modal
        title="Xác nhận thanh toán"
        open={isOTPModalVisible}
        onCancel={() => {
          setIsOTPModalVisible(false);
          otpForm.resetFields();
          setCurrentDebtId(null);
        }}
        footer={null}
      >
        <Form form={otpForm} onFinish={handleOTPSubmit} layout="vertical">
          <div className="mb-4">
            <p>Mã OTP đã được gửi đến email của bạn</p>
            <p>Vui lòng kiểm tra và nhập mã để xác nhận thanh toán</p>
          </div>

          <Form.Item
            name="otpCode"
            label="Mã OTP"
            rules={[
              { required: true, message: "Vui lòng nhập mã OTP!" },
              { len: 6, message: "Mã OTP phải có 6 ký tự!" },
            ]}
          >
            <Input placeholder="Nhập mã OTP" maxLength={6} />
          </Form.Item>

          <Form.Item className="text-right">
            <Button
              type="default"
              onClick={() => setIsOTPModalVisible(false)}
              className="mr-2"
            >
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={isProcessing}>
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Notifications;
