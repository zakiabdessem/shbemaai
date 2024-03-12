// src/store/hooks.ts
import {
  useDispatch as useReduxDispatch,
  TypedUseSelectorHook,
  useSelector as useReduxSelector,
} from "react-redux";

import type { RootState } from "./stateTypes";
import type { AppDispatch } from "./Store";

export const useDispatch = () => useReduxDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
