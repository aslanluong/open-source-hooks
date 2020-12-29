export type AlphaFetchStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AlphaFetchResult<TData, TError> {
  status: AlphaFetchStatus;
  isLoading: boolean;
  data: null | TData;
  error: null | TError;
  reload: () => void;
}

export type Endpoint = string | [url: string, params: Record<string, unknown>];

export interface Configs<TData = unknown, TError = unknown> {
  endpoint?: string;
  initialData?: TData | null;
}

export interface ObserverConfigs<TResponse, TData = TResponse, TError = unknown>
  extends Configs<TData, TError> {
  /**
   * Set this to `false` to disable automatic refetching when the query mounts or changes deps.
   * Defaults to `true`.
   */
  enabled?: boolean;
  /**
   * If set, offset & limit params will be add to endpoint
   * Re-fetch when the `page` or `pageSize` properties change.
   */
  pagination?: { page: number; pageSize?: number };
  /**
   * If set, all params will be add to endpoint
   * Re-fetch if any of the listed properties change.
   */
  depParams?: Record<string, string>;
  /**
   * If set, re-fetch if any of the listed properties change.
   */
  deps?: (string | number)[];
  /**
   * This callback will fire when the query start fetching.
   */
  onFetching?: () => void;
  /**
   * This callback will fire any time the query successfully fetches new data.
   */
  onSuccess?: (response: TResponse) => void;
  /**
   * This callback will fire if the query encounters an error and will be passed the error.
   */
  onError?: (error: TError) => void;
  /**
   * This option can be used to transform or select a part of the response data.
   */
  processData?: (response: TResponse) => TData;
}

export interface AlphaFetchState<TData, TError> {
  status: AlphaFetchStatus;
  isLoading: boolean;
  data: null | TData;
  error: null | TError;
}
