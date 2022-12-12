import { useUnit } from 'effector-react'
import { Fragment } from 'react'

import {
  $formCreate,
  $formCreateOpen,
  formCreateChanged,
  formCreateDiscarded,
  formCreateOpened,
  formCreateSubmitted,
} from './model'

export function FormCreate() {
  const vm = useUnit({ $formCreateOpen, $formCreate })

  return (
    <div className="flex items-center gap-x-4 rounded-lg border p-2">
      <h2 className="text-lg">{'Create'}</h2>
      {vm.$formCreateOpen && (
        <Fragment>
          <input
            autoFocus={true}
            className="grow rounded-lg border p-2"
            placeholder="title"
            value={vm.$formCreate.title}
            onInput={(e) => formCreateChanged({ title: e.currentTarget.value })}
          />
          <button
            className="rounded-lg border bg-emerald-100 py-2 px-4 hover:bg-emerald-50"
            onClick={() => formCreateSubmitted()}
          >
            {'submit'}
          </button>
          <button
            className="rounded-lg border bg-slate-100 py-2 px-4 hover:bg-slate-50"
            onClick={() => formCreateDiscarded()}
          >
            {'cancel'}
          </button>
        </Fragment>
      )}
      {!vm.$formCreateOpen && (
        <button
          className="rounded-lg border bg-slate-100 py-2 px-4 hover:bg-slate-50"
          onClick={() => formCreateOpened()}
        >
          {'new post'}
        </button>
      )}
    </div>
  )
}
