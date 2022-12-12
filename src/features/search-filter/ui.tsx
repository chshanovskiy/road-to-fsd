import { useUnit } from 'effector-react'

import { $filter, $sortAsc, filterChanged, sortChanged } from './model'

export function SearchFilter() {
  const vm = useUnit({ $filter, $sortAsc })

  return (
    <div className="flex gap-x-4">
      <input
        className="grow rounded-lg border p-2"
        placeholder="filter"
        value={vm.$filter}
        onInput={(e) => filterChanged(e.currentTarget.value)}
      />
      <button
        className="rounded-lg border bg-violet-100 py-2 px-4 hover:bg-violet-50"
        onClick={() => sortChanged()}
      >
        {'sorted by title '}
        {vm.$sortAsc ? 'asc' : 'desc'}
      </button>
    </div>
  )
}
