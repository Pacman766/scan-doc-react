import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Config, initialState} from "../../types/config";
import {Scanner} from "../../types/scanner";

const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        setConfig: (state, action: PayloadAction<Config>) => {
            state.config = action.payload;
            state.error = null;
        }
    }
});

export const {setConfig} = configSlice.actions;
export default configSlice.reducer;