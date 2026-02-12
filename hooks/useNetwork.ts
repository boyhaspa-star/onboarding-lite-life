/**
 * useNetwork Hook
 *
 * Tracks online/offline status and syncs it to app$ store.
 * Components can react to connectivity changes.
 *
 * Usage:
 *   const { isOnline } = useNetwork();
 */

import { useEffect } from 'react';
import { useSelector } from '@legendapp/state/react';
import NetInfo from '@react-native-community/netinfo';
import { app$ } from '@/store/app$';

export function useNetwork() {
  const isOnline = useSelector(() => app$.isOnline.get());

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      app$.isOnline.set(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  return { isOnline };
}
