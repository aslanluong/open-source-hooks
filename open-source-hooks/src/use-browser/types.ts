export interface Browser {
  name: string;
  version: string;
  major: number;
  setUA: (UA: string) => void;
}
