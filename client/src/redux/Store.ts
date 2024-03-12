import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authReducer";
import appReducer from "../redux/app/appReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
  },
});

export type AppDispatch = typeof store.dispatch;

export default store;
