import { LabPriority } from '@/shared/graphql/generated/graphql';

import { ChargeCatalogOption } from '@/hooks/billing/useBilling';

export interface LabRequestSelectorProps {
  catalogs: ChargeCatalogOption[];
  visitId: string;
}

export interface CatalogDropdownProps {
  catalogs: ChargeCatalogOption[];
  selectedCatalogIds: string[];
  openDropdown: boolean;
  setOpenDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  toggleCatalog: (id: string) => void;
  formatPrice: (amount: number, currency?: string) => string;
}

export interface SelectedCatalogSummaryProps {
  selectedCatalogs: ChargeCatalogOption[];
  selectedCatalogIds: string[];
  removeCatalog: (id: string) => void;
  formatPrice: (amount: number, currency?: string) => string;
}

export interface PrioritySelectorProps {
  priority: LabPriority;
  setPriority: React.Dispatch<React.SetStateAction<LabPriority>>;
}