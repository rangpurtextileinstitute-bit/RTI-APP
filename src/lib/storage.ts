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

export const sanitizeValue = (value: any, seen = new WeakSet()): any => {
  if (value === null || value === undefined) return value;
  const type = typeof value;
  if (type === 'string' || type === 'number' || type === 'boolean') {
    return value;
  }
  if (type === 'function' || type === 'symbol') {
    return undefined;
  }
  if (type === 'object') {
    // Check for React elements, VDOM, or Fiber nodes
    if (
      value.$$typeof ||
      value._reactName ||
      value.nativeEvent ||
      (typeof HTMLElement !== 'undefined' && value instanceof HTMLElement) ||
      (typeof Window !== 'undefined' && value instanceof Window) ||
      value === window ||
      value.stateNode ||
      value.return ||
      value.child ||
      value.sibling ||
      value._owner
    ) {
      return undefined;
    }

    if (seen.has(value)) {
      return undefined; // Circular reference
    }
    seen.add(value);

    if (Array.isArray(value)) {
      return value.map(item => sanitizeValue(item, seen));
    }

    // Plain object or class instance
    const sanitized: Record<string, any> = {};
    for (const key of Object.keys(value)) {
      if (key.startsWith('__react') || key === '_owner' || key === 'ref' || key === 'key') {
        continue;
      }
      const cleaned = sanitizeValue(value[key], seen);
      if (cleaned !== undefined) {
        sanitized[key] = cleaned;
      }
    }
    return sanitized;
  }
  return undefined;
};

export const safeStringify = (obj: any): string => {
  try {
    const sanitized = sanitizeValue(obj);
    return JSON.stringify(sanitized);
  } catch (err) {
    console.error('Error in safeStringify:', err);
    return '{}';
  }
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
