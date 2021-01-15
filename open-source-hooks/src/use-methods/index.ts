import { useMemo, useReducer, Reducer } from 'react';
import { CreateMethods, InitialMethods, WrappedMethods } from './types';

interface Action {
  type: string;
  payload?: any;
}

export const useMethods = <M extends InitialMethods<M>, T>(
  createMethods: CreateMethods<M, T>,
  initialState: T,
): [T, WrappedMethods<M>] => {
  const reducer = useMemo<Reducer<T, Action>>(
    () => (reducerState: T, action: Action) => {
      return createMethods(reducerState)[action.type](...action.payload);
    },
    [createMethods],
  );

  const [state, dispatch] = useReducer<Reducer<T, Action>>(
    reducer,
    initialState,
  );

  const wrappedMethods: WrappedMethods<M> = useMemo(() => {
    const actionTypes = Object.keys(createMethods(initialState));
    return actionTypes.reduce((acc, type) => {
      Object.assign(acc, {
        [type]: (...payload: any) => dispatch({ type, payload }),
      });
      return acc;
    }, {} as WrappedMethods<M>);
  }, [createMethods, initialState]);

  return [state, wrappedMethods];
};
