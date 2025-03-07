import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../types/type";

interface UserReducerInitialState {
    user: IUser | null;
    loading: boolean;
}

const initialState: UserReducerInitialState = {
    user: null,
    loading: true,
};

export const userReducer = createSlice({
    name: "userReducer",
    initialState,
    reducers: {
        userExist: (state, action: PayloadAction<IUser>) => {
            state.loading = true;
            state.user = action.payload;
            state.loading = false;
        },
        userNotExist: (state) => {
            state.loading = false;
            state.user = null;
        },
    },
});

export const { userExist, userNotExist } = userReducer.actions;
