// Nha si
import { lazy } from "react";
const SignIn = lazy(() => import("../pages/auth/Signin"));
const SignIn2 = lazy(() => import("../pages/auth/Signin2"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const AuthRouter = [
  {
    name: "Signin",
    path: "/",
    component: SignIn,
    Layout: null,
  },
  {
    name: "Signin2",
    path: "/s",
    component: SignIn2,
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
