import { Dispatch, SetStateAction } from 'react';

export interface ParserOptions<T> {
  serializer: (value: T) => string;
  deserializer: (value: string) => T;
}

export type LocalStorageReturn<T> = [
  T | undefined,
  Dispatch<SetStateAction<T | undefined>>,
  () => void,
];
