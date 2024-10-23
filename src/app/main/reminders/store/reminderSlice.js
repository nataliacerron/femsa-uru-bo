import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";


export const addReminder = createAsyncThunk(
  "remindersApp/reminder/addReminder",
  async (reminderData, { dispatch, getState }) => {
    console.log('noti', reminderData)
    const response = await axios.post(
      BASE_URL + API_VERSION3 + "/back/alerts/email",
      reminderData,
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);

export const updateReminder = createAsyncThunk(
  "remindersApp/reminder/updateReminder",
  async (reminderData, { dispatch, getState }) => {
    console.log('reminderData', reminderData)
    const response = await axios.put(
      BASE_URL + API_VERSION3 + `/back/alerts/email`,
      reminderData,
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);

export const removeReminder = createAsyncThunk(
  "remindersApp/reminder/removeReminder",
  async (val, { dispatch, getState }) => {
    await axios.delete(BASE_URL + API_VERSION3 + `/back/reminders/${val}`, {
      headers: { Authorization: TOKEN },
    });
    return id;
  }
);


const reminderSlice = createSlice({
  name: "remindersApp/reminder",
  initialState: {
    reminder: {
      email: "",
      purchases: false,
      clients: false,
      commercials: false,
      products: false,
      prizes: false
    },
  },
  reducers: {
    resetReminder: () => null,
    newReminder: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          email: "",
          purchases: false,
          clients: false,
          commercials: false,
          products: false,
          prizes: false,
        },
      }),
    },
    setReminder: {
      reducer: (state, action) => action.payload,
    },
  },
  extraReducers: {
    [addReminder.fulfilled]: (state, action) => action.payload,
    [updateReminder.fulfilled]: (state, action) => action.payload,
    [removeReminder.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetReminder, newReminder, setReminder } = reminderSlice.actions;

export const selectReminder = ({ remindersApp }) => remindersApp.reminder;

export default reminderSlice.reducer;
