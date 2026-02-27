import { useCallback } from 'react';
import { Linking, Alert } from 'react-native';
import { useCartStore } from '../store/cartStore';

const STORE_URLS: Record<string, string> = {
  gamma: 'https://www.gamma.nl',
  praxis: 'https://www.praxis.nl',
  ikea: 'https://www.ikea.com/nl/nl/',
  karwei: 'https://www.karwei.nl',
  kwantum: 'https://www.kwantum.nl',
};

export const useShoppingCart = () => {
  const cart = useCartStore();

  const openStore = useCallback(async (store: string) => {
    const url = STORE_URLS[store.toLowerCase()];
    if (!url) {
      Alert.alert('Fout', `Onbekende winkel: ${store}`);
      return;
    }

    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Fout', 'Kan de winkel-app niet openen');
    }
  }, []);

  const openProductUrl = useCallback(async (url: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      }
    } catch {
      Alert.alert('Fout', 'Kan de link niet openen');
    }
  }, []);

  const getItemsByStore = useCallback(() => {
    const grouped: Record<string, typeof cart.items> = {};
    cart.items.forEach((item) => {
      const store = item.store || 'overig';
      if (!grouped[store]) grouped[store] = [];
      grouped[store].push(item);
    });
    return grouped;
  }, [cart.items]);

  const getStoreTotal = useCallback(
    (store: string) => {
      return cart.items
        .filter((item) => (item.store || 'overig') === store)
        .reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    [cart.items],
  );

  return {
    ...cart,
    openStore,
    openProductUrl,
    getItemsByStore,
    getStoreTotal,
  };
};
