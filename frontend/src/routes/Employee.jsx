import { lazy } from "react";
import { MdCallReceived } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { HiUserGroup } from "react-icons/hi2";

import { TbTransfer } from "react-icons/tb";
import { IoMdVolumeHigh } from "react-icons/io";

const EmployeeLayout = lazy(() => import("~/components/Layout/EmployeeLayout"));
// import EmployeeLayout from "../components/Layout/EmployeeLayout";
const Profile = lazy(() => import("~/pages/employee/ProfilePage"));
const ManagerCustomer = lazy(() => import("~/pages/employee/ManagerCustomer"));

const HistoryTransactionDebt = lazy(() =>
  import("~/pages/employee/HistoryTransactionDebt")
);
const HistoryTransactionReceived = lazy(() =>
  import("~/pages/employee/HistoryTransactionReceived")
);
const HistoryTransactionTransfer = lazy(() =>
  import("~/pages/employee/HistoryTransactionTransfer")
);

const EmployeeRouter = [
  {
    name: "Quản lý tài khoản",
    path: "/",
    component: ManagerCustomer,
    icon: <HiUserGroup className="text-xl" />,
    Layout: EmployeeLayout,
  },
  {
    name: "Giao dịch nhận tiền",
    path: "/history-transaction-receive",
    component: HistoryTransactionReceived,
    icon: <MdCallReceived className="text-xl" />,
    Layout: EmployeeLayout,
  },
  {
    name: "Giao dịch chuyển khoản",
    path: "/history-transaction-transfer",
    component: HistoryTransactionTransfer,
    icon: <TbTransfer className="text-xl" />,
    Layout: EmployeeLayout,
  },
  {
    name: "Thanh toán nhắc nợ",
    path: "/history-transaction-debt",
    component: HistoryTransactionDebt,
    icon: <IoMdVolumeHigh className="text-xl" />,
    Layout: EmployeeLayout,
  },
  {
    name: null,
    path: "/profile",
    component: Profile,
    Layout: EmployeeLayout,
  },
];

export default EmployeeRouter;
