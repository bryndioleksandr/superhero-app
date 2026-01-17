import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import api from "@/api/axios.ts";

export interface ISuperhero {
    _id: string;
    nickname: string;
    real_name: string;
    origin_description: string;
    superpowers: string[];
    catch_phrase: string;
    images: string[];
}

interface SuperheroState {
    items: ISuperhero[];
    totalDocs: number;
    totalPages: number;
    currentPage: number;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: SuperheroState = {
    items: [],
    totalDocs: 0,
    totalPages: 0,
    currentPage: 1,
    status: 'idle',
    error: null,
}

export const fetchSuperheros = createAsyncThunk("superheros/fetchSuperheros", async (page: number = 1, {rejectWithValue}) => {
    try {
        const res = await api.get(`/superheros/all?page=${page}`);
        return res.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data);
    }
});

export const createSuperhero = createAsyncThunk("superheros/createSuperhero", async (newHero: FormData, {rejectWithValue, dispatch}) => {
    try {
        const res = await api.post(`/superheros/createSuperhero`, newHero);
        dispatch(fetchSuperheros(1));
        return res.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data);
    }
});

export const deleteSuperhero = createAsyncThunk(
    "superheros/deleteSuperhero",
    async (id: string, { rejectWithValue }) => {
        try {
            await api.delete(`/superheros/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const updateSuperhero = createAsyncThunk(
    "superheros/updateSuperhero",
    async ({ id, data }: { id: string; data: FormData }, { rejectWithValue }) => {
        try {
            const res = await api.put(`/superheros/${id}`, data);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    }
);

const superheroSlice = createSlice({
    name: "superhero",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSuperheros.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchSuperheros.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.docs;
                state.totalDocs = action.payload.totalDocs;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchSuperheros.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(createSuperhero.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            .addCase(deleteSuperhero.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item._id !== action.payload);
                state.totalDocs -= 1;
            })
            .addCase(updateSuperhero.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            });
    },
});

export default superheroSlice.reducer;
