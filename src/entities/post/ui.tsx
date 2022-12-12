import { Post } from './model'

export function Posts({ posts }: { posts: Post[] }) {
  return (
    <div className="flex flex-col rounded-lg border">
      {posts.map((post) => (
        <div key={post.id} className="flex gap-x-4">
          <PostRow title={post.title} />
        </div>
      ))}
    </div>
  )
}

export function PostRow({ title }: { title: string }) {
  return (
    <input
      className="grow rounded-lg border border-transparent p-2"
      defaultValue={title}
      readOnly={true}
    />
  )
}
