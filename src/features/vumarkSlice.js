import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://192.168.68.108:5173/api/v1/vumark/generate";

export const generateVuMark = createAsyncThunk(
  "vumark/generate",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, data);
      return response.data;
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
