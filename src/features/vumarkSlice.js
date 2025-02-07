import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const generateVuMark = createAsyncThunk(
  "vumark/generate",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/image/${id}`);
      return response.data.base64;  
    } catch (error) {
      let message = "An unexpected error occurred.";

      if (error.response) {
        message = error.response.data?.message || "Server error occurred.";
      } else if (error.request) {
        message = "No response from the server. Please check your connection.";
      } else {
        message = error.message;
      }

      return rejectWithValue(message);
    }
  }
);

const vumarkSlice = createSlice({
  name: "vumark",
  initialState: {
    imageUrl: "",
    loading: false,
    error: null,
  },
  reducers: {
    clearImage: (state) => {
      state.imageUrl = "";
      state.error = null; 
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateVuMark.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateVuMark.fulfilled, (state, action) => {
        state.loading = false;
        state.imageUrl = action.payload;
      })
      .addCase(generateVuMark.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearImage, clearError } = vumarkSlice.actions;
export default vumarkSlice.reducer;
