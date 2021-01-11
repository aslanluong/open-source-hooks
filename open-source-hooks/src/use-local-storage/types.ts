import { Dispatch, SetStateAction } from 'react';

export type LocalStorageReturn<T> = [
  T | undefined,
  Dispatch<SetStateAction<T | undefined>>,
  () => void,
];
