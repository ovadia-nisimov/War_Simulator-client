// src/store/slices/AttacksSlice.ts

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

// export const createAttack = createAsyncThunk(
//   "attacks/createAttack",
//   async (attackData: { missileName: string; regionAttacked: string; attackerId: string }) => {
//     return new Promise<IAttack>((resolve, reject) => {
//       socket.emit("attackLaunch", attackData, (response: IAttack | string) => {
//         if (typeof response === "string") {
//           reject(response);
//         } else {
//           resolve(response);
//         }
//       });
//     });
//   }
// );

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
      // .addCase(createAttack.pending, (state) => {
      //   state.status = DataStatus.LOADING;
      // })
      // .addCase(createAttack.fulfilled, (state, action: PayloadAction<IAttack>) => {
      //   state.attacks.push(action.payload);
      //   state.status = DataStatus.SUCCESS;
      // })
      // .addCase(createAttack.rejected, (state, action) => {
      //   state.status = DataStatus.FAILED;
      //   state.error = action.error.message || "Failed to create attack";
      // });
  },
});

export const { addAttack, resetAttacks } = attacksSlice.actions;
export default attacksSlice;