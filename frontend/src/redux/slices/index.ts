import {combineReducers} from '@reduxjs/toolkit';
import superheroReducer from "./superhero.ts"

const index = combineReducers({
    superheroes: superheroReducer
});

export default index;
