import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, useAppDispatch } from 'store'
import PostItem from '../PostItem/PostItem'
// import { deletePost, startEditing, cancelEditing } from 'pages/blog/blog.reducer'
import { getPostList, startEditing, cancelEditing } from 'pages/blog/blog.slice'
import { blogApi } from 'api'
import Skeleton from '../Skeleton'

const PostList = () => {
  const dispatch = useAppDispatch()
  const { postList, loading } = useSelector((state: RootState) => state.blog)
  const handleDelete = async (postId: string) => {
    try {
      await blogApi.deletePost(postId)
    } catch (error) {
      console.log('error', error)
    } finally {
      dispatch(getPostList())
    }
  }
  const handleStartEditing = (postId: string) => dispatch(startEditing(postId))
  const handleCancelEditing = () => dispatch(cancelEditing)

  useEffect(() => {
    dispatch(getPostList())
    // const promise = dispatch(getPostList())
    // console.log('promise :>> ', promise.abort);
    return () => {
      // promise.abort()
    }
  }, [])

  return (
    <div>
      <div className='bg-white py-6 sm:py-8 lg:py-12'>
        <div className='mx-auto max-w-screen-xl px-4 md:px-8'>
          <div className='mb-10 md:mb-16'>
            <h2 className='mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl'>RTK Blog</h2>
            <p className='mx-auto max-w-screen-md text-center text-gray-500 md:text-lg'>
              Đừng bao giờ từ bỏ. Hôm nay khó khăn, ngày mai sẽ trở nên tồi tệ. Nhưng ngày mốt sẽ có nắng
            </p>
          </div>

          <div className='grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-2 xl:gap-8'>
            {loading ? (
              <Fragment>
                <Skeleton />
                <Skeleton />
              </Fragment>
            ) : (
              <>
                {postList.map((post) => (
                  <PostItem
                    post={post}
                    key={post.id}
                    handleDelete={handleDelete}
                    handleStartEditing={handleStartEditing}
                    handleCancelEditing={handleCancelEditing}
                  />
                ))}
              </>
            )}
            {/* <Fragment>
              <Skeleton />
              <Skeleton />
            </Fragment>
            {postList.map((post) => (
              <PostItem
                post={post}
                key={post.id}
                handleDelete={handleDelete}
                handleStartEditing={handleStartEditing}
                handleCancelEditing={handleCancelEditing}
              />
            ))} */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostList
