import { initialAuthStateType, AuthActionTypes } from "./types";

import {
  AUTH_ERROR,
  LOGIN_FAIL,
  REGISTER_FAIL,
  AUTH_LOADING,
  AUTH_SUCCESS,
  LOGIN_SUCCESS,
  REGISTER_SUCCESS,
} from "./authTypes";

const initialState: initialAuthStateType = {
  error: null,
  isLoading: false,
  isAuthenticated: false,
};

export default function (
  state: initialAuthStateType = initialState,
  action: AuthActionTypes,
) {
  switch (action.type) {
    case AUTH_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case AUTH_SUCCESS:
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case REGISTER_FAIL:
      return {
        isAuthenticated: false,
        isLoading: false,
        error: action.payload ? action.payload.error : "Unknown error",
      };
  }
  return state;
}
