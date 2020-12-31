export interface DebouncedReturn<T> {
  debouncedValue: T;
  forceInstant: () => void;
}
