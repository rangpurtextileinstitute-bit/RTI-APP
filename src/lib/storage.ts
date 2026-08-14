export const safeLocalStorageGet = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return defaultValue;
    return JSON.parse(saved);
  } catch (e) {
    console.error(`Error parsing localStorage key "${key}":`, e);
    return defaultValue;
  }
};

export const safeStringify = (obj: any): string => {
  const cache = new Set();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        return; // Discard circular reference
      }
      cache.add(value);
    }
    return value;
  });
};

export const safeLocalStorageSet = (key: string, value: any): void => {
  if (typeof window === 'undefined') return;
  // Clear any existing timer for this key
  if ((window as any)[`timer_${key}`]) {
    clearTimeout((window as any)[`timer_${key}`]);
  }
  
  // Debounce saving by 500ms
  (window as any)[`timer_${key}`] = setTimeout(() => {
    try {
      localStorage.setItem(key, safeStringify(value));
    } catch (e: any) {
      if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        console.warn(`LocalStorage quota exceeded. Clearing all 'rti_' keys to make space for "${key}".`);
        
        // Aggressive strategy: Clear all keys related to this app
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith('rti_') && k !== key) {
            localStorage.removeItem(k);
            i--; // Adjust index after removal
          }
        }
        
        // Try setting again
        try {
          localStorage.setItem(key, safeStringify(value));
        } catch (e2) {
          console.error(`Still unable to set key "${key}" after aggressive clearing:`, e2);
        }
      } else {
        console.error(`Error stringifying/setting localStorage key "${key}":`, e);
      }
    }
  }, 500);
};
