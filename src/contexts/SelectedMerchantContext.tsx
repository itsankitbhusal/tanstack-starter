import { createContext, useContext } from 'react';

export interface MerchantListItem {
  id: string;
  name: string;
}

export const ALL_MERCHANTS: MerchantListItem = {
  id: 'all',
  name: 'All Merchants',
};

interface SelectedMerchantContextValue {
  selectedMerchant: MerchantListItem | null;
  setSelectedMerchant: (merchant: MerchantListItem | null) => void;
}

const SelectedMerchantContext = createContext<SelectedMerchantContextValue | null>(null);

export function useSelectedMerchant() {
  const context = useContext(SelectedMerchantContext);
  if (!context) {
    throw new Error('useSelectedMerchant must be used within a SelectedMerchantProvider');
  }
  return context;
}

export function SelectedMerchantProvider({ children, value }: { children: React.ReactNode; value: SelectedMerchantContextValue }) {
  return (
    <SelectedMerchantContext.Provider value={value}>
      {children}
    </SelectedMerchantContext.Provider>
  );
}
