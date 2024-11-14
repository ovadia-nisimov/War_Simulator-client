// src/store/slices/userSlice.ts

import {ActionReducerMapBuilder,createAsyncThunk,createSlice,} from "@reduxjs/toolkit";
import { DataStatus, userState } from "../../types/redux";
import { IUser } from "../../types/user";

const initialState: userState = {
  error: null,
  status: DataStatus.IDLE,
  user: null,
};

export const fetchLogin = createAsyncThunk(
  "user/login",
  async (userData: { username: string; password: string }, thunkApi) => {
    try {
      const res = await fetch("http://localhost:3500/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        return thunkApi.rejectWithValue("Unable to login, please try again");
      }

      const token = res.headers.get("Authorization")?.replace("Bearer ", "");
      if (token) {
        localStorage.setItem("token", token);
      } else {
        return thunkApi.rejectWithValue("Token not found in response headers");
      }

      const data = await res.json();
      data.user.isAttacker = data.user.organization !== "IDF";
      return thunkApi.fulfillWithValue(data.user);
    } catch (error) {
      return thunkApi.rejectWithValue(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.status = DataStatus.IDLE;
      state.error = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<userState>) => {
    builder
      .addCase(fetchLogin.pending, (state) => {
        state.status = DataStatus.LOADING;
        state.error = null;
        state.user = null;
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.status = DataStatus.SUCCESS;
        state.error = null;
        state.user = action.payload as IUser;
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.payload as string;
        state.user = null;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice;