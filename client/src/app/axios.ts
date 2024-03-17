// make axios instace

import axios from "axios";
import { API_URL } from "@/app/constants";

export const instance = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  withCredentials: true,
});
