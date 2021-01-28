import { EffectCallback } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useEffectOnce } from '../src';

const initializeHook = (effect: EffectCallback) =>
  renderHook(() => useEffectOnce(effect));

const mockCleanupFn = jest.fn();
const mockCleanupCallback = jest.fn().mockReturnValue(mockCleanupFn);

it('should run provided effect function only once', () => {
  const { rerender } = initializeHook(mockCleanupCallback);
  expect(mockCleanupCallback).toHaveBeenCalledTimes(1);

  rerender();
  expect(mockCleanupCallback).toHaveBeenCalledTimes(1);
});

it('should run clean-up function only once on unmount', () => {
  const { unmount } = renderHook(() => useEffectOnce(mockCleanupCallback));
  expect(mockCleanupFn).not.toHaveBeenCalled();

  unmount();
  expect(mockCleanupFn).toHaveBeenCalledTimes(1);
});
