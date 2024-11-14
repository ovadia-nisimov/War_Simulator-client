import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { attacksState, DataStatus } from "../../types/redux";
import { IAttack } from "../../types/attack";

const initialState: attacksState = {
  error: null,
  status: DataStatus.IDLE,
  attacks: [],
};

export const fetchAttacks = createAsyncThunk("attacks/user-attacks", async () => {
  const response = await fetch("http://localhost:3500/api/attacks/user-attacks", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch attacks");
  }

  const data: IAttack[] = await response.json();
  return data;
});

export const fetchAttacksByRegion = createAsyncThunk("attacks/region-attacks", async () => {
  const response = await fetch("http://localhost:3500/api/attacks/region-attacks", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch attacks");
  }

  const data: IAttack[] = await response.json();
  return data;
})

const attacksSlice = createSlice({
  name: "attacks",
  initialState,
  reducers: {
    addAttack: (state, action: PayloadAction<IAttack>) => {
      state.attacks.push(action.payload);
      state.status = DataStatus.SUCCESS;
    },
    resetAttacks: (state) => {
      state.attacks = [];
      state.status = DataStatus.IDLE;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttacks.pending, (state) => {
        state.status = DataStatus.LOADING;
      })
      .addCase(fetchAttacks.fulfilled, (state, action: PayloadAction<IAttack[]>) => {
        state.attacks = action.payload;
        state.status = DataStatus.SUCCESS;
      })
      .addCase(fetchAttacks.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.error.message || "Failed to fetch attacks";
      })
      .addCase(fetchAttacksByRegion.pending, (state) => {
        state.status = DataStatus.LOADING;
      })
      .addCase(fetchAttacksByRegion.fulfilled, (state, action: PayloadAction<IAttack[]>) => {
        state.attacks = action.payload;
        state.status = DataStatus.SUCCESS;
      })
      .addCase(fetchAttacksByRegion.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.error.message || "Failed to fetch attacks";
      });
  },
});

export const { addAttack, resetAttacks } = attacksSlice.actions;
export default attacksSlice;