export type BreakpointName = string | number;
export type Breakpoints<T extends BreakpointName> = Record<T, number>;
