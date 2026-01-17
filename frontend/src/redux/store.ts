import { configureStore } from "@reduxjs/toolkit";
import { useDispatch as useDispatchRedux, useSelector as useSelectorRedux } from 'react-redux';
import rootReducer from './slices';

const store = configureStore({
    reducer: rootReducer,
});

export const useDispatch = useDispatchRedux();
export const useSelector = useSelectorRedux;

export default store;
