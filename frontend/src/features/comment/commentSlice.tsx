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
}

const initialState: CommentState = {
  comments: [],
  loading: false,
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

      // fetch
      .addCase(fetchComments.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false
        state.comments = action.payload.comments
      })

      // add
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload)
      })
  },
})

export default commentSlice.reducer