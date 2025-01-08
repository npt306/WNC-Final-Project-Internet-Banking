import { createSlice } from "@reduxjs/toolkit";

export const globalStateSlice = createSlice({
  name: "globalState",
  initialState: {
    state: true,
    nickname: "",
  },
  reducers: {
    resetState: (state) => {
      state.state = !state.state;
    },
    setNickname: (state, action) => {
      state.nickname = action.payload;
    },
  },
});

export const { resetState, setNickname } = globalStateSlice.actions;
export default globalStateSlice.reducer;
