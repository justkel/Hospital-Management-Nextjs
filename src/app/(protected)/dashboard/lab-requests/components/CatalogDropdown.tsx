'use client';

import { useMemo, useRef, useEffect } from 'react';
import {
  DownOutlined,
  CheckOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { CatalogDropdownProps } from './types';

export default function CatalogDropdown({
  catalogs,
  selectedCatalogIds,
  openDropdown,
  setOpenDropdown,
  searchTerm,
  setSearchTerm,
  toggleCatalog,
  formatPrice,
}: CatalogDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredCatalogs = useMemo(() => {
    return catalogs?.filter(cat =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [catalogs, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, [setOpenDropdown, setSearchTerm]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpenDropdown(prev => !prev)}
        className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm flex items-center justify-between hover:border-green-500 focus:ring-2 focus:ring-green-600 transition cursor-pointer"
      >
        <span className="text-sm text-gray-700">
          {selectedCatalogIds.length > 0
            ? `${selectedCatalogIds.length} lab request(s) selected`
            : 'Select Lab Request Type(s)'}
        </span>

        <DownOutlined
          className={`text-gray-400 transition-transform ${
            openDropdown ? 'rotate-180' : ''
          }`}
        />
      </button>

      {openDropdown && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-3 border-b border-gray-100 relative">
            <SearchOutlined className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              autoFocus
              type="text"
              placeholder="Search lab request..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm"
            />
          </div>

          <div className="max-h-72 overflow-y-auto">
            {filteredCatalogs?.length > 0 ? (
              filteredCatalogs.map(cat => {
                const selected = selectedCatalogIds.includes(cat.id);

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCatalog(cat.id)}
                    className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-green-50 transition border-b last:border-b-0 border-gray-100"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {cat.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatPrice(cat.unitPrice, cat.currency)}
                      </p>
                    </div>

                    {selected && (
                      <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                        <CheckOutlined className="text-white text-xs" />
                      </div>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="py-10 text-center text-sm text-gray-400">
                No matching lab request found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}