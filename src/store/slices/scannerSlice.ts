import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {initialState, Scanner} from "../../types/scanner";

const scannerSlice = createSlice({
    name: 'scanner',
    initialState,
    reducers: {
        setScanners: (state, action: PayloadAction<Scanner[]>) => {
            state.scanner = action.payload;
            state.error = null;
        }
    }
});

export const {setScanners} = scannerSlice.actions;
export default scannerSlice.reducer;