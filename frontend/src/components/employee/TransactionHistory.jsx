import React, { useState, useEffect } from "react";
import { Table, Input, Button, message, Tag } from "antd";
import ColumnSearch from "~/hooks/useSearchTable";

const TransactionHistory = ({ fetchData, type }) => {
  const [transactions, setTransactions] = useState([]);
  const [customerID, setCustomerID] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!customerID) {
      message.warning("Vui lòng nhập ID khách hàng!");
      return;
    }
    setLoading(true);
    try {
      const response = await fetchData(customerID);
      if (response.data) {
        setTransactions(response.data);
      }
    } catch (error) {
      message.error("Không thể tải dữ liệu giao dịch");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value, type = "normal") => {
    const amount =
      value === null || value === "" || value === undefined ? 0 : value;
    const formattedValue = `${amount.toLocaleString()} VND`;

    switch (type) {
      case "deposit":
        return <Tag color="green">+ {formattedValue}</Tag>;
      case "withdraw":
        return <Tag color="red">- {formattedValue}</Tag>;
      case "fee":
        return <Tag color="orange">{formattedValue}</Tag>;
      case "balance":
        return <Tag color="blue">{formattedValue}</Tag>;
      default:
        return <Tag>{formattedValue}</Tag>;
    }
  };

  const columns = {
    DEPOSIT: [
      {
        title: "ID Giao Dịch",
        dataIndex: "_id",
        key: "_id",
      },
      {
        title: "Người Nhận",
        dataIndex: "receiver",
        key: "receiver",
        ...ColumnSearch("receiver"),
      },
      {
        title: "Số Tiền",
        dataIndex: "amount",
        key: "amount",
        render: (amount) => formatCurrency(amount, "deposit"),
      },
      {
        title: "Nội Dung",
        dataIndex: "content",
        key: "content",
      },
      {
        title: "Số Dư",
        dataIndex: "receiver_balance",
        key: "receiver_balance",
        render: (balance) => formatCurrency(balance, "balance"),
      },
      {
        title: "Thời Gian",
        dataIndex: "timestamp",
        key: "timestamp",
        render: (time) => new Date(time).toLocaleString(),
      },
    ],
    TRANSFER: [
      {
        title: "ID Giao Dịch",
        dataIndex: "_id",
        key: "_id",
      },
      {
        title: "Người Gửi",
        dataIndex: "sender",
        key: "sender",
        ...ColumnSearch("sender"),
      },
      {
        title: "Người Nhận",
        dataIndex: "receiver",
        key: "receiver",
        ...ColumnSearch("receiver"),
      },
      {
        title: "Số Tiền",
        dataIndex: "amount",
        key: "amount",
        render: (amount) => formatCurrency(amount, "withdraw"),
      },
      {
        title: "Phí",
        dataIndex: "fee",
        key: "fee",
        render: (fee) => formatCurrency(fee, "fee"),
      },
      {
        title: "Nội Dung",
        dataIndex: "content",
        key: "content",
      },
      {
        title: "Số Dư Người Gửi",
        dataIndex: "sender_balance",
        key: "sender_balance",
        render: (balance) => formatCurrency(balance, "balance"),
      },
      {
        title: "Số Dư Người Nhận",
        dataIndex: "receiver_balance",
        key: "receiver_balance",
        render: (balance) => formatCurrency(balance, "balance"),
      },
      {
        title: "Thời Gian",
        dataIndex: "timestamp",
        key: "timestamp",
        // render: (time) => new Date(time).toLocaleString(),
      },
    ],
    DEBT: [
      {
        title: "ID Giao Dịch",
        dataIndex: "_id",
        key: "_id",
      },
      {
        title: "Người Gửi",
        dataIndex: "sender",
        key: "sender",
        ...ColumnSearch("sender"),
      },
      {
        title: "Người Nhận",
        dataIndex: "receiver",
        key: "receiver",
        ...ColumnSearch("receiver"),
      },
      {
        title: "Số Tiền",
        dataIndex: "amount",
        key: "amount",
        render: (amount) => formatCurrency(amount),
      },
      {
        title: "Nội Dung",
        dataIndex: "content",
        key: "content",
      },
      {
        title: "Số Dư Người Gửi",
        dataIndex: "sender_balance",
        key: "sender_balance",
        render: (balance) => formatCurrency(balance),
      },
      {
        title: "Số Dư Người Nhận",
        dataIndex: "receiver_balance",
        key: "receiver_balance",
        render: (balance) => formatCurrency(balance),
      },
      {
        title: "Thời Gian",
        dataIndex: "timestamp",
        key: "timestamp",
        render: (time) => new Date(time).toLocaleString(),
      },
    ],
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-4">
        <Input
          placeholder="Nhập ID khách hàng"
          value={customerID}
          onChange={(e) => setCustomerID(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={handleFetch} loading={loading}>
          Tìm Kiếm
        </Button>
      </div>
      <Table
        columns={columns[type]}
        dataSource={transactions}
        rowKey="_id"
        loading={loading}
      />
    </div>
  );
};

export default TransactionHistory;
