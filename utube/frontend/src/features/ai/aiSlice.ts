import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { generateTitleSuggestionsAPI } from "./aiAPI";

interface AIState {
  titleSuggestions: string[];
  loading: boolean;
  error: string | null;
}

const initialState: AIState = {
  titleSuggestions: [],
  loading: false,
  error: null,
};

// Generate title suggestions
export const generateTitleSuggestions = createAsyncThunk(
  "ai/generateTitles",
  async (description: string, thunkAPI) => {
    try {
      return await generateTitleSuggestionsAPI(description);
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to generate title suggestions");
    }
  }
);

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    clearSuggestions: (state) => {
      state.titleSuggestions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateTitleSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateTitleSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.titleSuggestions = action.payload || [];
      })
      .addCase(generateTitleSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSuggestions } = aiSlice.actions;
export default aiSlice.reducer;
