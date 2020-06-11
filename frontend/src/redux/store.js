import {
  configureStore,
  getDefaultMiddleware,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

const middleware = [...getDefaultMiddleware()];

const initialAccountState = {
  loggedIn: false,
  username: null,
  fullName: null,
  token: null,
  accountFormType: "login",
  adminAccount: false,
};

export const LOG_IN = createAsyncThunk(
  "userStatus/login",
  async (credentials, { rejectWithValue, dispatch }) => {
    const rawData = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(credentials),
    });
    const response = await rawData.json();
    if (response.error) return rejectWithValue(response.error);
    dispatch(SET_ACCOUNT_FORM_TYPE("logout"));
    return response;
  }
);

const accountSlice = createSlice({
  name: "userStatus",
  initialState: initialAccountState,
  reducers: {
    LOG_OUT: (state, action) => {
      state.loggedIn = false;
      state.username = null;
      state.fullName = null;
      state.token = null;
      state.adminAccount = false;
      state.accountFormType = "login";
    },
    SET_ACCOUNT_FORM_TYPE: (state, action) => {
      state.accountFormType = action.payload;
    },
    VALID_SESSION: (state, action) => {
      state.loggedIn = true;
      state.username = action.payload.username;
      state.fullName = action.payload.fullName;
      state.token = action.payload.token;
      if (action.payload.adminAccount) state.adminAccount = true;
      state.accountFormType = "logout";
    },
  },
  extraReducers: {
    [LOG_IN.fulfilled]: (state, action) => {
      state.loggedIn = true;
      state.username = action.payload.username;
      state.fullName = action.payload.fullName;
      state.token = action.payload.token;
      if (action.payload.adminAccount) state.adminAccount = true;
    },
  },
});

export const {
  LOG_OUT,
  SET_ACCOUNT_FORM_TYPE,
  VALID_SESSION,
} = accountSlice.actions;
const accountReducer = accountSlice.reducer;

export const store = configureStore({
  reducer: {
    userStore: accountReducer,
  },
  middleware,
});
