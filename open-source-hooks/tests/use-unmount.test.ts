import { renderHook } from '@testing-library/react-hooks';
import { useUnmount } from '../src';

const initializeHook = (callback: () => void) =>
  renderHook(() => useUnmount(callback));

const spy = jest.fn();
const spyCallback = jest.fn().mockReturnValue(spy);

it('should not run clean-up function on mount', () => {
  renderHook(() => useUnmount(spy));

  expect(spyCallback).not.toHaveBeenCalled();
});

it('should not run clean-up function on re-renders', () => {
  const spy = jest.fn();
  const { rerender } = initializeHook(spy);

  rerender();
  rerender();
  rerender();

  expect(spyCallback).not.toHaveBeenCalled();
});

it('should run clean-up function on unmount', () => {
  const { unmount } = renderHook(() => useUnmount(spy));

  unmount();

  expect(spy).toHaveBeenCalledTimes(1);
});
