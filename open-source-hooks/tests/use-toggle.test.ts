import { renderHook } from '@testing-library/react-hooks';
import { useToggle } from '../src';

// const initializeHook = (initialValue: boolean) =>
//   renderHook(() => useToggle(initialValue));

it('should init state to false', () => {
  const { result } = renderHook(() => useToggle(false));

  expect(result.current[0]).toBe(false);
  expect(typeof result.current[1]).toBe('function');
});
