import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCommentsAPI,
  addCommentAPI,
  updateCommentAPI,
  deleteCommentAPI,
} from "./commentAPI";
import type { Comment } from "../../types";

interface CommentState {
  comments: Comment[];
  loading: boolean;
  warning: string | null;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  warning: null,
  error: null,
};

// Fetch comments
export const fetchComments = createAsyncThunk(
  "comment/fetch",
  async (videoId: string, thunkAPI) => {
    try {
      return await fetchCommentsAPI(videoId);
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch comments");
    }
  }
);

// Add comment
export const addComment = createAsyncThunk(
  "comment/add",
  async (
    { videoId, content }: { videoId: string; content: string },
    thunkAPI
  ) => {
    try {
      return await addCommentAPI(videoId, content);
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to add comment");
    }
  }
);

// Update comment
export const updateComment = createAsyncThunk(
  "comment/update",
  async (
    { commentId, content }: { commentId: string; content: string },
    thunkAPI
  ) => {
    try {
      return await updateCommentAPI(commentId, content);
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to update comment");
    }
  }
);

// Delete comment
export const deleteComment = createAsyncThunk(
  "comment/delete",
  async (commentId: string, thunkAPI) => {
    try {
      await deleteCommentAPI(commentId);
      return commentId;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to delete comment");
    }
  }
);

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch comments
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload?.comments || [];
        state.warning = action.payload?.warning || null;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to load comments";
      })

      // Add comment
      .addCase(addComment.fulfilled, (state, action) => {
        const newComment = action.payload?.comment || action.payload;

        if (newComment) {
          state.comments.unshift(newComment);
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to add comment";
      })

      // Update comment
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })

      // Delete comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((c) => c._id !== action.payload);
      });
  },
});

export default commentSlice.reducer;