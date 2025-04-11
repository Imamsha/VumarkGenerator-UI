import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const generateVuMark = createAsyncThunk(
  "vumark/generate",
  async (data) => {
    const response = await axios.post(
      "https://api-vumark.visualsmartdc.com/api/v1/vumark/generate",
      data
    );
    return response.data;
  }
);

const vumarkSlice = createSlice({
  name: "vumark",
  initialState: {
    vumarkId: null,
    metadata: null,
    loading: false,
    error: null,
    data: null,
  },
  reducers: {
    resetVuMark: (state) => {
      state.data = null;
      state.vumarkId = null;
      state.metadata = null;
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
        state.vumarkId = action.payload.vumarkId;
        state.metadata = action.payload.metadata;
        state.data = action.payload;
      })
      .addCase(generateVuMark.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetVuMark } = vumarkSlice.actions;
export default vumarkSlice.reducer;
