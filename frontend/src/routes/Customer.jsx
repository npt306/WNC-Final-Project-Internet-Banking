import { lazy } from "react";

// import CustomerLayout from "../components/Layout/CustomerLayout";
const CustomerLayout = lazy(() =>
  import("../components/Layout/CustomerLayout")
);
const HomeCustomer = lazy(() => import("../pages/customer/index"));
const Transfer = lazy(() => import("../pages/customer/Transfer"));
const History = lazy(() => import("../pages/customer/History"));
const ListRecipient = lazy(() => import("../pages/customer/RecipientManager"));
const DebtReminderManager = lazy(() =>
  import("../pages/customer/DebtReminderManager")
);
const Profile = lazy(() => import("../pages/customer/ProfilePage"));
const SignIn = lazy(() => import("../pages/auth/Signin"));
const CustomerRouter = [
  {
    name: null,
    path: "/test",
    component: HomeCustomer,
    Layout: CustomerLayout,
  },
  {
    name: null,
    path: "/signin",
    component: SignIn,
    Layout: null,
  },
  {
    name: "Chuyển khoản",
    path: "/",
    component: Transfer,
    Layout: CustomerLayout,
  },
  {
    name: "Lịch sử giao dịch",
    path: "/history",
    component: History,
    Layout: CustomerLayout,
  },
  {
    name: "Danh sách người nhận",
    path: "/list-recipient",
    component: ListRecipient,
    Layout: CustomerLayout,
  },
  {
    name: "Quản lí nhắc nợ",
    path: "/debt-reminder",
    component: DebtReminderManager,
    Layout: CustomerLayout,
  },
  {
    name: null,
    path: "/profile",
    component: Profile,
    Layout: CustomerLayout,
  },
];

export default CustomerRouter;
