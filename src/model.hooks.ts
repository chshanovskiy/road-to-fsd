import { useEffect, useMemo, useState } from "react";

interface Post {
  id: number;
  title: string;
}

export function usePostsModel() {
  const [allPosts, setAllPosts] = useState<Array<Post>>([]);

  const [filter, filterChanged] = useState<string>("");

  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const sortChanged = () => setSortAsc((asc) => !asc);

  const filteredPosts = useMemo(() => {
    allPosts.sort(
      (p1, p2) => p1.title.localeCompare(p2.title) * (sortAsc ? 1 : -1)
    );
    return allPosts.filter((post) => post.title.includes(filter));
  }, [allPosts, filter, sortAsc]);

  const emptyFilteredResults = useMemo(() => {
    return filteredPosts.length === 0 && filter.length !== 0;
  }, [filteredPosts, filter]);

  const [formCreate, setFormCreate] = useState<Omit<Post, "id">>();
  const [formUpdate, setFormUpdate] = useState<Post>();
  const [formDelete, setFormDelete] = useState<Pick<Post, "id">>();

  useEffect(() => {
    // Запрос данных при монтировании компонента
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.json())
      .then(setAllPosts);
  }, []);

  const apiCreatePost = (title: Post["title"]) => {
    // Псевдозапрос к апи на создание записи
    setAllPosts((state) => {
      const id = Math.max(...state.map((post) => post.id)) + 1;
      return state.concat({ id, title });
    });
  };

  const apiUpdatePost = (post: Post) => {
    // Псевдозапрос к апи на редактирование записи
    setAllPosts((state) => {
      return state.map((prev) => {
        return prev.id === post.id ? post : prev;
      });
    });
  };

  const apiDeletePost = (id: Post["id"]) => {
    // Псевдозапрос к апи на удаление записи
    setAllPosts((state) => state.filter((post) => post.id !== id));
  };

  const openFormCreate = () => {
    setFormCreate({ title: "" });
  };

  const handleFormCreateChange = (title: string) => {
    setFormCreate((prev) => (prev ? { ...prev, title } : undefined));
  };

  const cancelFormCreate = () => {
    setFormCreate(undefined);
  };

  const submitFormCreate = () => {
    if (formCreate) {
      apiCreatePost(formCreate.title);
    }
    setFormCreate(undefined);
  };

  const createPostFromFilter = () => {
    apiCreatePost(filter);
    filterChanged("");
  };

  const openFormUpdate = (id: Post["id"]) => {
    setFormUpdate(allPosts.find((post) => post.id === id));
  };

  const handleFormUpdateChange = (title: string) => {
    setFormUpdate((prev) => (prev ? { ...prev, title } : undefined));
  };

  const cancelFormUpdate = () => {
    setFormUpdate(undefined);
  };

  const submitFormUpdate = () => {
    if (formUpdate) {
      apiUpdatePost(formUpdate);
    }
    setFormUpdate(undefined);
  };

  const openFormDelete = (id: Post["id"]) => {
    setFormDelete({ id });
  };

  const cancelFormDelete = () => {
    setFormDelete(undefined);
  };

  const submitFormDelete = () => {
    if (formDelete) {
      apiDeletePost(formDelete.id);
    }
    setFormDelete(undefined);
  };

  const hasFormCreate = () => !!formCreate;
  const hasFormUpdate = (id: Post["id"]) => formUpdate?.id === id;
  const hasFormDelete = (id: Post["id"]) => formDelete?.id === id;

  return {
    /** Список записей для отображения */
    posts: filteredPosts,

    /** Значение фильтра */
    filter,
    /** Установка значения фильтра */
    filterChanged,
    /** Флаг отсутсвия результатов фильтрации */
    emptyFilteredResults,

    /** Значение сортировки */
    sortAsc,
    /** Установка значения сортировки */
    sortChanged,

    /** Форма создания записи */
    formCreate,
    /** Форма редактирования записи */
    formUpdate,
    /** Форма удаления записи */
    formDelete,

    /** Флаг наличия формы создания записи */
    hasFormCreate,
    /** Открытие формы */
    openFormCreate,
    /** Обработчик изменения значений формы */
    handleFormCreateChange,
    /** Обработчик отправки формы */
    submitFormCreate,
    /** Специальный обработчик создания записи из значения фильтра */
    createPostFromFilter,
    /** Отмена и закрытие формы */
    cancelFormCreate,

    /** Флаг наличия формы редактирования записи */
    hasFormUpdate,
    /** Открытие формы */
    openFormUpdate,
    /** Обработчик изменения значений формы */
    handleFormUpdateChange,
    /** Обработчик отправки формы */
    submitFormUpdate,
    /** Отмена и закрытие формы */
    cancelFormUpdate,

    /** Флаг наличия формы удаления записи */
    hasFormDelete,
    /** Открытие формы */
    openFormDelete,
    /** Обработчик отправки формы */
    submitFormDelete,
    /** Отмена и закрытие формы */
    cancelFormDelete,
  };
}
