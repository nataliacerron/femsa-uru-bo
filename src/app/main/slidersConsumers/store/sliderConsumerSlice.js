import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";


export const addSliderConsumer = createAsyncThunk(
  "slidersConsumersApp/sliderConsumer/addSliderConsumer",
  async (sliderConsumerData, { dispatch, getState }) => {
    console.log('slideeeeer', sliderConsumerData)
    const response = await axios.post(
      BASE_URL + API_VERSION + "/back/slidersConsumers",
      sliderConsumerData,
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);

export const updateSliderConsumer = createAsyncThunk(
  "slidersConsumersApp/sliderConsumer/updateSliderConsumer",
  async (sliderConsumerData, { dispatch, getState }) => {
    const response = await axios.put(
      BASE_URL + API_VERSION + "/back/slidersConsumers",
      sliderConsumerData,
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);

export const removeSliderConsumer = createAsyncThunk(
  "slidersConsumersApp/sliderConsumer/removeSliderConsumer",
  async (val, { dispatch, getState }) => {
    const { id } = getState().slidersConsumersApp.sliderConsumer;
    const data = { id: id };
    await axios.delete(BASE_URL + API_VERSION + "/back/slidersConsumers", {
      headers: { Authorization: TOKEN },
      data,
    });
    return id;
  }
);


const sliderConsumerSlice = createSlice({
  name: "slidersConsumersApp/sliderConsumer",
  initialState: {
    sliderConsumer: { image: "", enabled: false, channel: "", gec: "", type: "consumers" },
  },
  reducers: {
    resetSliderConsumer: () => null,
    newSliderConsumer: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          image: "",
          enabled: false,
          channel: "",
          gec: "",
          type: "",
        },
      }),
    },
    setSliderConsumer: {
      reducer: (state, action) => action.payload,
    },
  },
  extraReducers: {
    [addSliderConsumer.fulfilled]: (state, action) => action.payload,
    [updateSliderConsumer.fulfilled]: (state, action) => action.payload,
    [removeSliderConsumer.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetSliderConsumer, newSliderConsumer, setSliderConsumer } = sliderConsumerSlice.actions;

export const selectSliderConsumer = ({ slidersConsumersApp }) => slidersConsumersApp.sliderConsumer;

export default sliderConsumerSlice.reducer;
