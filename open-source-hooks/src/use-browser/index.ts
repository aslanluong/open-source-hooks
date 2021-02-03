import { useEffect } from 'react';
import { useMethods } from '../index';
import { BrowserReturn } from './types';
import { UAParser } from 'ua-parser-js';

const uaParser = new UAParser();
const { name, version } = uaParser.getBrowser();

export function useBrowser(): BrowserReturn {
  const initialState = {
    setUACount: 0,
    name,
    version,
    major: Number(version ? version.split('.')[0] : 0) ?? 0,
  };

  function createMethods(state: typeof initialState) {
    return {
      setName(name: string) {
        return { ...state, name };
      },
      setVersion(version: string) {
        return { ...state, version };
      },
      setMajor(major: number) {
        return { ...state, major };
      },
      increaseSetUACount() {
        return { ...state, setUACount: state.setUACount + 1 };
      },
    };
  }

  const [browser, browserMethods] = useMethods<
    ReturnType<typeof createMethods>,
    typeof initialState
  >(createMethods, initialState);

  const setUA = (ua: string) => {
    uaParser.setUA(ua);
    browserMethods.increaseSetUACount();
  };

  useEffect(() => {
    const { name: nextName, version: nextVersion } = uaParser.getBrowser();
    browserMethods.setName(nextName);
    browserMethods.setVersion(nextVersion);
    browserMethods.setMajor(
      Number(nextVersion ? nextVersion.split('.')[0] : 0) || 0,
    );
  }, [browser.setUACount]);

  return {
    name: browser.name,
    version: browser.version,
    major: browser.major,
    setUA,
  };
}
