import { Action } from "redux";

type initialAppStateType = {
  error: string | null;
  success: string | null;
  loading: boolean;
};

interface AppErrorActionType extends Action {
  payload?: {
    error: string;
    success: string;
  };
}

export type { initialAppStateType, AppErrorActionType };
