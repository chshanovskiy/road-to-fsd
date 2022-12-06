import { usePostsModel } from "./model";

export function App() {
  return (
    <div className="container mx-auto">
      <h1 className="text-xl py-4">Road to FSD</h1>
      <Posts />
    </div>
  );
}

function Posts() {
  const vm = usePostsModel();

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex gap-x-4 p-2 border rounded-lg items-center">
        <h2 className="text-lg">Create</h2>
        {vm.hasFormCreate() && (
          <>
            <input
              className="border p-2 rounded-lg grow"
              placeholder="title"
              value={vm.formCreate?.title}
              onInput={(e) => vm.handleFormCreateChange(e.currentTarget.value)}
            />
            <button
              className="border rounded-lg bg-emerald-100 py-2 px-4 hover:bg-emerald-50"
              onClick={() => vm.submitFormCreate()}
            >
              submit
            </button>
            <button
              className="border rounded-lg bg-slate-100 py-2 px-4 hover:bg-slate-50"
              onClick={() => vm.cancelFormCreate()}
            >
              cancel
            </button>
          </>
        )}
        {!vm.hasFormCreate() && (
          <button
            className="border rounded-lg bg-slate-100 py-2 px-4 hover:bg-slate-50"
            onClick={() => vm.openFormCreate()}
          >
            new post
          </button>
        )}
      </div>

      <div className="flex gap-x-4">
        <input
          className="border p-2 rounded-lg grow"
          placeholder="filter"
          value={vm.filter}
          onInput={(e) => vm.setFilter(e.currentTarget.value)}
        />
        <button
          className="border rounded-lg bg-violet-100 py-2 px-4 hover:bg-violet-50"
          onClick={() => vm.changeSortAsc()}
        >
          sorted by title {vm.sortAsc ? "asc" : "desc"}
        </button>
      </div>

      {vm.posts.map((post) => (
        <div key={post.id} className="flex gap-x-4">
          {vm.hasFormUpdate(post.id) && (
            <>
              <input
                className="border p-2 rounded-lg grow"
                placeholder="title"
                value={vm.formUpdate?.title}
                onInput={(e) =>
                  vm.handleFormUpdateChange(e.currentTarget.value)
                }
              />
              <button
                className="border rounded-lg bg-emerald-100 py-2 px-4 hover:bg-emerald-50"
                onClick={() => vm.submitFormUpdate()}
              >
                submit
              </button>
              <button
                className="border rounded-lg bg-slate-100 py-2 px-4 hover:bg-slate-50"
                onClick={() => vm.cancelFormUpdate()}
              >
                cancel
              </button>
            </>
          )}
          {!vm.hasFormUpdate(post.id) && (
            <>
              <input
                className="border p-2 rounded-lg grow border-transparent"
                defaultValue={post.title}
                readOnly
              />
              {vm.hasFormDelete(post.id) && (
                <>
                  <button
                    className="border rounded-lg bg-red-100 py-2 px-4 hover:bg-red-50"
                    onClick={() => vm.submitFormDelete()}
                  >
                    confirm
                  </button>
                  <button
                    className="border rounded-lg bg-slate-100 py-2 px-4 hover:bg-slate-50"
                    onClick={() => vm.cancelFormDelete()}
                  >
                    cancel
                  </button>
                </>
              )}
              {!vm.hasFormDelete(post.id) && (
                <>
                  <button
                    className="border rounded-lg bg-emerald-100 py-2 px-4 hover:bg-emerald-50"
                    onClick={() => vm.openFormUpdate(post.id)}
                  >
                    update
                  </button>
                  <button
                    className="border rounded-lg bg-amber-100 py-2 px-4 hover:bg-amber-50"
                    onClick={() => vm.openFormDelete(post.id)}
                  >
                    delete
                  </button>
                </>
              )}
            </>
          )}
        </div>
      ))}

      {vm.emptyFilteredResults && (
        <button
          className="border rounded-lg bg-slate-100 py-2 px-4 hover:bg-slate-50"
          onClick={() => vm.createPostFromFilter()}
        >
          create new post "{vm.filter}"
        </button>
      )}
    </div>
  );
}
