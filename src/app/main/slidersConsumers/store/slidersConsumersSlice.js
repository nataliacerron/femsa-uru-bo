import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";


export const getSlidersConsumers = createAsyncThunk(
  "slidersConsumersApp/getSlidersConsumers",
  async () => {

    const response = await axios.get(BASE_URL + API_VERSION3 + `/back/sliders/consumers`, {
      headers: { Authorization: TOKEN },
    });
    let data = await response.data;
    data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    return data;
  }
);

export const getVariables = createAsyncThunk("slidersConsumersApp/getVariables", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/variables", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

const slidersConsumersAdapter = createEntityAdapter({});

export const { selectAll: selectSlidersConsumers, selectById: selectSliderConsumerById } =
  slidersConsumersAdapter.getSelectors((state) => state.slidersConsumersApp.slidersConsumers);

const slidersConsumersSlice = createSlice({
  name: "slidersConsumersApp",
  initialState: slidersConsumersAdapter.getInitialState({
    searchText: "",
  }),
  reducers: {
    setSlidersConsumersSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getSlidersConsumers.fulfilled]: slidersConsumersAdapter.setAll,
    [getVariables.fulfilled]: (state, action) => {
      state.variables = action.payload;
    },
  },
});

export const { setSlidersConsumersSearchText } = slidersConsumersSlice.actions;

export const selectSlidersConsumersSearchText = ({ slidersConsumersApp }) =>
  slidersConsumersApp.slidersConsumers.searchText;

export default slidersConsumersSlice.reducer;
