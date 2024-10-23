import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";


export const getReminders = createAsyncThunk(
  "remindersApp/getReminders",
  async () => {
    const response = await axios.get(BASE_URL + API_VERSION3 + "/back/alerts/email", {
      headers: { Authorization: TOKEN },
    });
    const data = await response.data;

    return data;
  }
);

export const getVariables = createAsyncThunk("remindersApp/getVariables", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/variables", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

const remindersAdapter = createEntityAdapter({
  selectId: (reminder) => reminder.email,
});


export const { selectAll: selectReminders, selectById: selectReminderByEmail } =
  remindersAdapter.getSelectors((state) => state.remindersApp.reminders);

const remindersSlice = createSlice({
  name: "remindersApp",
  initialState: remindersAdapter.getInitialState({
    searchText: "",
  }),
  reducers: {
    setRemindersSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getReminders.fulfilled]: remindersAdapter.setAll,
    [getVariables.fulfilled]: (state, action) => {
      state.variables = action.payload;
    },
  },
});

export const { setRemindersSearchText } = remindersSlice.actions;

export const selectRemindersSearchText = ({ remindersApp }) =>
  remindersApp.reminders.searchText;

export default remindersSlice.reducer;
