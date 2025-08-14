import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type ScaleSlice = number;

const initialState: ScaleSlice = 100;

const scaleSlice = createSlice({
    name: 'scale',
    initialState,
    reducers: {
        setScale: (state, action: PayloadAction<number>) => action.payload
    }
});

export const { setScale } = scaleSlice.actions;
export default scaleSlice.reducer;