export type CreateMethods<M, T> = (
  state: T,
) => {
  [P in keyof M]: (...payload: any) => T;
};

export type InitialMethods<M> = {
  [P in keyof M]: (...payload: any) => void;
} & {
  [name: string]: (...payload: any) => void;
};

export type WrappedMethods<M> = {
  [P in keyof M]: M[P];
};
