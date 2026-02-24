import {
  OrganizationChargeCatalogsQuery,
} from '@/shared/graphql/generated/graphql';

type PaginationResult =
  OrganizationChargeCatalogsQuery['organizationChargeCatalogs'];

interface Props {
  data: PaginationResult;
}

export default function ChargeCatalogList({ data }: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          Existing Charges
        </h2>

        <span className="text-sm text-gray-500">
          {data.items.length} item{data.items.length !== 1 && 's'}
        </span>
      </div>

      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-100">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Category</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {data.items.map(charge => (
              <tr
                key={charge.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-4 font-semibold text-gray-900">
                  {charge.code}
                </td>

                <td className="px-4 py-4 text-gray-700">
                  {charge.name}
                </td>

                <td className="px-4 py-4 font-medium">
                  ₦{Number(charge.unitPrice).toLocaleString()}
                </td>

                <td className="px-4 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100">
                    {charge.billingType}
                  </span>
                </td>

                <td className="px-4 py-4 text-gray-600">
                  {charge.category?.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        {data.items.map(charge => (
          <div
            key={charge.id}
            className="border border-gray-100 rounded-2xl p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Code
                </p>
                <p className="font-semibold text-gray-900">
                  {charge.code}
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100">
                {charge.billingType}
              </span>
            </div>

            <div className="mb-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Name
              </p>
              <p className="text-gray-800 font-medium">
                {charge.name}
              </p>
            </div>

            <div className="flex justify-between text-sm">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Price
                </p>
                <p className="font-semibold">
                  ₦{Number(charge.unitPrice).toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Category
                </p>
                <p className="text-gray-700">
                  {charge.category?.name}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}