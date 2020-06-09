import {
  configureStore,
  getDefaultMiddleware,
  createSlice,
} from "@reduxjs/toolkit";

const middleware = [...getDefaultMiddleware()];

const initialAccountState = {
  loggedIn: false,
  username: null,
  fullName: null,
  token: null,
};

const accountSlice = createSlice({
  name: "userStatus",
  initialState: initialAccountState,
  reducers: {
    LOG_IN: (state, action) => {
      state.loggedIn = true;
      state.username = action.payload.username;
      state.fullName = action.payload.fullName;
      state.token = action.payload.token;
    },
    LOG_OUT: (state, action) => {
      state.loggedIn = false;
      state.username = null;
      state.fullName = null;
      state.token = null;
    },
  },
});

export const { LOG_IN, LOG_OUT } = accountSlice.actions;
const accountReducer = accountSlice.reducer;

// const initialOverlayState = {
//   open: false,
// };

// const overlaySlice = createSlice({
//   name: "overlay",
//   initialState: initialOverlayState,
//   reducers: {
//     TOGGLE_OVERLAY: (state, action) => {
//       state.open = !state.open;
//     },
//   },
// });

// export const { TOGGLE_OVERLAY } = overlaySlice.actions;
// const overlayReducer = overlaySlice.reducer;

export const store = configureStore({
  reducer: {
    userStore: accountReducer,
    // overlayStore: overlayReducer,
  },
  middleware,
});
