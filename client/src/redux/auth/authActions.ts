import axios from "axios";
import { API_URL } from "../../app/constants";
import {
  AUTH_LOADING,
  AUTH_SUCCESS,
  AUTH_ERROR,
  LOGIN_SUCCESS,
} from "./authTypes";
import ls from "../../utils/localStorage";

import { Dispatch } from "redux";

export const verifyToken = () => async (dispatch: Dispatch) => {
  dispatch({ type: AUTH_LOADING });

  try {
    const response = await axios.get(`${API_URL}/user/verify`, {
      withCredentials: true,
    });

    if (response.status === 200) dispatch({ type: AUTH_SUCCESS });
  } catch (e) {
    dispatch({
      type: AUTH_ERROR,
      payload: { error: "Please login again to access that page" },
    });
  }
};

export const loginAction =
  (email: string, password: string) => async (dispatch: Dispatch) => {
    dispatch({ type: AUTH_LOADING });
    try {
      const response = await axios.post(
        `${API_URL}/user/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        ls.setToLs("user_data", response.data.user);

        dispatch({
          type: LOGIN_SUCCESS,
        });
        return true;
      }
    } catch (e: any) {
      console.log(e);
      dispatch({
        type: AUTH_ERROR,
        payload: { error: e.response.data.error || "something went wrong" },
      });
      return false;
    }
  };
