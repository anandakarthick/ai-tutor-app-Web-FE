/**
 * Screen Security Hook for Web
 * Detects screen recording/sharing and provides security state
 */

import { useEffect, useState } from 'react';
import screenSecurity from '../services/screenSecurity';

interface UseScreenSecurityReturn {
  isCapturing: boolean;
  initialize: () => void;
}

export function useScreenSecurity(): UseScreenSecurityReturn {
  const [isCapturing, setIsCapturing] = useState(false);

  const initialize = () => {
    screenSecurity.initialize();
  };

  useEffect(() => {
    // Subscribe to security state changes
    const unsubscribe = screenSecurity.onSecurityChange((capturing) => {
      setIsCapturing(capturing);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    isCapturing,
    initialize,
  };
}

export default useScreenSecurity;
