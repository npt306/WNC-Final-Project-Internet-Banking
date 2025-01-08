import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Tag,
  message,
  Modal,
  Form,
  Input,
  InputNumber,
  Tabs,
  Space,
  AutoComplete,
} from "antd";
import { useSelector } from "react-redux";
import PublicService from "../../services/Public.service";
import CustomerService from "../../services/Customer.service";
import AccountService from "../../services/Account.service";
import useSocket from "../../hooks/useSocket";

const { TabPane } = Tabs;

const DebtReminderManager = () => {
  // const mycustomerID = "675babee10466a57086768ed";
  const mycustomerID = useSelector((state) => state.profile._id);
  const MyFullName = useSelector((state) => state.profile.full_name);
  const [accountBanking, setAccountBanking] = useState(null);
  const [sentDebtReminders, setSentDebtReminders] = useState([]);
  const [receivedDebtReminders, setReceivedDebtReminders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [customer, setCustomer] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isCollectionModalVisible, setIsCollectionModalVisible] =
    useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [collectionForm] = Form.useForm();
  const [isOTPModalVisible, setIsOTPModalVisible] = useState(false);
  const [otpForm] = Form.useForm();
  const [currentDebtId, setCurrentDebtId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const { state, initialize, send } = useSocket();

  //
  const fetchAcount = async () => {
    try {
      const response = await CustomerService.getAllCustomer();
      if (response.data) {
        setCustomer(response.data);
      }
      const responseAccount = await AccountService.getAllAccount();
      if (responseAccount.data) {
        setAccountBanking(responseAccount.data);

      }
    } catch (error) {
      message.error("Không thể tải danh sách tài khoản");
    }
  };

  const fetchDebtReminders = async () => {
    try {
      const sentResponse = await PublicService.debt.getAllDebt_send(
        mycustomerID
      );
      const receivedResponse = await PublicService.debt.getAllDebt_received(
        mycustomerID
      );

      if (sentResponse.data) {
        setSentDebtReminders(sentResponse.data);
      }
      if (receivedResponse.data) {
        setReceivedDebtReminders(receivedResponse.data);
      }
    } catch (error) {
      message.error("Không thể tải danh sách nhắc nợ");
    }
  };

  const handleDebtCollection = async (values) => {
    try {
      await CustomerService.notification.createNotification(
        selectedDebt.debtor, // ID người nợ
        "Nhắc nhở thanh toán nợ",
        values.message,
        selectedDebt._id
      );
      message.success("Đã gửi thông báo đòi nợ thành công!");
      setIsCollectionModalVisible(false);
      send(selectedDebt.debtor);
      collectionForm.resetFields();
    } catch (error) {
      message.error("Gửi thông báo đòi nợ thất bại");
    }
  };

  useEffect(() => {
    // initialize(mycustomerID);
    fetchDebtReminders();
    fetchAcount();
  }, []);

  const handleSearch = async (value) => {
    if (!value) {
      setSearchResults([]);
      return;
    }

    try {
      const filteredAccounts = accountBanking.filter(
        (account) =>
          account.account_number.toLowerCase().includes(value.toLowerCase()) ||
          account.full_name.toLowerCase().includes(value.toLowerCase())
      );

      const formattedResults = filteredAccounts.map((account) => ({
        value: account.account_number,
        label: `${account.account_number} - ${account.full_name}`,
        userData: {
          id: account.customer_id,
          full_name: account.full_name,
          account_number: account.account_number,
        },
      }));

      setSearchResults(formattedResults);
    } catch (error) {
      console.error("Error searching accounts:", error);
    }
  };

  const handleSelect = (value, option) => {
    setSelectedUser(option.userData);
    form.setFieldsValue({
      debtor_name: option.userData.full_name,
    });
  };

  const handleCreateDebt = async (values) => {
    if (!selectedUser) {
      message.error("Vui lòng chọn người nợ!");
      return;
    }

    try {
      const response = await PublicService.debt.createDebtReminder(
        mycustomerID,
        selectedUser.id,
        values.amount,
        values.message
      );

      if (response.data) {
        message.success("Tạo nhắc nợ thành công!");
        setIsModalVisible(false);
        form.resetFields();
        fetchDebtReminders();
        send(selectedUser.id);
      } else {
        message.error("Tạo nhắc nợ thất bại!");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi tạo nhắc nợ");
    }
  };

  const handleDelete = async (record) => {
    try {
      await PublicService.debt.deleteDebtReminder(record._id);
      setSentDebtReminders((prev) =>
        prev.filter((item) => item._id !== record._id)
      );
      setReceivedDebtReminders((prev) =>
        prev.filter((item) => item._id !== record._id)
      );
      message.success("Xóa nhắc nợ thành công");
    } catch (error) {
      message.error("Xóa nhắc nợ thất bại");
    }
  };

  const handlePaymentClick = async (debtId) => {
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
        fetchDebtReminders();
      } else {
        message.error("Mã OTP không chính xác");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi thanh toán");
    } finally {
      setIsProcessing(false);
    }
  };

  const columns = {
    sent: [
      {
        title: "Người Nợ",
        dataIndex: "debtor_name",
        key: "debtor_name",
      },
      {
        title: "Số Tiền",
        dataIndex: "amount",
        key: "amount",
        render: (amount) => `${amount.toLocaleString()} VND`,
      },
      {
        title: "Lời Nhắn",
        dataIndex: "message",
        key: "message",
      },
      {
        title: "Ngày Tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date) => new Date(date).toLocaleString(),
      },
      {
        title: "Trạng Thái",
        dataIndex: "status",
        key: "status",
        render: (status) => (
          <Tag color={status === "PENDING" ? "orange" : "green"}>{status}</Tag>
        ),
      },
      {
        title: "Hành Động",
        key: "action",
        render: (_, record) => (
          <Space>
            {record.status === "PENDING" && (
              <Button
                type="primary"
                onClick={() => {
                  setSelectedDebt(record);
                  setIsCollectionModalVisible(true);
                }}
              >
                Đòi Nợ
              </Button>
            )}
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa không?"
              onConfirm={() => handleDelete(record)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button type="link" danger>
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    received: [
      {
        title: "Chủ Nợ",
        dataIndex: "creditor_name",
        key: "creditor_name",
      },
      {
        title: "Số Tiền",
        dataIndex: "amount",
        key: "amount",
        render: (amount) => `${amount.toLocaleString()} VND`,
      },
      {
        title: "Lời Nhắn",
        dataIndex: "message",
        key: "message",
      },
      {
        title: "Ngày Tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date) => new Date(date).toLocaleString(),
      },
      {
        title: "Trạng Thái",
        dataIndex: "status",
        key: "status",
        render: (status) => (
          <Tag color={status === "PENDING" ? "orange" : "green"}>{status}</Tag>
        ),
      },
      {
        title: "Hành Động",
        key: "action",
        render: (_, record) => (
          <Space>
            {record.status === "PENDING" && (
              <Button
                type="primary"
                onClick={() => handlePaymentClick(record._id)}
              >
                Thanh toán
              </Button>
            )}
          </Space>
        ),
      },
    ],
  };

  const CreateDebtModal = () => {
    const [localForm] = Form.useForm();
    const [localSelectedUser, setLocalSelectedUser] = useState(null);
    const [localSearchResults, setLocalSearchResults] = useState([]);

    const handleLocalSearch = async (value) => {
      if (!value) {
        setLocalSearchResults([]);
        return;
      }

      try {
        const filteredAccounts = accountBanking.filter(
          (account) =>
            account.account_number
              .toLowerCase()
              .includes(value.toLowerCase()) ||
            account.full_name.toLowerCase().includes(value.toLowerCase())
        );

        const formattedResults = filteredAccounts.map((account) => ({
          value: account.account_number,
          label: `${account.account_number} - ${account.full_name}`,
          userData: {
            id: account.customer_id,
            full_name: account.full_name,
            account_number: account.account_number,
          },
        }));

        setLocalSearchResults(formattedResults);
      } catch (error) {
        console.error("Error searching accounts:", error);
      }
    };

    const handleLocalSelect = (value, option) => {
      setLocalSelectedUser(option.userData);
      localForm.setFieldsValue({
        debtor_name: option.userData.full_name,
      });
    };

    const handleLocalSubmit = async (values) => {
      if (!localSelectedUser) {
        message.error("Vui lòng chọn người nợ!");
        return;
      }

      try {
        const response = await PublicService.debt.createDebtReminder(
          mycustomerID,
          localSelectedUser.id,
          values.amount,
          values.message
        );

        if (response.data) {
          message.success("Tạo nhắc nợ thành công!");
          setIsModalVisible(false);
          localForm.resetFields();
          setLocalSelectedUser(null);
          fetchDebtReminders();
          send(localSelectedUser.id);
        } else {
          message.error("Tạo nhắc nợ thất bại!");
        }
      } catch (error) {
        message.error("Đã xảy ra lỗi khi tạo nhắc nợ");
      }
    };

    return (
      <Modal
        title="Tạo Nhắc Nợ Mới"
        open={isModalVisible}
        onOk={() => localForm.submit()}
        onCancel={() => {
          setIsModalVisible(false);
          localForm.resetFields();
          setLocalSelectedUser(null);
        }}
        okText="Tạo"
        cancelText="Hủy"
      >
        <Form form={localForm} layout="vertical" onFinish={handleLocalSubmit}>
          <Form.Item
            name="debtor"
            label="Số tài khoản người nợ"
            rules={[{ required: true, message: "Vui lòng chọn người nợ!" }]}
          >
            <AutoComplete
              placeholder="Nhập số tài khoản hoặc tên người nợ"
              options={localSearchResults}
              onSearch={handleLocalSearch}
              onSelect={handleLocalSelect}
            />
          </Form.Item>

          {localSelectedUser && (
            <Form.Item label="Tên người nợ" name="debtor_name">
              <Input disabled value={localSelectedUser.full_name} />
            </Form.Item>
          )}

          <Form.Item
            name="amount"
            label="Số tiền"
            rules={[
              { required: true, message: "Vui lòng nhập số tiền!" },
              {
                validator: (_, value) => {
                  if (value <= 0) {
                    return Promise.reject("Số tiền phải lớn hơn 0!");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder="Nhập số tiền"
            />
          </Form.Item>

          <Form.Item
            name="message"
            label="Nội dung nhắc nợ"
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <Input.TextArea placeholder="Nhập nội dung nhắc nợ" />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return (
    <div className="p-4">
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        className="mb-4"
      >
        Tạo Nhắc Nợ Mới
      </Button>

      <Tabs defaultActiveKey="sent">
        <TabPane tab="Đã Gửi" key="sent">
          <Table columns={columns.sent} dataSource={sentDebtReminders} />
        </TabPane>
        <TabPane tab="Đã Nhận" key="received">
          <Table
            columns={columns.received}
            dataSource={receivedDebtReminders}
          />
        </TabPane>
      </Tabs>

      <CreateDebtModal />

      {/* Modal Đòi Nợ */}
      <Modal
        title="Gửi Thông Báo Đòi Nợ"
        open={isCollectionModalVisible}
        onOk={() => collectionForm.submit()}
        onCancel={() => {
          setIsCollectionModalVisible(false);
          collectionForm.resetFields();
          setSelectedDebt(null);
        }}
        okText="Gửi"
        cancelText="Hủy"
      >
        <Form
          form={collectionForm}
          layout="vertical"
          onFinish={handleDebtCollection}
        >
          {selectedDebt && (
            <div className="mb-4">
              <p>
                <strong>Người nợ:</strong> {selectedDebt.debtor_name}
              </p>
              <p>
                <strong>Số tiền:</strong> {selectedDebt.amount.toLocaleString()}{" "}
                VND
              </p>
              <p>
                <strong>Ngày tạo:</strong>{" "}
                {new Date(selectedDebt.createdAt).toLocaleString()}
              </p>
            </div>
          )}

          <Form.Item
            name="message"
            label="Lời Nhắc"
            initialValue={
              selectedDebt
                ? `Vui lòng thanh toán khoản nợ ${
                    selectedDebt?.amount?.toLocaleString() || ""
                  } VND cho ${MyFullName}`
                : ""
            }
            rules={[{ required: true, message: "Vui lòng nhập lời nhắc!" }]}
          >
            <Input.TextArea
              placeholder="Nhập lời nhắc"
              rows={4}
              maxLength={200}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal nhập OTP */}
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

export default DebtReminderManager;
