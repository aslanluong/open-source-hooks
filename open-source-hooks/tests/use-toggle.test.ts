import { renderHook, act } from '@testing-library/react-hooks';
import { useToggle } from '../src';

const initializeHook = (initialValue: boolean) =>
  renderHook(() => useToggle(initialValue));

it('should init state to false', () => {
  const { result } = initializeHook(false);

  expect(result.current[0]).toBe(false);
  expect(typeof result.current[1]).toBe('function');
});

it('should init state to true', () => {
  const { result } = initializeHook(true);

  expect(result.current[0]).toBe(true);
  expect(typeof result.current[1]).toBe('function');
});

it('should set state to true', () => {
  const { result } = initializeHook(false);
  const [toggle, setToggle] = result.current;

  expect(toggle).toBe(false);

  act(() => {
    setToggle(true);
  });

  expect(result.current[0]).toBe(true);
});

it('should set state to false', () => {
  const { result } = initializeHook(true);
  const [toggle, setToggle] = result.current;

  expect(toggle).toBe(true);

  act(() => {
    setToggle(false);
  });

  expect(result.current[0]).toBe(false);
});

it('should toggle state by non-boolean', () => {
  const { result } = initializeHook(false);
  const [toggle, setToggle] = result.current;

  expect(toggle).toBe(false);

  act(() => {
    setToggle('false');
  });

  expect(result.current[0]).toBe(true);
});
