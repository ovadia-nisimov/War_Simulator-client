import { ActionReducerMapBuilder, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DataStatus }  from "../types/redux";
import { IUser } from "../types/user";




interface userState {
  error: string | null;
  status: DataStatus;
  user: null | IUser;
}

const initialState: userState = {
  error: null,
  status: DataStatus.IDLE,
  user: null,
};

export const fetchLogin = createAsyncThunk(
  "user/login",
  async (user: { username: string; password: string }, thunkApi) => {
    try {
      const res = await fetch("http://localhost:3500/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      
      if (!res.ok) {
        return thunkApi.rejectWithValue("Can't login, please try again");
      }

      // שליפת הטוקן מההדר
      const token = res.headers.get("Authorization");
      if (token) {
        localStorage.setItem("token", token);
      }

      const data = await res.json();
      return thunkApi.fulfillWithValue(data);
    } catch (err) {
      return thunkApi.rejectWithValue("Can't login, please try again");
    }
  }
);


const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    initUser:(state) => {
      state.user = null
  },
    logout: (state) => {
      state.user = null;
      state.status = DataStatus.IDLE;
      state.error = null;
      localStorage.removeItem("Authorization");
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
      })
  },
});

export const { logout, initUser } = userSlice.actions;
export default userSlice.reducer;