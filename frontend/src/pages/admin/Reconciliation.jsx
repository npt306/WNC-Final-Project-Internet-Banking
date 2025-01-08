import React, { useEffect, useState } from "react";
import { Table, DatePicker, Button, Space, message, Input, Tag } from "antd";
import PublicService from "../../services/Public.service";
import dayjs from "dayjs";
import ColumnSearch from "../../hooks/useSearchTable";

const { RangePicker } = DatePicker;

const Reconciliation = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(1, "day"),
    dayjs(),
  ]);
  const [externalBank, setExternalBank] = useState("");

  const fetchTransactions = async (startDate, endDate) => {
    setLoading(true);
    try {
      let response;
      if (externalBank.trim()) {
        response = await PublicService.transaction.checking_transaction(
          externalBank,
          startDate.format("YYYY-MM-DD"),
          endDate.format("YYYY-MM-DD")
        );
      } else {
        response = await PublicService.transaction.checking_transaction_all(
          startDate.format("YYYY-MM-DD"),
          endDate.format("YYYY-MM-DD")
        );
      }

      if (response.data) {
        setTransactions(response.data.transactions);
        setTotalAmount(response.data.totalAmount);
      }
    } catch (error) {
      message.error("Không thể tải dữ liệu giao dịch");
      console.error("Error fetching reconciliation:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      fetchTransactions(dateRange[0], dateRange[1]);
    }
  }, []);

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
    }
  };

  const handleSearch = () => {
    if (dateRange[0] && dateRange[1]) {
      fetchTransactions(dateRange[0], dateRange[1]);
    } else {
      message.warning("Vui lòng chọn khoảng thời gian");
    }
  };
  const formatCurrency = (value) => {
    if (value === null || value === "" || value === undefined) {
      return "0 VND";
    }
    return `${value.toLocaleString()} VND`;
  };

  const columns = [
    {
      title: "Thời Gian",
      dataIndex: "timestamp",
      key: "timestamp",
      ...ColumnSearch("timestamp"),
      sorter: (a, b) => dayjs(a.timestamp).unix() - dayjs(b.timestamp).unix(),
      render: (time) => dayjs(time).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Loại GD",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        switch (type) {
          case "DEPOSIT":
            return <Tag color="green">Nạp tiền</Tag>;
          case "WITHDRAW":
            return <Tag color="red">Rút tiền</Tag>;
          case "TRANSFER":
            return <Tag color="blue">Chuyển tiền</Tag>;
          case "FEE":
            return <Tag color="orange">Phí</Tag>;
          default:
            return <Tag>{type}</Tag>;
        }
      }
    },
    {
      title: "Người Gửi",
      dataIndex: "sender",
      key: "sender",
      ...ColumnSearch("sender"),
    },
    {
      title: "Ngân Hàng Gửi",
      dataIndex: "sender_bank",
      key: "sender_bank",
    },
    {
      title: "Người Nhận",
      dataIndex: "receiver",
      key: "receiver",
      ...ColumnSearch("receiver"),
    },
    {
      title: "Ngân Hàng Nhận",
      dataIndex: "receiver_bank",
      key: "receiver_bank",
    },
    {
      title: "Số Tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => formatCurrency(amount),
      align: "right",
    },
    {
      title: "Phí",
      dataIndex: "fee",
      key: "fee",
      render: (fee) => formatCurrency(fee),
      align: "right",
    },
    {
      title: "Nội Dung",
      dataIndex: "content",
      key: "content",
      ...ColumnSearch("content"),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Đối Soát Giao Dịch</h1>
        <div className="flex items-center gap-4">
          <Space>
            <Input
              placeholder="Nhập tên ngân hàng đối tác"
              value={externalBank}
              onChange={(e) => setExternalBank(e.target.value)}
              style={{ width: 200 }}
            />
            <RangePicker
              value={dateRange}
              onChange={handleDateChange}
              format="DD/MM/YYYY"
            />
            <Button type="primary" onClick={handleSearch}>
              Tìm Kiếm
            </Button>
          </Space>
        </div>
      </div>

      <div className="mb-4 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-medium mb-2">Thống Kê</h2>
        <p>
          Tổng số giao dịch: <Tag color="blue">{transactions.length}</Tag>
        </p>
        <p>
          Tổng số tiền:{" "}
          <Tag color="green">{totalAmount.toLocaleString()} VND</Tag>
        </p>
        {externalBank && (
          <p>
            Đối soát với ngân hàng: <Tag color="purple">{externalBank}</Tag>
          </p>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={transactions}
        rowKey="_id"
        loading={loading}
        scroll={{ x: true }}
        pagination={{
          total: transactions.length,
          pageSize: 10,
          showTotal: (total) => `Tổng số ${total} giao dịch`,
        }}
        summary={(pageData) => {
          const totalAmount = pageData.reduce(
            (sum, row) => sum + row.amount,
            0
          );
          const totalFee = pageData.reduce((sum, row) => sum + row.fee, 0);

          return (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={6}>
                  <strong>Tổng</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6} align="right">
                  <strong>{totalAmount.toLocaleString()} VND</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7} align="right">
                  <strong>{totalFee.toLocaleString()} VND</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={8} />
              </Table.Summary.Row>
            </Table.Summary>
          );
        }}
      />
    </div>
  );
};

export default Reconciliation;
