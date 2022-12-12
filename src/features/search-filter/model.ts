import { createEvent, createStore, sample } from 'effector'

export const $filter = createStore<string>('')
export const filterChanged = createEvent<string>()

export const $sortAsc = createStore<boolean>(true)
export const sortChanged = createEvent()

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
