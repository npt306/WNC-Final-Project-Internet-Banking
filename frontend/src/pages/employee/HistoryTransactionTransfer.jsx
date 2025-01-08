import React from "react";
import TransactionHistory from "../../components/employee/TransactionHistory";
import PublicService from "../../services/Public.service";

const HistoryTransactionTransfer = () => {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Lịch Sử Giao Dịch Chuyển Tiền</h1>
      <TransactionHistory
        fetchData={PublicService.transaction.get_transfer_trans_his_anb}
        type="TRANSFER"
      />
    </div>
  );
};

export default HistoryTransactionTransfer;
