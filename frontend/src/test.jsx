import { useEffect } from "react";

import { useDispatch } from "react-redux";
import axios from "axios";
import Axios from "./services/axios.config";
import GetCookie from "./hooks/GetCookie";

const Test = () => {
  const dispatch = useDispatch();

  const tokena = GetCookie("token");

  useEffect(() => {}, []);

  return <>{/* <Print /> */}</>;
};
export default Test;
