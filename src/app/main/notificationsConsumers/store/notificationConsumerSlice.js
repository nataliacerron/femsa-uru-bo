import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";


export const addNotificationConsumer = createAsyncThunk(
  "notificationsConsumersApp/notificationConsumer/addNotificationConsumer",
  async (notificationConsumerData, { dispatch, getState }) => {
    console.log('noti', notificationConsumerData)
    const response = await axios.post(
      BASE_URL + API_VERSION3 + "/back/notifications",
      notificationConsumerData,
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);

export const updateNotificationConsumer = createAsyncThunk(
  "notificationsConsumersApp/notificationConsumer/updateNotificationConsumer",
  async (notificationConsumerData, { dispatch, getState }) => {
    console.log('notificationConsumerData', notificationConsumerData)
    const response = await axios.put(
      BASE_URL + API_VERSION3 + `/back/notifications/${notificationConsumerData.id}`,
      notificationConsumerData,
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);

export const removeNotificationConsumer = createAsyncThunk(
  "notificationsConsumersApp/notificationConsumer/removeNotificationConsumer",
  async (val, { dispatch, getState }) => {
    await axios.delete(BASE_URL + API_VERSION3 + `/back/notifications/${val}`, {
      headers: { Authorization: TOKEN },
    });
    return id;
  }
);


const notificationConsumerSlice = createSlice({
  name: "notificationsConsumersApp/notificationConsumer",
  initialState: {
    notificationConsumer: { img: "", channel: "", gec: "", title: "" },
  },
  reducers: {
    resetNotificationConsumer: () => null,
    newNotificationConsumer: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          img: "",
          channel: "",
          gec: "",
          title: "",
        },
      }),
    },
    setNotificationConsumer: {
      reducer: (state, action) => action.payload,
    },
  },
  extraReducers: {
    [addNotificationConsumer.fulfilled]: (state, action) => action.payload,
    [updateNotificationConsumer.fulfilled]: (state, action) => action.payload,
    [removeNotificationConsumer.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetNotificationConsumer, newNotificationConsumer, setNotificationConsumer } = notificationConsumerSlice.actions;

export const selectNotificationConsumer = ({ notificationsConsumersApp }) => notificationsConsumersApp.notificationConsumer;

export default notificationConsumerSlice.reducer;
