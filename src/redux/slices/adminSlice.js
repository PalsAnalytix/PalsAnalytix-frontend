import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchQuestions = createAsyncThunk(
    'admin/fetchQuestions',
    async ()=> {
        const response = await axios.get(`${BASE_URL}/questions`);
        if(response.data){
            
        }
        return response.data;
    }
);

export const adminSlice = createSlice({
    name : "admin",
    initialState : {
        
    },
    reducers : {

    }
})