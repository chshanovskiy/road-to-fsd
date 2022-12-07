import { useUnit } from 'effector-react'
import { useEffect } from 'react'

import { Posts } from '../../entities/post'
import { FormCreate } from '../../features/form-create'
import { SearchFilter } from '../../features/search-filter'

import { $posts, mounted } from './model'

export function Home() {
  const posts = useUnit($posts)
  useEffect(mounted, [])

  return (
    <section className="flex flex-col gap-y-2">
      <FormCreate />
      <SearchFilter />
      <Posts posts={posts} />
    </section>
  )
}
