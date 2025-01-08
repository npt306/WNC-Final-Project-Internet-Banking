import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import PublicService from "../../services/Public.service";
import AccountService from "../../services/Account.service";

import { useSelector } from "react-redux";

const RecipientSetup = () => {
  const [recipients, setRecipients] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const mycustomerID = useSelector((state) => state.profile._id);
  // const mycustomerID = "675babee10466a57086768eb";
  const [accounts, setAccounts] = useState([]);
  const [recipientName, setRecipientName] = useState("");

  const fetchAccounts = async () => {
    try {
      const response = await AccountService.getAllAccount();
      if (response.data) {
        setAccounts(response.data);
      }
    } catch (error) {
      message.error("Không thể tải danh sách tài khoản");
    } finally {
    }
  };

  const fetchDataRecipients = async () => {
    try {
      const response = await PublicService.reciept.getRecieptByCustomerID(
        mycustomerID
      );
      if (response.data) {
        setRecipients(response.data);
      }
    } catch (error) {
      message.error("Failed to fetch recipients");
    }
  };

  const handleAddRecipient = () => {
    setEditingRecipient(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleEditRecipient = (record) => {
    setEditingRecipient(record);
    setIsModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleDeleteRecipient = async (accountNumber) => {
    const recipient = recipients.find(
      (r) => r.account_number === accountNumber
    );
    if (recipient) {
      try {
        await PublicService.reciept.deleteReciept(recipient._id);
        message.success("Xóa người nhận thành công");
        fetchDataRecipients();
      } catch (error) {
        message.error("Không thể xóa người nhận");
      }
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecipient) {
        const updatedRecipient = {
          customer_id: editingRecipient.customer_id,
          ...values,
          bank: values.bank || "SankComBa",
        };

        await PublicService.reciept.updateReciept(
          editingRecipient._id,
          updatedRecipient.customer_id,
          updatedRecipient.account_number,
          updatedRecipient.nickname,
          updatedRecipient.bank
        );
        message.success("Cập nhật người nhận thành công");
      } else {
        const newRecipient = {
          customer_id: mycustomerID,
          ...values,
          bank: values.bank || "SankComBa",
        };
        const response = await PublicService.reciept.createReciept(
          newRecipient.customer_id,
          newRecipient.account_number,
          newRecipient.nickname,
          newRecipient.bank
        );
        if (response.data) {
          message.success("Thêm người nhận thành công");
        }
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchDataRecipients();
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleQuickTransfer = (accountNumber) => {
    navigate("/", {
      state: { accountNumber },
    });
  };

  const handleAccountNumberChange = async (value) => {
    const account = accounts.find((acc) => acc.account_number === value);
    if (account) {
      setRecipientName(account.full_name);
      form.setFieldsValue({ nickname: account.full_name });
    } else {
      setRecipientName("");
    }
  };

  useEffect(() => {
    fetchDataRecipients();
    fetchAccounts();
  }, []);

  const columns = [
    {
      title: "Số Tài Khoản",
      dataIndex: "account_number",
      key: "account_number",
    },
    {
      title: "Tên Gợi Nhớ",
      dataIndex: "nickname",
      key: "nickname",
    },
    {
      title: "Ngân Hàng",
      dataIndex: "bank",
      key: "bank",
    },
    {
      title: "Hành Động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEditRecipient(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa người nhận này?"
            onConfirm={() => handleDeleteRecipient(record.account_number)}
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
          <Button
            type="link"
            onClick={() => handleQuickTransfer(record.account_number)}
          >
            Chuyển khoản nhanh
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Thiết Lập Danh Sách Người Nhận</h1>
      <Button type="primary" onClick={handleAddRecipient} className="mb-4">
        Thêm Người Nhận
      </Button>
      <Table
        columns={columns}
        dataSource={recipients}
        rowKey="account_number"
      />

      <Modal
        title={editingRecipient ? "Chỉnh Sửa Người Nhận" : "Thêm Người Nhận"}
        open={isModalVisible}
        onOk={() => handleModalOk()}
        onCancel={handleModalCancel}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="account_number"
            label="Số Tài Khoản"
            rules={[{ required: true, message: "Vui lòng nhập số tài khoản!" }]}
          >
            <Input
              placeholder="Nhập số tài khoản"
              onChange={(e) => handleAccountNumberChange(e.target.value)}
            />
          </Form.Item>

          {recipientName && (
            <Form.Item label="Tên Chủ Tài Khoản">
              <Input value={recipientName} disabled />
            </Form.Item>
          )}

          <Form.Item name="nickname" label="Tên Gợi Nhớ">
            <Input placeholder="Nhập tên gợi nhớ (nếu có)" />
          </Form.Item>

          <Form.Item
            name="bank"
            label="Ngân Hàng"
            initialValue="sankcomba"
            rules={[
              { required: true, message: "Vui lòng nhập tên ngân hàng!" },
            ]}
          >
            <Input placeholder="Nhập tên ngân hàng" defaultValue="sankcomba" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RecipientSetup;
