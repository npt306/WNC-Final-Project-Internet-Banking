// Nha si
import { lazy } from "react";
const SignIn = lazy(() => import("../pages/auth/Signin"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const AuthRouter = [
  {
    name: "Signin",
    path: "/",
    component: SignIn,
    Layout: null,
  },
  {
    name: "ForgotPassword",
    path: "/forgot-password",
    component: ForgotPassword,
    Layout: null,
  },
];

export default AuthRouter;
