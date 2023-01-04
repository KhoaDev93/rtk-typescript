import { createAsyncThunk, createSlice, PayloadAction, AsyncThunk } from '@reduxjs/toolkit'
import { blogApi } from 'api'
import { Post } from 'types/blog.type'

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>

type PendingAction = ReturnType<GenericAsyncThunk['pending']>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>

interface BlogState {
  postList: Post[]
  editingPost: Post | null
  loading: boolean
  currentRequestId: string | undefined
}

const initialState: BlogState = {
  postList: [],
  editingPost: null,
  loading: false,
  currentRequestId: undefined
}

export const getPostList = createAsyncThunk('blog/getPostList', async () => {
  const response = await blogApi.getPostList()
  return response.data
})

const blockSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    // deletePost: (state, action: PayloadAction<string>) => {
    //   const postId = action.payload
    //   const index = state.postList.findIndex((post) => post.id === postId)
    //   if (index !== -1) {
    //     state.postList.splice(index, 1)
    //   }
    // },
    startEditing: (state, action: PayloadAction<string>) => {
      const postId = action.payload
      const post = state.postList.find((post) => post.id === postId) || null
      state.editingPost = post
    },
    cancelEditing: (state) => {
      state.editingPost = null
    },
    finishEditing: (state, action: PayloadAction<Post>) => {
      const postId = action.payload.id
      state.postList.some((post, i) => {
        if (post.id === postId) {
          state.postList[i] = action.payload
          return true
        }
        return false
      })
    }
  },
  extraReducers(builder) {
    builder.addCase(getPostList.fulfilled, (state, { payload }) => {
      state.postList = payload
    })
    builder.addMatcher<PendingAction>(
      (action) => action.type.endsWith('/pending'),
      (state, action) => {
        state.loading = true
        state.currentRequestId = action.meta.requestId
      }
    )
    builder.addMatcher<RejectedAction | FulfilledAction>(
      (action) => action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected'),
      (state, action) => {
        if (state.loading && state.currentRequestId === action.meta.requestId) {
          state.loading = false
          state.currentRequestId = undefined
        }
      }
    )
  }
})

export const { cancelEditing, finishEditing, startEditing } = blockSlice.actions
const blogReducer = blockSlice.reducer

export default blogReducer
