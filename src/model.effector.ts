import { combine, createDomain, sample, Store } from "effector";
import { debug } from "patronum";

interface Post {
  id: number;
  title: string;
}

export function postsFactory(domainName: string) {
  const domain = createDomain(domainName);
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
      return allPosts
        .filter((post) => post.title.includes(filter))
        .sort(
          (p1, p2) => p1.title.localeCompare(p2.title) * (sortAsc ? 1 : -1)
        );
    }
  );

  const $emptyFilteredResults = combine(
    $filteredPosts,
    $filter,
    (filteredPosts, filter) => {
      return filteredPosts.length === 0 && filter.length !== 0;
    }
  );

  const postFromFilterRequested = domain.createEvent();

  const getPostsFx = domain.createEffect(async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    return response.json();
  });

  type FormCreate = Omit<Post, "id">;
  const createPostFx = domain.createEffect<
    { allPosts: Post[]; newPost: FormCreate },
    Post[]
  >(({ allPosts, newPost }) => {
    const id = Math.max(...allPosts.map((post) => post.id)) + 1;
    return allPosts.concat({ id, ...newPost });
  });

  type FormUpdate = Post;
  const updatePostFx = domain.createEffect<
    { allPosts: Post[]; updPost: FormUpdate },
    Post[]
  >(({ allPosts, updPost }) => {
    return allPosts.map((oldPost) => {
      return oldPost.id === updPost.id ? updPost : oldPost;
    });
  });

  type FormDelete = Pick<Post, "id">;
  const deletePostFx = domain.createEffect<
    { allPosts: Post[]; delPost: FormDelete },
    Post[]
  >(({ allPosts, delPost }) => {
    return allPosts.filter((oldPost) => {
      return oldPost.id !== delPost.id;
    });
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
    clock: postFromFilterRequested,
    source: {
      allPosts: $allPosts,
      newPost: $filter.map<FormCreate>((filter) => ({ title: filter })),
    },
    target: createPostFx,
  });

  sample({
    clock: postFromFilterRequested,
    target: $filter.reinit!,
  });

  // Сомнительная затея с null, из за неё кастовать потом
  const $formCreate = domain.createStore<FormCreate | null>(null);
  const $formCreateOpen = domain.createStore<boolean>(false);
  const formCreateOpened = domain.createEvent();
  const formCreateDiscarded = domain.createEvent();
  const formCreateSubmitted = domain.createEvent();
  const formCreateChanged = domain.createEvent<Partial<FormCreate>>();

  sample({
    clock: formCreateChanged,
    source: $formCreate,
    // Наивная реализация редактирования плоского списка скалярных полей
    fn: (formCreate, changed) => ({ ...formCreate, ...changed } as FormCreate),
    filter: (formCreate) => formCreate !== null,
    target: $formCreate,
  });

  sample({
    clock: formCreateSubmitted,
    source: { allPosts: $allPosts, newPost: $formCreate as Store<FormCreate> },
    filter: (formCreate) => formCreate !== null,
    target: createPostFx,
  });

  sample({
    clock: formCreateOpened,
    // Полагаю, на такие случаи есть утилиты или шорткаты?
    fn: () => true,
    target: $formCreateOpen,
  });

  sample({
    clock: [formCreateDiscarded, formCreateSubmitted],
    fn: () => false,
    target: [$formCreateOpen, $formCreate.reinit!],
  });

  sample({
    clock: createPostFx.doneData,
    target: $allPosts,
  });

  const $formUpdate = domain.createStore<FormUpdate | null>(null);
  const $formUpdateOpen = domain.createStore<number | false>(false);
  const formUpdateOpened = domain.createEvent<FormUpdate["id"]>();
  const formUpdateDiscarded = domain.createEvent();
  const formUpdateSubmitted = domain.createEvent();
  const formUpdateChanged =
    domain.createEvent<Partial<Omit<FormUpdate, "id">>>();

  sample({
    clock: formUpdateChanged,
    source: $formUpdate,
    fn: (formUpdate, changed) => ({ ...formUpdate, ...changed } as FormUpdate),
    filter: (formUpdate) => formUpdate !== null,
    target: $formUpdate,
  });

  sample({
    clock: formUpdateSubmitted,
    source: { allPosts: $allPosts, updPost: $formUpdate as Store<FormUpdate> },
    filter: (formUpdate) => formUpdate !== null,
    target: updatePostFx,
  });

  sample({
    clock: formUpdateOpened,
    target: $formUpdateOpen,
  });

  sample({
    clock: formUpdateOpened,
    source: $allPosts,
    fn: (allPosts, opened) =>
      allPosts.find((post) => post.id === opened) as Post,
    target: $formUpdate,
  });

  sample({
    clock: [formUpdateDiscarded, formUpdateSubmitted],
    fn: () => false as const,
    target: [$formUpdateOpen, $formUpdate.reinit!],
  });

  sample({
    clock: updatePostFx.doneData,
    target: $allPosts,
  });

  const $formDelete = domain.createStore<FormDelete | null>(null);
  const $formDeleteOpen = domain.createStore<number | false>(false);
  const formDeleteOpened = domain.createEvent<FormDelete["id"]>();
  const formDeleteDiscarded = domain.createEvent();
  const formDeleteSubmitted = domain.createEvent();
  const formDeleteChanged = domain.createEvent<FormDelete>();

  sample({
    clock: formDeleteChanged,
    target: $formDelete,
  });

  sample({
    clock: formDeleteSubmitted,
    source: { allPosts: $allPosts, delPost: $formDelete as Store<FormDelete> },
    filter: (formDelete) => formDelete !== null,
    target: deletePostFx,
  });

  sample({
    clock: formDeleteOpened,
    target: $formDeleteOpen,
  });

  sample({
    clock: formDeleteOpened,
    source: $allPosts,
    fn: (allPosts, opened) =>
      allPosts.find((post) => post.id === opened) as Post,
    target: $formDelete,
  });

  sample({
    clock: [formDeleteDiscarded, formDeleteSubmitted],
    fn: () => false as const,
    target: [$formDeleteOpen, $formDelete.reinit!],
  });

  sample({
    clock: deletePostFx.doneData,
    target: $allPosts,
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
    postFromFilterRequested,

    mounted,

    $formCreate,
    $formCreateOpen,
    formCreateOpened,
    formCreateDiscarded,
    formCreateSubmitted,
    formCreateChanged,

    $formUpdate,
    $formUpdateOpen,
    formUpdateOpened,
    formUpdateDiscarded,
    formUpdateSubmitted,
    formUpdateChanged,

    $formDelete,
    $formDeleteOpen,
    formDeleteOpened,
    formDeleteDiscarded,
    formDeleteSubmitted,
    formDeleteChanged,
  };
}
