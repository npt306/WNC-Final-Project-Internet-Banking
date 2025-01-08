import React from "react";
import AdminRouter from "./routes/Admin";
import EmployeeRouter from "./routes/Employee";
import CustomerRouter from "./routes/Customer";
import AuthRouter from "./routes/Auth";
import { Fragment, Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "./components/err/loading";
const NotfoundError = lazy(() => import("~/components/err"));
function App() {
  const role = useSelector((state) => state.profile.role);
  const VerifyRoure = () => {
    switch (role) {
      case  "ADMIN":
        return AdminRouter;
      case "EMPLOYEE":
        return EmployeeRouter;
      case "CUSTOMER":
        return CustomerRouter;
      default:
        return AuthRouter;
    }
  };
  return (
    <>
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            {VerifyRoure().map((route, index) => {
              const Layout = route.Layout === null ? Fragment : route.Layout;
              const Page =
                route.component === null ? Fragment : route.component;
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
            <Route
              path="*"
              element={
                <Fragment>
                  <NotfoundError />
                </Fragment>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}

export default App;
