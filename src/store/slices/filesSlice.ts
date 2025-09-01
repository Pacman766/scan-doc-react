import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { initialState, Page } from "../../types/scanFiles"

const filesSlice = createSlice({
    name: 'files',
    initialState,
    reducers: {
        setFiles: (state, action: PayloadAction<Page>) => {
            if (state.pages){
                state.pages.push(action.payload)
            } else {
                state.pages = [action.payload];
            }
            state.error = null;
        },
        setAllFiles: (state, action: PayloadAction<Page[]>) => {
            state.pages = action.payload;
            state.error = null;
        },
        setFilesError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
        },
        setFilesLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        deletePage: (state, action: PayloadAction<number>) => {
            if (!state.pages) return;

            state.pages = state.pages
                .filter(page => page.number !== action.payload)
                .map((page, i) => ({
                    ...page,
                    number: i+1,
                }));
        }
    }
});

export const {setFiles, setAllFiles, setFilesError, setFilesLoading, deletePage } = filesSlice.actions;
export default filesSlice.reducer;