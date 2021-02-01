import { useEffect, useState, useRef } from 'react';
import { useMethods } from '../use-methods';
import { FetchResult, FetchState, Endpoint, ObserverConfigs } from './types';

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
): FetchResult<TData, TError>;
export function useQuery<TResponse, TData = TResponse, TError = unknown>(
  endpoint: Endpoint,
  configs?: ObserverConfigs<TResponse, TData, TError>,
): FetchResult<TData, TError>;
export function useQuery<TResponse, TData = TResponse, TError = unknown>(
  arg1: Endpoint | ObserverConfigs<TResponse, TData, TError>,
  arg2?: ObserverConfigs<TResponse, TData, TError>,
): FetchResult<TData, TError> {
  const parsedConfigs = parseFetchArgs(arg1, arg2);
  const {
    endpoint,
    pagination,
    depParams,
    deps = [],
    enabled = true,
    processData,
  } = parsedConfigs;
  const stringifyDeps = JSON.stringify(pagination) + JSON.stringify(depParams);

  const fetchInitialState: FetchState<TData, TError> = {
    status: 'idle',
    isLoading: false,
    data: parsedConfigs.initialData || null,
    error: null,
  };

  const createFetchMethods = (state: typeof fetchInitialState) => {
    return {
      handleFetchInit(): typeof fetchInitialState {
        return { ...state, status: 'loading', isLoading: true };
      },
      handleFetchSuccess(
        data: typeof fetchInitialState['data'],
      ): typeof fetchInitialState {
        return {
          ...state,
          status: 'success',
          isLoading: false,
          error: null,
          data,
        };
      },
      handleFetchFailure(
        error: typeof fetchInitialState['error'],
      ): typeof fetchInitialState {
        return {
          ...state,
          status: 'error',
          isLoading: false,
          error,
        };
      },
    };
  };

  const [fetchState, fetchMethods] = useMethods<
    ReturnType<typeof createFetchMethods>,
    typeof fetchInitialState
  >(createFetchMethods, fetchInitialState);

  const [reloadCount, setReloadCount] = useState<number>(0);
  const reload = () => setReloadCount(reloadCount + 1);

  const controller = useRef<AbortController>(new AbortController());

  const processFetch = (signal: AbortSignal) => {
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

      fetchMethods.handleFetchInit();
      parsedConfigs.onFetching && parsedConfigs.onFetching();

      fetch(endpoint + stringParams, {
        /* headers: getHeaders(), */ signal: signal,
      })
        .then((res) => res.json())
        .then((data) => {
          // handle call on success
          parsedConfigs.onSuccess && parsedConfigs.onSuccess(data);
          // handle process data
          if (parsedConfigs.processData) {
            fetchMethods.handleFetchSuccess(processData(data));
          } else {
            fetchMethods.handleFetchSuccess(data);
          }
        })
        .catch((error) => {
          if (error.name === 'AbortError') {
            console.log('User aborted the fetch!');
          } else {
            parsedConfigs.onError && parsedConfigs.onError(error);
            fetchMethods.handleFetchFailure(error);
          }
        });
    }
  };

  useEffect(() => {
    if (enabled) {
      controller.current = new AbortController();
      processFetch(controller.current.signal);
    }
  }, [endpoint, stringifyDeps, enabled, ...deps]);

  useEffect(() => {
    if (reloadCount >= 1) {
      controller.current = new AbortController();
      processFetch(controller.current.signal);
    }
  }, [reloadCount]);

  useEffect(() => {
    return (): void => {
      controller.current.abort();
    };
  }, [reloadCount, endpoint, stringifyDeps, enabled, ...deps]);

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
