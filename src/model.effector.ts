import { combine, createDomain, sample } from "effector";
import { useUnit } from "effector-react";
import { debug } from "patronum";
import { useMemo } from "react";

interface Post {
  id: number;
  title: string;
}

function postsFactory() {
  const domain = createDomain("posts");
  debug(domain);

  const $allPosts = domain.createStore<Array<Post>>([]);

  const $filter = domain.createStore<string>("");
  const filterChanged = domain.createEvent<string>();

  const $sortAsc = domain.createStore<boolean>(true);
  const sortChanged = domain.createEvent();

  const $filteredPosts = combine(
    $allPosts,
    $filter,
    $sortAsc,
    (allPosts, filter, sortAsc) => {
      allPosts.sort(
        (p1, p2) => p1.title.localeCompare(p2.title) * (sortAsc ? 1 : -1)
      );
      return allPosts.filter((post) => post.title.includes(filter));
    }
  );

  const $emptyFilteredResults = combine(
    $filteredPosts,
    $filter,
    (filteredPosts, filter) => {
      return filteredPosts.length === 0 && filter.length !== 0;
    }
  );

  const createPostFromFilter = domain.createEvent();

  const getPostsFx = domain.createEffect(async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    return response.json();
  });

  const mounted = domain.createEvent();

  sample({
    clock: mounted,
    target: getPostsFx,
  });

  sample({
    clock: getPostsFx.doneData,
    target: $allPosts,
  });

  sample({
    clock: filterChanged,
    target: $filter,
  });

  sample({
    clock: sortChanged,
    source: $sortAsc,
    fn: (asc) => !asc,
    target: $sortAsc,
  });

  sample({
    clock: createPostFromFilter,
    source: { allPosts: $allPosts, title: $filter },
    fn: ({ allPosts, title }) => {
      const id = Math.max(...allPosts.map((post) => post.id)) + 1;
      return allPosts.concat({ id, title });
    },
    target: $allPosts,
  });

  sample({
    clock: createPostFromFilter,
    fn: () => "",
    target: $filter,
  });

  return {
    /** Список записей для отображения */
    $posts: $filteredPosts,

    /** Значение фильтра */
    $filter,
    /** Установка значения фильтра */
    filterChanged,
    /** Флаг отсутсвия результатов фильтрации */
    $emptyFilteredResults,

    /** Значение сортировки */
    $sortAsc,
    /** Установка значения сортировки */
    sortChanged,

    /** Специальный обработчик создания записи из значения фильтра */
    createPostFromFilter,

    mounted,
  };
}

export function usePostsModel() {
  const model = useMemo(postsFactory, []);
  return useUnit(model);
}
