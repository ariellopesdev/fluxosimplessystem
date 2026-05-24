import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import productReducer from "./slices/productSlice";
import clientReducer from "./slices/clientSlice";
import salesReducer from "./slices/salesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    product: productReducer,
    client: clientReducer,
    sales: salesReducer,
  },
});
