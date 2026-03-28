import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
  fetchCommentsAPI,
  addCommentAPI,
} from "./commentAPI"

interface Comment {
  _id: string
  content: string
  userId: {
    name: string
  }
}

interface CommentState {
  comments: Comment[]
  loading: boolean
  warning: string | null
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  warning: null,
}

// 🔥 fetch comments
export const fetchComments = createAsyncThunk(
  "comment/fetch",
  async (videoId: string) => {
    return await fetchCommentsAPI(videoId)
  }
)

// 🔥 add comment
export const addComment = createAsyncThunk(
  "comment/add",
  async ({
    videoId,
    content,
  }: {
    videoId: string
    content: string
  }) => {
    return await addCommentAPI(videoId, content)
  }
)

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false
        state.comments = action.payload?.comments || []
        state.warning = action.payload?.warning || null
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const newComment = action.payload?.comment || action.payload

        if (newComment) {
          state.comments.unshift(newComment)
        }
      })
  },
})

export default commentSlice.reducer