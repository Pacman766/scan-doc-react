import {rootReducer} from "./reducers";
import { configureStore } from '@reduxjs/toolkit'
import {useDispatch, useSelector, useStore} from "react-redux";

export const store = configureStore({
    reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export type AppState = ReturnType<typeof store.getState>;

export const useAppSelector = useSelector.withTypes<AppState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppStore = useStore.withTypes<typeof store>();

