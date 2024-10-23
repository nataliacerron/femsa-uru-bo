import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";


export const getNotificationsConsumers = createAsyncThunk(
  "notificationsConsumersApp/getNotificationsConsumers",
  async () => {
    const response = await axios.get(BASE_URL + API_VERSION3 + "/back/notifications", {
      headers: { Authorization: TOKEN },
    });
    const data = await response.data;
    data.reverse();
    return data;
  }
);

export const getVariables = createAsyncThunk("notificationsConsumersApp/getVariables", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/variables", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

const notificationsConsumersAdapter = createEntityAdapter({});

export const { selectAll: selectNotificationsConsumers, selectById: selectNotificationConsumerById } =
  notificationsConsumersAdapter.getSelectors((state) => state.notificationsConsumersApp.notificationsConsumers);

const notificationsConsumersSlice = createSlice({
  name: "notificationsConsumersApp",
  initialState: notificationsConsumersAdapter.getInitialState({
    searchText: "",
  }),
  reducers: {
    setNotificationsConsumersSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getNotificationsConsumers.fulfilled]: notificationsConsumersAdapter.setAll,
    [getVariables.fulfilled]: (state, action) => {
      state.variables = action.payload;
    },
  },
});

export const { setNotificationsConsumersSearchText } = notificationsConsumersSlice.actions;

export const selectNotificationsConsumersSearchText = ({ notificationsConsumersApp }) =>
  notificationsConsumersApp.notificationsConsumers.searchText;

export default notificationsConsumersSlice.reducer;
