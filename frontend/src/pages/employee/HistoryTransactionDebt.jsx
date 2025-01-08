import React from "react";
import TransactionHistory from "../../components/employee/TransactionHistory";
import PublicService from "../../services/Public.service";

const HistoryTransactionDebt = () => {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Lịch Sử Giao Dịch Nhắc Nợ</h1>
      <TransactionHistory
        fetchData={PublicService.transaction.get_debt_trans_history_anb}
        type="DEBT"
      />
    </div>
  );
};

export default HistoryTransactionDebt;
