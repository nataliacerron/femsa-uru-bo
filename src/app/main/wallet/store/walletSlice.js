import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const addWallet = createAsyncThunk(
  "WalletsApp/Wallet/addWallet",
  async (WalletData, { dispatch, getState }) => {
    console.log('WalletData a guardar', WalletData)
    const response = await axios.post(
      BASE_URL + API_VERSION3 + "/back/manual_exchanges",
      { ...WalletData },
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    console.log('dataaaaaa', data)
    return data;
  }
);

/*export const updateWallet = createAsyncThunk(
  "WalletsApp/Wallet/updateWallet",
  async (WalletData, { dispatch, getState }) => {
    console.log('WalletData', WalletData)
    const response = await axios.put(
      BASE_URL + API_VERSION3 + "/back/catalogs",
      { ...WalletData },
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);



export const removeWallet = createAsyncThunk(
  "WalletsApp/Wallet/removeWallet",
  async (val, { dispatch, getState }) => {
    console.log('deleteeeeeee', val)
    await axios.delete(BASE_URL + API_VERSION3 + `/back/catalogs/${val}`,
      { headers: { Authorization: TOKEN } });
    return id;
  }
);*/

const WalletSlice = createSlice({
  name: "WalletsApp/Wallet",
  initialState: {
    Wallet: { title: "", qty: null, },
  },
  reducers: {
    resetWallet: () => null,
    newWallet: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          title: "",
          qty: null,
        },
      }),
    },
    setWallet: {
      reducer: (state, action) => action.payload,
    },
  },
  extraReducers: {
    [addWallet.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetWallet, newWallet, setWallet } = WalletSlice.actions;

export const selectWallet = ({ WalletsApp }) => WalletsApp.Wallet;

export default WalletSlice.reducer;
