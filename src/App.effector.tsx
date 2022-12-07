import { useUnit } from "effector-react";
import { useEffect } from "react";
import { postsFactory } from "./model.effector";

const vm1 = postsFactory("vm1");

export function App() {
  return (
    <div className="container mx-auto h-screen">
      <h1 className="text-xl py-4">Road to FSD</h1>
      <Posts model={vm1} />
    </div>
  );
}

function Posts({ model }: { model: ReturnType<typeof postsFactory> }) {
  const vm = useUnit(model);
  useEffect(() => vm.mounted(), []);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex gap-x-4 p-2 border rounded-lg items-center">
        <h2 className="text-lg">Create</h2>
        {vm.$formCreateOpen && (
          <>
            <input
              className="border p-2 rounded-lg grow"
              placeholder="title"
              value={vm.$formCreate?.title}
              onInput={(e) =>
                vm.formCreateChanged({ title: e.currentTarget.value })
              }
            />
            <button
              className="border rounded-lg bg-emerald-100 py-2 px-4 hover:bg-emerald-50"
              onClick={() => vm.formCreateSubmitted()}
            >
              submit
            </button>
            <button
              className="border rounded-lg bg-slate-100 py-2 px-4 hover:bg-slate-50"
              onClick={() => vm.formCreateDiscarded()}
            >
              cancel
            </button>
          </>
        )}
        {!vm.$formCreateOpen && (
          <button
            className="border rounded-lg bg-slate-100 py-2 px-4 hover:bg-slate-50"
            onClick={() => vm.formCreateOpened()}
          >
            new post
          </button>
        )}
      </div>

      <div className="flex gap-x-4">
        <input
          className="border p-2 rounded-lg grow"
          placeholder="filter"
          value={vm.$filter}
          onInput={(e) => vm.filterChanged(e.currentTarget.value)}
        />
        <button
          className="border rounded-lg bg-violet-100 py-2 px-4 hover:bg-violet-50"
          onClick={() => vm.sortChanged()}
        >
          sorted by title {vm.$sortAsc ? "asc" : "desc"}
        </button>
      </div>

      {vm.$posts.map((post) => (
        <div key={post.id} className="flex gap-x-4">
          {vm.$formUpdateOpen === post.id && (
            <>
              <input
                className="border p-2 rounded-lg grow"
                placeholder="title"
                value={vm.$formUpdate?.title}
                onInput={(e) =>
                  vm.formUpdateChanged({ title: e.currentTarget.value })
                }
              />
              <button
                className="border rounded-lg bg-emerald-100 py-2 px-4 hover:bg-emerald-50"
                onClick={() => vm.formUpdateSubmitted()}
              >
                submit
              </button>
              <button
                className="border rounded-lg bg-slate-100 py-2 px-4 hover:bg-slate-50"
                onClick={() => vm.formUpdateDiscarded()}
              >
                cancel
              </button>
            </>
          )}
          {vm.$formUpdateOpen !== post.id && (
            <>
              <input
                className="border p-2 rounded-lg grow border-transparent"
                defaultValue={post.title}
                readOnly
              />
              {vm.$formDelete?.id === post.id && (
                <>
                  <button
                    className="border rounded-lg bg-red-100 py-2 px-4 hover:bg-red-50"
                    onClick={() => vm.formDeleteSubmitted()}
                  >
                    confirm
                  </button>
                  <button
                    className="border rounded-lg bg-slate-100 py-2 px-4 hover:bg-slate-50"
                    onClick={() => vm.formDeleteDiscarded()}
                  >
                    cancel
                  </button>
                </>
              )}
              {vm.$formDelete?.id !== post.id && (
                <>
                  <button
                    className="border rounded-lg bg-emerald-100 py-2 px-4 hover:bg-emerald-50"
                    onClick={() => vm.formUpdateOpened(post.id)}
                  >
                    update
                  </button>
                  <button
                    className="border rounded-lg bg-amber-100 py-2 px-4 hover:bg-amber-50"
                    onClick={() => vm.formDeleteOpened(post.id)}
                  >
                    delete
                  </button>
                </>
              )}
            </>
          )}
        </div>
      ))}

      {vm.$emptyFilteredResults && (
        <button
          className="border rounded-lg bg-slate-100 py-2 px-4 hover:bg-slate-50"
          onClick={() => vm.postFromFilterRequested()}
        >
          create new post "{vm.$filter}"
        </button>
      )}
    </div>
  );
}
