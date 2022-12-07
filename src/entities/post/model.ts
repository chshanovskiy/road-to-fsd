import { createEffect, createStore, sample } from 'effector'

import { getPosts } from '../../shared/api'

export interface Post {
  id: number
  title: string
}

export const $posts = createStore<Array<Post>>([])

export const getPostsFx = createEffect(getPosts)

sample({
  clock: getPostsFx.doneData,
  fn: (posts) => posts.slice(0, 10),
  target: $posts,
})
