import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import history from "@history";
import _ from "@lodash";
import { setInitialSettings } from "app/store/fuse/settingsSlice";
import { showMessage } from "app/store/fuse/messageSlice";
import settingsConfig from "app/configs/settingsConfig";
import jwtService from "../auth/services/jwtService";
import { API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";
import axios from "axios";

export const login = createAsyncThunk("user/login", async (Userdata, { dispatch, getState }) => {
  const response = await axios.post(
    BASE_URL + API_VERSION3 + "/back/users/login",
    { id: Userdata.email, password: Userdata.password },
    { headers: { Authorization: TOKEN } }
  );

  const data = await response.data;
  console.log("data", data);
  const response2 = await axios.get(BASE_URL + API_VERSION3 + `/back/users/${data.id}`, { headers: { Authorization: TOKEN } });
  const data2 = await response2.data[0];

  if (!_.isEmpty(data)) {
    console.log("data2", data2);
    data.role = [];
    data.role.push(data.profile);
    data.data = {};
    data.data.displayName = data.first_name + " " + data.last_name;
    data.photo_url = data2.photo_url;
    console.log("data", data);
    if (data.photo_url === null || data.photo_url === "" || data.photo_url === undefined) {
      data.data.photo_url = "assets/images/user3.png";
    } else {
      data.data.photo_url = data.photo_url;
    }
  }
  return data;
});

export const getUserById = createAsyncThunk("user/getUserById", async (userId) => {
  const response = await axios.get(BASE_URL + API_VERSION3 + `/back/users/${userId}`, { headers: { Authorization: TOKEN } });
  const data = await response.data[0];
  data.photo_url === null || data.photo_url === "" ? (data.photo_url = "assets/images/user3.png") : data.photo_url;

  return data === undefined ? null : data;
});

export const signup = createAsyncThunk("user/login", async (userData, { dispatch, getState }) => {
  const response = await axios.post(BASE_URL + API_VERSION + "/clients/signup", userData, { headers: { Authorization: TOKEN_LOGIN } });
  const data = await response.data;
  return data;
});

export const setUser = createAsyncThunk("user/setUser", async (user, { dispatch, getState }) => {
  /*
    You can redirect the logged-in user to a specific route depending on his role
    */
  if (user.loginRedirectUrl) {
    settingsConfig.loginRedirectUrl = user.loginRedirectUrl; // for example 'apps/academy'
  }

  return user;
});

export const updateUserSettings = createAsyncThunk("user/updateSettings", async (settings, { dispatch, getState }) => {
  const { user } = getState();
  const newUser = _.merge({}, user, { data: { settings } });

  dispatch(updateUserData(newUser));

  return newUser;
});

export const updateUserShortcuts = createAsyncThunk("user/updateShortucts", async (shortcuts, { dispatch, getState }) => {
  const { user } = getState();
  const newUser = {
    ...user,
    data: {
      ...user.data,
      shortcuts,
    },
  };

  dispatch(updateUserData(newUser));

  return newUser;
});

export const logoutUser = () => async (dispatch, getState) => {
  const { user } = getState();

  if (!user.role || user.role.length === 0) {
    // is guest
    return null;
  }

  history.push({
    pathname: "/",
  });

  dispatch(setInitialSettings());

  return dispatch(userLoggedOut());
};

export const updateUserData = (user) => async (dispatch, getState) => {
  if (!user.role || user.role.length === 0) {
    // is guest
    return;
  }

  jwtService
    .updateUserData(user)
    .then(() => {
      dispatch(showMessage({ message: "User data saved with api" }));
    })
    .catch((error) => {
      dispatch(showMessage({ message: error.message }));
    });
};

const initialState = {
  role: [], // guest
  data: {
    displayName: "",
    photo_url: "",
    email: "",
    shortcuts: [],
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLoggedOut: (state, action) => initialState,
  },
  extraReducers: {
    [updateUserSettings.fulfilled]: (state, action) => action.payload,
    [updateUserShortcuts.fulfilled]: (state, action) => action.payload,
    [setUser.fulfilled]: (state, action) => action.payload,
    [login.fulfilled]: (state, action) => action.payload,
    [signup.fulfilled]: (state, action) => action.payload,
    [getUserById.fulfilled]: (state, action) => action.payload,
  },
});

export const { userLoggedOut } = userSlice.actions;

export const selectUser = ({ user }) => user;

export const selectUserShortcuts = ({ user }) => user.data.shortcuts;

export default userSlice.reducer;
