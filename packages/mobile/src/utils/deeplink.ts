/**
 * Deep linking utilities for Dutch home improvement stores
 */
import { Linking, Alert } from 'react-native';

type StoreName = 'gamma' | 'praxis' | 'ikea' | 'karwei' | 'kwantum' | 'bol';

interface StoreConfig {
  name: string;
  baseUrl: string;
  searchUrl: string;
  icon: string;
}

const STORES: Record<StoreName, StoreConfig> = {
  gamma: {
    name: 'Gamma',
    baseUrl: 'https://www.gamma.nl',
    searchUrl: 'https://www.gamma.nl/assortiment/zoeken?text=',
    icon: '🟡',
  },
  praxis: {
    name: 'Praxis',
    baseUrl: 'https://www.praxis.nl',
    searchUrl: 'https://www.praxis.nl/zoeken?query=',
    icon: '🟢',
  },
  ikea: {
    name: 'IKEA',
    baseUrl: 'https://www.ikea.com/nl/nl/',
    searchUrl: 'https://www.ikea.com/nl/nl/search/?q=',
    icon: '🔵',
  },
  karwei: {
    name: 'Karwei',
    baseUrl: 'https://www.karwei.nl',
    searchUrl: 'https://www.karwei.nl/zoeken?q=',
    icon: '🔴',
  },
  kwantum: {
    name: 'Kwantum',
    baseUrl: 'https://www.kwantum.nl',
    searchUrl: 'https://www.kwantum.nl/catalogsearch/result/?q=',
    icon: '🟠',
  },
  bol: {
    name: 'Bol.com',
    baseUrl: 'https://www.bol.com',
    searchUrl: 'https://www.bol.com/nl/nl/s/?searchtext=',
    icon: '🔷',
  },
};

/**
 * Open a product URL in the browser
 */
export const openProductUrl = async (url: string): Promise<void> => {
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Fout', 'Kan de link niet openen');
    }
  } catch {
    Alert.alert('Fout', 'Er ging iets mis bij het openen van de link');
  }
};

/**
 * Open a store's homepage
 */
export const openStore = async (store: StoreName): Promise<void> => {
  const config = STORES[store];
  if (!config) {
    Alert.alert('Fout', 'Onbekende winkel');
    return;
  }
  await openProductUrl(config.baseUrl);
};

/**
 * Search for a product in a specific store
 */
export const searchInStore = async (
  store: StoreName,
  query: string,
): Promise<void> => {
  const config = STORES[store];
  if (!config) {
    Alert.alert('Fout', 'Onbekende winkel');
    return;
  }
  const url = `${config.searchUrl}${encodeURIComponent(query)}`;
  await openProductUrl(url);
};

/**
 * Get store configuration
 */
export const getStoreConfig = (store: StoreName): StoreConfig | undefined => {
  return STORES[store];
};

/**
 * Get all available stores
 */
export const getAllStores = (): { key: StoreName; config: StoreConfig }[] => {
  return (Object.entries(STORES) as [StoreName, StoreConfig][]).map(
    ([key, config]) => ({ key, config }),
  );
};
