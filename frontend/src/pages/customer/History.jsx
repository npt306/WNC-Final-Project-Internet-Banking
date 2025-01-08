import React, { useState, useEffect } from "react";
import { Tabs, Table, Tag } from "antd";
import { useSelector } from "react-redux";
import PublicService from "../../services/Public.service";
import moment from "moment";

const { TabPane } = Tabs;

const History = () => {
  const [transferHistory, setTransferHistory] = useState([]);
  const [receiveHistory, setReceiveHistory] = useState([]);
  const [debtHistory, setDebtHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const accountBanking = useSelector((state) => state.accountBanking);
  const accountNumber = accountBanking?.account_number;

  const fetchTransferHistory = async () => {
    setLoading(true);
    try {
      const response =
        await PublicService.transaction.get_transfer_trans_his_anb(
          accountNumber
        );
      if (response.data) {
        setTransferHistory(response.data);
      }
    } catch (error) {
      console.error("Error fetching transfer history:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReceiveHistory = async () => {
    setLoading(true);
    try {
      const response =
        await PublicService.transaction.get_receive_trans_his_anb(
          accountNumber
        );
      if (response.data) {
        setReceiveHistory(response.data);
      }
    } catch (error) {
      console.error("Error fetching receive history:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDebtHistory = async () => {
    setLoading(true);
    try {
      const response =
        await PublicService.transaction.get_debt_trans_history_anb(
          accountNumber
        );
      if (response.data) {
        setDebtHistory(response.data);
      }
    } catch (error) {
      console.error("Error fetching debt history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountNumber) {
      fetchTransferHistory();
      fetchReceiveHistory();
      fetchDebtHistory();
    }
  }, [accountNumber]);

  const transferColumns = [
    {
      title: "Ngày giao dịch",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Người nhận",
      dataIndex: "receiver",
      key: "receiver",
    },
    {
      title: "Ngân hàng",
      dataIndex: "receiver_bank",
      key: "receiver_bank",
      render: (text) => text || "SANKCOMBA",
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <span className="text-red-500">
          -{(amount || 0).toLocaleString("vi-VN")} VND
        </span>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Trạng thái",
      key: "status",
      render: () => <Tag color="green">Thành công</Tag>,
    },
  ];

  const receiveColumns = [
    {
      title: "Ngày giao dịch",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Người gửi",
      dataIndex: "sender",
      key: "sender",
    },
    {
      title: "Ngân hàng",
      dataIndex: "sender_bank",
      key: "sender_bank",
      render: (text) => text || "SANKCOMBA",
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <span className="text-green-500">
          +{(amount || 0).toLocaleString("vi-VN")} VND
        </span>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Trạng thái",
      key: "status",
      render: () => <Tag color="green">Thành công</Tag>,
    },
  ];

  const debtColumns = [
    {
      title: "Ngày giao dịch",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Người trả nợ",
      dataIndex: "sender",
      key: "sender",
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <span className="text-green-500">
          +{(amount || 0).toLocaleString("vi-VN")} VND
        </span>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Trạng thái",
      key: "status",
      render: () => <Tag color="green">Thành công</Tag>,
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Lịch sử giao dịch</h1>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Chuyển tiền" key="1">
          <Table
            columns={transferColumns}
            dataSource={transferHistory}
            loading={loading}
            rowKey="_id"
          />
        </TabPane>
        <TabPane tab="Nhận tiền" key="2">
          <Table
            columns={receiveColumns}
            dataSource={receiveHistory}
            loading={loading}
            rowKey="_id"
          />
        </TabPane>
        <TabPane tab="Thanh toán nợ" key="3">
          <Table
            columns={debtColumns}
            dataSource={debtHistory}
            loading={loading}
            rowKey="_id"
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default History;
