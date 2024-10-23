import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const getWalletsPendings = createAsyncThunk(
  "WalletsApp/getWalletsPendings",
  async () => {
    const response = await axios.get(
      BASE_URL + API_VERSION3 + `/back/billetera_envases/requested/pending`,
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    //data.reverse()
    return data;
  }
);

export const getWalletsConfirmed = createAsyncThunk(
  "WalletsApp/getWalletsConfirmed",
  async () => {
    const response = await axios.get(
      BASE_URL + API_VERSION3 + `/back/billetera_envases/requested/confirmed`,
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;

    return data;
  }
);
export const getWalletsTrxs = createAsyncThunk(
  "WalletsApp/getWalletsTrxs",
  async () => {
    const response = await axios.get(
      BASE_URL + API_VERSION3 + `/back/billetera_envases/trxs`,
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    return data;
  }
);

export const getVariables = createAsyncThunk(
  "WalletsApp/getVariables",
  async () => {
    const response = await axios.get(
      BASE_URL + API_VERSION3 + "/back/variables",
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    return data;
  }
);
export const getBrands = createAsyncThunk("misionsApp/getBrands", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/brands", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

export const getProducts = createAsyncThunk("misionsApp/getProducts", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/products", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

const WalletsAdapter = createEntityAdapter({});

export const { selectAll: selectWallets, selectById: selectWalletById } =
  WalletsAdapter.getSelectors((state) => state.WalletsApp.Wallets);

const WalletsSlice = createSlice({
  name: "WalletsApp",
  initialState: WalletsAdapter.getInitialState({
    searchText: "",
    variables: [],
  }),
  reducers: {
    setWalletsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getWalletsPendings.fulfilled]: WalletsAdapter.setAll,
    [getWalletsConfirmed.fulfilled]: WalletsAdapter.setAll,
    [getWalletsTrxs.fulfilled]: WalletsAdapter.setAll,
    [getVariables.fulfilled]: (state, action) => {
      state.variables = action.payload;
    },
  },
});

export const { setWalletsSearchText } = WalletsSlice.actions;

export const selectWalletsSearchText = ({ WalletsApp }) =>
  WalletsApp.Wallets.searchText;
export const selectVariables = ({ WalletsApp }) => WalletsApp.Wallets.variables;

export default WalletsSlice.reducer;
