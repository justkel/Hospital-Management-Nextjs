/* eslint-disable @typescript-eslint/no-explicit-any */
export default function ItemsGrid({ selectedCategory }: any) {
  if (selectedCategory.items.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center text-gray-400">
        No items in this category yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {selectedCategory.items.map((item: any) => (
        <div
          key={item.id}
          className="group bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
        >
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-emerald-600 transition">
            {item.name}
          </h3>
          <p className="text-xs text-gray-400 mt-1 tracking-wide">
            CODE · {item.code}
          </p>
          {item.description && (
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}