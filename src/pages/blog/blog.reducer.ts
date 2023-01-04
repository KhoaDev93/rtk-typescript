import { createAction, createReducer } from '@reduxjs/toolkit'
import { Post } from 'types/blog.type'
import { initalPostList } from 'constants/blog'

interface BlogState {
  postList: Post[]
  editingPost: Post | null
}

const initialState: BlogState = {
  postList: initalPostList,
  editingPost: null
}

export const addPost = createAction<Post>('blog/addPost')
export const deletePost = createAction<string>('blog/deletePost')
export const startEditing = createAction<string>('blog/startEditing')
export const cancelEditing = createAction('blog/cancelEditing')
export const finishEditing = createAction<Post>('blog/finishEditing')

const blogReducer = createReducer(initialState, (builder) => {
  builder.addCase(addPost, (state, action) => {
    const post = action.payload
    state.postList.push(post)
  })

  builder.addCase(deletePost, (state, action) => {
    const postId = action.payload
    const index = state.postList.findIndex((post) => post.id === postId)
    if (index !== -1) {
      state.postList.splice(index, 1)
    }
  })

  builder.addCase(startEditing, (state, action) => {
    const postId = action.payload
    const post = state.postList.find((post) => post.id === postId) || null
    state.editingPost = post
  })

  builder.addCase(cancelEditing, (state) => {
    state.editingPost = null
  })

  builder.addCase(finishEditing, (state, action) => {
    const postId = action.payload.id
    state.postList.some((post, i) => {
      if (post.id === postId) {
        state.postList[i] = action.payload
        return true
      }
      return false
    })
  })
})

export default blogReducer
