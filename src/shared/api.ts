export async function getPosts(): Promise<
  Array<{ id: number; title: string }>
> {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  return response.json()
}
