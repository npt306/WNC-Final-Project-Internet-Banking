import React, { useState, useEffect } from "react";
import {
  Tabs,
  Form,
  Input,
  Button,
  Select,
  message,
  Modal,
  Switch,
} from "antd";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import AccountService from "../../services/Account.service";
import PublicService from "../../services/Public.service";
import { debounce } from "lodash";
const { TabPane } = Tabs;
const { Option } = Select;

const TransferService = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExternalTransfer, setIsExternalTransfer] = useState(false);
  const [form] = Form.useForm();

  const accountBanking = useSelector((state) => state.accountBanking);
  const profile = useSelector((state) => state.profile);
  const myAccountNumber = accountBanking?.account_number; //|| "445566778899";
  const [saveRecipientModal, setSaveRecipientModal] = useState(false);
  const [lastTransferInfo, setLastTransferInfo] = useState(null);
  const [showSaveRecipientModal, setShowSaveRecipientModal] = useState(false);
  const [recipientToSave, setRecipientToSave] = useState(null);
  const [nickName, setNickName] = useState("");
  const checkExistingRecipient = async (accountNumber) => {
    try {
      const response = await PublicService.reciept.getRecieptByCustomerID(
        profile._id
      );
      if (response.data) {
        return response.data.some(
          (recipient) => recipient.account_number === accountNumber
        );
      }
      return false;
    } catch (error) {
      console.error("Error checking recipient:", error);
      return false;
    }
  };

  const handleTransfer = async (values) => {
    if (!myAccountNumber) {
      message.error("Không tìm thấy thông tin tài khoản của bạn!");
      return;
    }

    setLoading(true);
    try {
      const payer =
        values.feeType === "sender" ? myAccountNumber : values.accountNumber;
      const amount = parseInt(values.amount, 10);

      if (isNaN(amount) || amount <= 0) {
        message.error("Số tiền không hợp lệ!");
        return;
      }

      const response = isExternalTransfer
        ? await PublicService.transaction.ExternalTransfer(
            myAccountNumber,
            values.accountNumber,
            values.bank,
            amount,
            values.content || "Chuyển tiền",
            payer
          )
        : await PublicService.transaction.InternalTransfer(
            myAccountNumber,
            values.accountNumber,
            amount,
            values.content || "Chuyển tiền",
            payer
          );

      if (response.data) {
        message.success("Chuyển khoản thành công!");

        const isExisting = await checkExistingRecipient(values.accountNumber);
        if (!isExisting) {
          setRecipientToSave({
            account_number: values.accountNumber,
            full_name: fullName,
            bank: isExternalTransfer ? values.bank : "sankcomba",
          });
          setNickName(fullName);
          setShowSaveRecipientModal(true);
        } else {
          form.resetFields();
          setAccountNumber("");
          setFullName("");
        }
      } else if (response.error) {
        message.error("Chuyển khoản thất bại, số dư không đủ!");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi chuyển khoản");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipient = async () => {
    try {
      const finalNickname = nickName.trim() || recipientToSave.full_name;

      const response = await PublicService.reciept.createReciept(
        profile._id,
        recipientToSave.account_number,
        finalNickname,
        recipientToSave.bank
      );

      if (response.data) {
        message.success("Đã lưu người nhận vào danh sách!");
      }
    } catch (error) {
      message.error("Không thể lưu người nhận");
    } finally {
      setShowSaveRecipientModal(false);
      setNickName("");
      form.resetFields();
      setAccountNumber("");
      setFullName("");
    }
  };

  const fetchInfo = async (accNumber) => {
    if (accNumber === myAccount) {
      message.error("Không thể chuyển tiền cho chính mình!");
      setFullName("");
      form.setFieldsValue({ recipientName: "" });
      return;
    }

    try {
      const response = await AccountService.getInfoAccountNumberID(accNumber);
      if (response.data) {
        setFullName(response.data.full_name);
        form.setFieldsValue({
          recipientName: response.data.full_name,
          accountNumber: accNumber,
        });
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
      setFullName("");
      form.setFieldsValue({ recipientName: "" });
    }
  };
  return {
    profile,
    fetchInfo,
    accountNumber,
    setAccountNumber,
    fullName,
    setFullName,
    loading,
    setLoading,
    myAccountNumber,
    handleTransfer,
    form,
    isExternalTransfer,
    setIsExternalTransfer,
    saveRecipientModal,
    setSaveRecipientModal,
    lastTransferInfo,
    setLastTransferInfo,
    showSaveRecipientModal,
    setShowSaveRecipientModal,
    recipientToSave,
    handleSaveRecipient,
    nickName,
    setNickName,
  };
};

const FeeSelect = () => (
  <Form.Item
    name="feeType"
    label="Phí giao dịch"
    rules={[{ required: true, message: "Vui lòng chọn người trả phí!" }]}
  >
    <Select placeholder="Chọn người trả phí">
      <Option value="sender">Người gửi trả phí</Option>
      <Option value="receiver">Người nhận trả phí</Option>
    </Select>
  </Form.Item>
);

const AccountAutocomplete = ({
  form,
  onAccountSelect,
  initialAccountNumber,
  isExternalTransfer,
}) => {
  const {
    accountNumber,
    setAccountNumber,
    fullName,
    setFullName,
    loading,
    setLoading,
    myAccountNumber,
  } = TransferService();

  const debouncedFetchInfo = debounce(async (accNumber) => {
    if (!accNumber) {
      setFullName("");
      form.setFieldsValue({ recipientName: "" });
      return;
    }

    if (accNumber === myAccountNumber) {
      message.error("Không thể chuyển tiền cho chính mình!");
      setFullName("");
      form.setFieldsValue({ recipientName: "" });
      return;
    }

    setLoading(true);
    try {
      let response;
      if (isExternalTransfer) {
        response = await PublicService.transaction.ExternalGetInfo(accNumber);
        if (response.data) {
          setFullName(response.data.fullName);
          form.setFieldsValue({
            recipientName: response.data.fullName,
            accountNumber: accNumber,
          });
          onAccountSelect && onAccountSelect(response.data);
        }
      } else {
        response = await AccountService.getInfoAccountNumberID(accNumber);
        if (response.data) {
          setFullName(response.data.full_name);
          form.setFieldsValue({
            recipientName: response.data.full_name,
            accountNumber: accNumber,
          });
          onAccountSelect && onAccountSelect(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching account info:", error);
      setFullName("");
      form.setFieldsValue({ recipientName: "" });
      message.error("Không tìm thấy thông tin tài khoản!");
    } finally {
      setLoading(false);
    }
  }, 1500);

  useEffect(() => {
    return () => {
      debouncedFetchInfo.cancel();
    };
  }, []);

  const handleAccountNumberChange = (e) => {
    const value = e.target.value;
    setAccountNumber(value);
    if (value) {
      debouncedFetchInfo(value);
    } else {
      setFullName("");
      form.setFieldsValue({ recipientName: "" });
    }
  };

  useEffect(() => {
    if (initialAccountNumber) {
      setAccountNumber(initialAccountNumber);
      form.setFieldsValue({ accountNumber: initialAccountNumber });
      debouncedFetchInfo(initialAccountNumber);
    }
  }, [initialAccountNumber]);

  return (
    <>
      <Form.Item
        name="accountNumber"
        label="Số tài khoản"
        rules={[{ required: true, message: "Vui lòng nhập số tài khoản!" }]}
      >
        <Input
          placeholder="Nhập số tài khoản"
          onChange={handleAccountNumberChange}
          value={accountNumber}
        />
      </Form.Item>

      <Form.Item
        name="recipientName"
        label="Tên người nhận"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập số tài khoản để hiển thị tên người nhận!",
          },
        ]}
      >
        <Input
          placeholder="Tên người nhận sẽ tự động hiển thị"
          readOnly
          value={fullName}
          suffix={loading && <span>Đang tìm...</span>}
        />
      </Form.Item>
    </>
  );
};

const Transfer = () => {
  const {
    form,
    isExternalTransfer,
    setIsExternalTransfer,
    handleTransfer,
    loading,
    accountNumber,
    setAccountNumber,
    fetchInfo,
    profile,
    showSaveRecipientModal,
    setShowSaveRecipientModal,
    recipientToSave,
    handleSaveRecipient,
    nickName,
    setNickName,
    fullName,
  } = TransferService();
  const location = useLocation();
  const [initialAccountNumber, setInitialAccountNumber] = useState("");

  useEffect(() => {
    form.setFieldsValue({
      content: `${profile.full_name} chuyển tiền `,
    });

    if (location.state?.accountNumber) {
      const accNumber = location.state.accountNumber;
      setInitialAccountNumber(accNumber);
    }
  }, [location.state]);

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-md">
      <Form form={form} layout="vertical" onFinish={handleTransfer}>
        <Form.Item name="transferType" className="mb-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={isExternalTransfer}
              onChange={setIsExternalTransfer}
            />
            <span>Chuyển khoản liên ngân hàng</span>
          </div>
        </Form.Item>

        {isExternalTransfer && (
          <Form.Item
            name="bank"
            label="Tên ngân hàng"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên ngân hàng!",
              },
            ]}
          >
            <Input placeholder="Nhập tên ngân hàng" maxLength={50} />
          </Form.Item>
        )}

        <AccountAutocomplete
          form={form}
          initialAccountNumber={initialAccountNumber}
          isExternalTransfer={isExternalTransfer}
        />

        <Form.Item
          name="amount"
          label="Số tiền"
          rules={[
            { required: true, message: "Vui lòng nhập số tiền!" },
            {
              validator: async (_, value) => {
                const amount = parseInt(value, 10);
                if (isNaN(amount) || amount <= 0) {
                  throw new Error("Số tiền phải lớn hơn 0!");
                }
                if (amount % 1 !== 0) {
                  throw new Error("Số tiền phải là số nguyên!");
                }
              },
            },
          ]}
        >
          <Input
            type="number"
            placeholder="Nhập số tiền"
            min={1}
            step={1}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>

        <Form.Item
          name="content"
          label="Nội dung chuyển khoản"
          initialValue="Chuyển tiền"
          rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
        >
          <Input.TextArea
            placeholder="Nhập nội dung chuyển khoản"
            defaultValue="Chuyển tiền"
          />
        </Form.Item>

        <FeeSelect />

        <Button
          type="primary"
          htmlType="submit"
          className="w-full"
          loading={loading}
        >
          {isExternalTransfer ? "Chuyển khoản liên ngân hàng" : "Chuyển khoản"}
        </Button>
      </Form>

      <Modal
        title="Lưu người nhận"
        open={showSaveRecipientModal}
        onOk={handleSaveRecipient}
        onCancel={() => {
          setShowSaveRecipientModal(false);
          setNickName(fullName);
          form.resetFields();
        }}
        okText="Lưu"
        cancelText="Không lưu"
      >
        <p>Bạn có muốn lưu người nhận này vào danh sách không?</p>
        {recipientToSave && (
          <div className="mt-4 space-y-4">
            <p>
              <strong>Số tài khoản:</strong> {recipientToSave.account_number}
            </p>
            <p>
              <strong>Ngân hàng:</strong> {recipientToSave.bank}
            </p>
            <div>
              <p className="mb-2">
                <strong>Tên gợi nhớ:</strong>
              </p>
              <Input
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên gợi nhớ!",
                  },
                ]}
                placeholder="Nhập tên gợi nhớ"
                value={nickName}
                onChange={(e) => setNickName(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Transfer;
