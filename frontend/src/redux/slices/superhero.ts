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
    selectedHero: ISuperhero | null;
    totalDocs: number;
    totalPages: number;
    currentPage: number;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: SuperheroState = {
    items: [],
    selectedHero: null,
    totalDocs: 0,
    totalPages: 0,
    currentPage: 1,
    status: 'idle',
    error: null,
}

export const fetchSuperheroes = createAsyncThunk("superheroes/fetchSuperheroes", async (page: number = 1, {rejectWithValue}) => {
    try {
        const res = await api.get(`/superheroes/all?page=${page}&limit=5`);
        return res.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data);
    }
});

export const fetchSingleSuperhero = createAsyncThunk("superheroes/fetchSingleSuperhero", async (id: string, {rejectWithValue}) => {
    try {
        const res = await api.get(`/superheroes/${id}`);
        return res.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data);
    }
});

export const createSuperhero = createAsyncThunk("superheroes/createSuperhero", async (newHero: FormData, {
    rejectWithValue,
    dispatch
}) => {
    try {
        const res = await api.post(`/superheroes/`, newHero, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        dispatch(fetchSuperheroes(1));
        return res.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data);
    }
});

export const deleteSuperhero = createAsyncThunk(
    "superheroes/deleteSuperhero",
    async (id: string, {rejectWithValue}) => {
        try {
            await api.delete(`/superheroes/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const deleteSingleImage = createAsyncThunk("superheroes/deleteSingleImage",
    async ({id, image}: { id: string; image: string }, {rejectWithValue}) => {
        try {
             const res = await api.delete(`/superheroes/${id}/image`, {
                 params:{
                     image: image
                 }
             });
            return { id, images: res.data.images };
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    }
);


export const updateSuperhero = createAsyncThunk(
    "superheroes/updateSuperhero",
    async ({id, data}: { id: string; data: FormData }, {rejectWithValue, dispatch}) => {
        try {
            const res = await api.put(`/superheroes/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            dispatch(fetchSuperheroes(1));
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
            .addCase(fetchSuperheroes.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchSuperheroes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.superheroes;
                state.totalDocs = action.payload.total;
                state.totalPages = action.payload.pages;
                state.currentPage = action.payload.page;
            })
            .addCase(fetchSingleSuperhero.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchSingleSuperhero.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.selectedHero = action.payload;
            })
            .addCase(fetchSingleSuperhero.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchSuperheroes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(createSuperhero.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            .addCase(deleteSuperhero.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item._id !== action.payload);
                state.totalDocs -= 1;
                if (state.selectedHero?._id === action.payload) {
                    state.selectedHero = null;
                }
            })
            .addCase(deleteSingleImage.fulfilled, (state, action) => {
                const { id, images } = action.payload;
                const hero = state.items.find(item => item._id === id);
                if(hero)  hero.images = images;
            })
            .addCase(updateSuperhero.fulfilled, (state, action) => {
                state.selectedHero = action.payload;
                const index = state.items.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            });
    },
});

export default superheroSlice.reducer;
