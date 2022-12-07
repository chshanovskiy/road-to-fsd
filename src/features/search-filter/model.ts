import { combine, createEvent, createStore, sample } from 'effector'

import { postModel } from '../../entities/post'

export const $filter = createStore<string>('')
export const filterChanged = createEvent<string>()

export const $sortAsc = createStore<boolean>(true)
export const sortChanged = createEvent()

export const $filteredPosts = combine(
  postModel.$posts,
  $filter,
  $sortAsc,
  (allPosts, filter, sortAsc) => {
    return allPosts
      .filter((post) => post.title.includes(filter))
      .sort((p1, p2) => p1.title.localeCompare(p2.title) * (sortAsc ? 1 : -1))
  }
)

sample({
  clock: filterChanged,
  target: $filter,
})

sample({
  clock: sortChanged,
  source: $sortAsc,
  fn: (asc) => !asc,
  target: $sortAsc,
})
