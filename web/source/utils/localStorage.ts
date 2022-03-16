let available: boolean | null = null;

let memoryStorage = {};

function localStorageAvailable(): boolean {
  if (available !== null) {
    return available;
  }

  memoryStorage = {};

  if (typeof localStorage === 'undefined') {
    return false;
  }

  const key = '__localstorage_test__';

  try {
    localStorage.setItem(key, key);
    localStorage.removeItem(key);
    available = true;
  } catch (err) {
    available = false;
  }

  return available;
}

export namespace SafeLocalStorage {
  export function getItem(key: string): string | null {
    if (localStorageAvailable()) {
      return localStorage.getItem(key);
    }
    return memoryStorage[key];
  }

  export function setItem(key: string, value: string): void {
    if (localStorageAvailable()) {
      localStorage.setItem(key, value);
    } else {
      memoryStorage[key] = value;
    }
  }

  export function removeItem(key: string): void {
    if (localStorageAvailable()) {
      localStorage.removeItem(key);
    } else {
      delete memoryStorage[key];
    }
  }

  export function clear(): void {
    if (localStorageAvailable()) {
      localStorage.clear();
    } else {
      memoryStorage = {};
    }
  }
}

export class LocalStore<T> {
  // eslint-disable-next-line no-empty-function
  constructor(private key: string) {}

  set = (value: T) => SafeLocalStorage.setItem(this.key, JSON.stringify(value));

  get = (): T | undefined => {
    const value = SafeLocalStorage.getItem(this.key);

    if (!value) {
      return undefined;
    }

    try {
      return JSON.parse(value) as T;
    } catch (e) {
      /** couldn't parse value, it is likely just a string value */
      return value as any as T;
    }
  };

  clear = () => SafeLocalStorage.removeItem(this.key);
}
