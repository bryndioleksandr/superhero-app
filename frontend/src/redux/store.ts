import { configureStore } from "@reduxjs/toolkit";
import { useDispatch as useDispatchRedux, useSelector as useSelectorRedux } from 'react-redux';
import rootReducer from './slices';

const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = () => useDispatchRedux<AppDispatch>();
export const useSelector = useSelectorRedux;

export default store;
