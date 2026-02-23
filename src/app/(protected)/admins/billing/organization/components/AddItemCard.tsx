/* eslint-disable @typescript-eslint/no-explicit-any */
export default function AddItemCard({
  selectedCategory,
  newItem,
  setNewItem,
  createItem,
}: any) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">
        Add Item to {selectedCategory.name}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          placeholder="Code"
          value={newItem.code}
          onChange={e =>
            setNewItem((prev: any) => ({ ...prev, code: e.target.value }))
          }
          className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500"
        />
        <input
          placeholder="Name"
          value={newItem.name}
          onChange={e =>
            setNewItem((prev: any) => ({ ...prev, name: e.target.value }))
          }
          className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500"
        />
        <input
          placeholder="Description"
          value={newItem.description}
          onChange={e =>
            setNewItem((prev: any) => ({ ...prev, description: e.target.value }))
          }
          className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <button
        onClick={createItem}
        className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white! shadow-sm hover:bg-emerald-700 transition"
      >
        Create Item
      </button>
    </div>
  );
}