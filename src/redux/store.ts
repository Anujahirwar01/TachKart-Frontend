import { configureStore } from '@reduxjs/toolkit';
import { userAPI } from './api/userAPI';
import { userReducer } from './reducer/userReducer';
import { productAPI } from './api/productAPI';
import { cartReducer } from './reducer/cartReducer';
import { paymentAPI } from './api/paymentAPI';
import { orderApi } from './api/orderAPI';
import { dashboardApi } from './api/dashboardAPI';

export const server = import.meta.env.VITE_SERVER;

const store = configureStore({
    reducer: {
        [userAPI.reducerPath]: userAPI.reducer,
        [userReducer.name]: userReducer.reducer,
        [productAPI.reducerPath]: productAPI.reducer,
        [cartReducer.name]: cartReducer.reducer,
        [paymentAPI.reducerPath]: paymentAPI.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userAPI.middleware).concat(productAPI.middleware).concat(paymentAPI.middleware).concat(orderApi.middleware).concat(dashboardApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;