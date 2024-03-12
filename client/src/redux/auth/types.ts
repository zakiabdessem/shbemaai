import { Action } from "redux";

type initialAuthStateType = {
  error: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

interface AuthErrorAction extends Action {
  payload?: {
    error: string;
    isAuthenticated: boolean;
  };
}

interface LoginFailAction extends Action {
  payload?: {
    error: string;
    isAuthenticated: boolean;
  };
}

type AuthActionTypes = AuthErrorAction | LoginFailAction;

export type { initialAuthStateType, AuthActionTypes };
