import { initialAuthStateType } from "./auth/types";
import { initialAppStateType } from "./app/types";

interface RootState {
  auth: initialAuthStateType;
  app: initialAppStateType;
}

export type { RootState };
