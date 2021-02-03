export interface BrowserReturn {
  name: string;
  version: string;
  major: number;
  setUA: (ua: string) => void;
}
