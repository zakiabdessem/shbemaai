import { initialAppStateType, AppErrorActionType } from "./types";
import { toast } from "react-toastify";

import {
  APP_SET_ERROR,
  APP_SET_SUCCESS,
  APP_SET_LOADING,
  APP_CLEAR_LOADING,
} from "./appTypes";

const initialState: initialAppStateType = {
  error: null,
  success: null,
  loading: false,
};

export default function (
  state: initialAppStateType = initialState,
  action: AppErrorActionType,
) {
  switch (action.type) {
    case APP_SET_LOADING:
      return {
        ...state,
        loading: true,
      };
    case APP_CLEAR_LOADING:
      return {
        ...state,
        loading: false,
      };
    case APP_SET_ERROR:
      toast.error(action.payload ? action.payload.error : "Unknown error", {
        position: "bottom-right",
      });
      return {
        ...state,
        loading: false,
      };
    case APP_SET_SUCCESS:
      toast.success(
        action.payload ? action.payload.success : "Successful operation",
        {
          position: "bottom-right",
        },
      );
      return {
        ...state,
        loading: false,
      };
  }
  return state;
}
