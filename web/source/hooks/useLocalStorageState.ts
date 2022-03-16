import { Objects } from '@rocketmakers/armstrong-edge';
import * as React from 'react';

import { LocalStore } from '../utils/localStorage';

export const useLocalStorageState = <T>(key: string, initialValue?: T): [T | undefined, (newValue: T) => void] => {
  const store = React.useRef(new LocalStore<T>(key));
  const [state, setState] = React.useState(store.current.get() || initialValue);

  const set = React.useCallback((value: T) => {
    store.current.set(value);
    setState(value);
  }, []);

  return [state, set];
};

export const useLocalStorageArrayState = <T>(
  key: string,
  initialValue?: T[]
): [
  T[],
  {
    set: (value: T[]) => void;
    remove: (value: T) => void;
    push: (value: T) => void;
  }
] => {
  const [value, set] = useLocalStorageState<T[]>(key, initialValue || []);

  const push = React.useCallback(
    (newValue: T) => {
      set([...(value || []), newValue]);
    },
    [Objects.contentDependency(value)]
  );

  const remove = React.useCallback(
    (valueToRemove: T) => {
      set(value?.filter((item) => item !== valueToRemove) || []);
    },
    [Objects.contentDependency(value)]
  );

  return [
    value || [],
    {
      set,
      push,
      remove,
    },
  ];
};
