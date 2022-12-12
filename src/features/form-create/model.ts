import { createEffect, createEvent, createStore, sample } from 'effector'

import { postModel } from '../../entities/post'

type Post = postModel.Post
type FormCreate = Omit<Post, 'id'>

export const createPostFx = createEffect<
  { allPosts: Post[]; newPost: FormCreate },
  Post[]
>(({ allPosts, newPost }) => {
  const id = Math.max(...allPosts.map((post) => post.id)) + 1
  return [...allPosts, { id, ...newPost }]
})

export const $formCreate = createStore<FormCreate>({ title: '' })
export const $formCreateOpen = createStore<boolean>(false)
export const formCreateOpened = createEvent()
export const formCreateDiscarded = createEvent()
export const formCreateSubmitted = createEvent()
export const formCreateChanged = createEvent<Partial<FormCreate>>()

sample({
  clock: formCreateChanged,
  source: $formCreate,
  fn: (formCreate, changed) => ({ ...formCreate, ...changed }),
  target: $formCreate,
})

sample({
  clock: formCreateSubmitted,
  source: { allPosts: postModel.$posts, newPost: $formCreate },
  filter: ({ newPost }) => newPost.title !== '',
  target: createPostFx,
})

sample({
  clock: createPostFx.doneData,
  target: postModel.$posts,
})

sample({
  clock: formCreateOpened,
  fn: () => true,
  target: $formCreateOpen,
})

sample({
  clock: [formCreateDiscarded, formCreateSubmitted],
  fn: () => false,
  target: [$formCreateOpen, $formCreate.reinit!],
})
