import { combine, createEvent, sample } from 'effector'

import { postModel } from '../../entities/post'
import { modelSearchFilter } from '../../features/search-filter'

export const mounted = createEvent()

export const $posts = combine(
  postModel.$posts,
  modelSearchFilter.$filter,
  modelSearchFilter.$sortAsc,
  (allPosts, filter, sortAsc) => {
    return allPosts
      .filter((post) => post.title.includes(filter))
      .sort((p1, p2) => p1.title.localeCompare(p2.title) * (sortAsc ? 1 : -1))
  }
)

sample({
  clock: mounted,
  target: postModel.getPostsFx,
})
