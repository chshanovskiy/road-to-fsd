import { createEvent, sample } from 'effector'

import { postModel } from '../../entities/post'
import { modelSearchFilter } from '../../features/search-filter'

export const mounted = createEvent()

export const $posts = modelSearchFilter.$filteredPosts

sample({
  clock: mounted,
  target: postModel.getPostsFx,
})
