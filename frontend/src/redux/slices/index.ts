import {combineReducers} from '@reduxjs/toolkit';
import superheroReducer from "./superhero.ts"

const index = combineReducers({
    superheros: superheroReducer
});

export default index;
