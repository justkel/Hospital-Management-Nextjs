/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  newCategory: {
    code: string;
    name: string;
    description: string;
  };
  setNewCategory: React.Dispatch<React.SetStateAction<any>>;
  createCategory: () => void;
}

export default function CreateCategoryCard({
  newCategory,
  setNewCategory,
  createCategory,
}: Props) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">
        Create New Category
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          placeholder="Code"
          value={newCategory.code}
          onChange={e =>
            setNewCategory((prev: any) => ({ ...prev, code: e.target.value }))
          }
          className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500"
        />
        <input
          placeholder="Name"
          value={newCategory.name}
          onChange={e =>
            setNewCategory((prev: any) => ({ ...prev, name: e.target.value }))
          }
          className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500"
        />
        <input
          placeholder="Description"
          value={newCategory.description}
          onChange={e =>
            setNewCategory((prev: any) => ({ ...prev, description: e.target.value }))
          }
          className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <button
        onClick={createCategory}
        className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white! shadow-sm hover:bg-emerald-700 transition"
      >
        Create Category
      </button>
    </div>
  );
}