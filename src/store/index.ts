import { configureStore } from '@reduxjs/toolkit'
import {useDispatch, useSelector, useStore} from "react-redux";
import {configReducer} from "./reducers/configReducer";
import scaleReducer from "./slices/scaleSlice";

export const store = configureStore({
    reducer: {
        config: configReducer,
        scale: scaleReducer
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export type AppState = ReturnType<typeof store.getState>;

export const useAppSelector = useSelector.withTypes<AppState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppStore = useStore.withTypes<typeof store>();

