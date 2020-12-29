import { Reducer, useEffect, useReducer, useState } from 'react';
import {
  AlphaFetchResult,
  AlphaFetchState,
  Endpoint,
  ObserverConfigs,
} from './types';

interface AlphaFetchPayloads<TData, TError> {
  ['FETCH_INIT']: undefined;
  ['FETCH_SUCCESS']: { data: TData };
  ['FETCH_FAILURE']: { error: TError };
}

type AlphaFetchActionsMap<Payloads> = {
  [Key in keyof Payloads]: Payloads[Key] extends undefined
    ? { type: Key }
    : { type: Key; payload: Payloads[Key] };
};

type AlphaFetchAction<TData, TError> = AlphaFetchActionsMap<
  AlphaFetchPayloads<TData, TError>
>[keyof AlphaFetchActionsMap<AlphaFetchPayloads<TData, TError>>];

export function parseFetchArgs<TConfigs extends ObserverConfigs<any, any, any>>(
  arg1: Endpoint | TConfigs,
  arg2?: TConfigs,
): TConfigs {
  if (!isEndpoint(arg1)) {
    return arg1 as TConfigs;
  }

  if (isEndpointArray(arg1)) {
    return { ...arg2, endpoint: arg1[0], depParams: arg1[1] } as TConfigs;
  }

  return { ...arg2, endpoint: String(arg1) } as TConfigs;
}

export function useQuery<TResponse, TData = TResponse, TError = unknown>(
  configs: ObserverConfigs<TResponse, TData, TError>,
): AlphaFetchResult<TData, TError>;
export function useQuery<TResponse, TData = TResponse, TError = unknown>(
  endpoint: Endpoint,
  configs?: ObserverConfigs<TResponse, TData, TError>,
): AlphaFetchResult<TData, TError>;
export function useQuery<TResponse, TData = TResponse, TError = unknown>(
  arg1: Endpoint | ObserverConfigs<TResponse, TData, TError>,
  arg2?: ObserverConfigs<TResponse, TData, TError>,
): AlphaFetchResult<TData, TError> {
  const parsedConfigs = parseFetchArgs(arg1, arg2);
  const {
    endpoint,
    pagination,
    depParams,
    deps = [],
    processData,
  } = parsedConfigs;
  const stringifyDeps = JSON.stringify(pagination) + JSON.stringify(depParams);

  const [fetchState, fetchDispatch] = useReducer<
    Reducer<AlphaFetchState<TData, TError>, AlphaFetchAction<TData, TError>>
  >(fetchReducer, {
    status: 'idle',
    isLoading: false,
    data: parsedConfigs.initialData || null,
    error: null,
  });

  const [reloadCount, setReloadCount] = useState<number>(0);
  const reload = () => setReloadCount(reloadCount + 1);

  useEffect(() => {
    const controller = new AbortController();

    if (endpoint) {
      if (depParams) {
        Object.keys(depParams).forEach(
          (key) =>
            (depParams[key] === undefined || depParams[key] === null) &&
            delete depParams[key],
        );
      }
      let stringParams = `?${new URLSearchParams(depParams).toString()}`;

      if (pagination) {
        const offset = (pagination.page - 1) * (pagination.pageSize || 10);
        stringParams += `&offset=${offset}&limit=${pagination.pageSize || 10}`;
      }

      fetchDispatch({ type: 'FETCH_INIT' });
      parsedConfigs.onFetching && parsedConfigs.onFetching();

      fetch(endpoint + stringParams, {
        /* headers: getHeaders(), */ signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data) => {
          // handle call on success
          parsedConfigs.onSuccess && parsedConfigs.onSuccess(data);
          // handle process data
          if (parsedConfigs.processData) {
            fetchDispatch({
              type: 'FETCH_SUCCESS',
              payload: { data: processData(data) },
            });
          } else {
            fetchDispatch({ type: 'FETCH_SUCCESS', payload: { data } });
          }
        })
        .catch((error) => {
          if (error.name === 'AbortError') {
            console.log('User aborted the fetch!');
          } else {
            parsedConfigs.onError && parsedConfigs.onError(error);
            fetchDispatch({ type: 'FETCH_FAILURE', payload: { error } });
          }
        });
    }

    return (): void => {
      controller.abort();
    };
  }, [endpoint, stringifyDeps, reloadCount, ...deps]);

  return {
    status: fetchState.status,
    isLoading: fetchState.isLoading,
    data: fetchState.data,
    error: fetchState.error,
    reload,
  };
}

const isEndpoint = (value: any): value is Endpoint => {
  return typeof value === 'string' || Array.isArray(value);
};

const isEndpointArray = (value: any): value is Endpoint => {
  return Array.isArray(value);
};

const fetchReducer = <TData, TError>(
  state: AlphaFetchState<TData, TError>,
  action: AlphaFetchAction<TData, TError>,
): AlphaFetchState<TData, TError> => {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, status: 'loading', isLoading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        status: 'success',
        isLoading: false,
        error: null,
        data: action.payload.data,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        status: 'error',
        isLoading: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
};
