# open-source-hooks

[![cicd](https://github.com/aslanluong/open-source-hooks/workflows/test-publish/badge.svg)](http://github.com/aslanluong/open-source-hooks/actions?query=workflow%3Atest-publish+branch%3Amain)
[![npm](https://img.shields.io/npm/v/open-source-hooks.svg)](https://www.npmjs.com/package/open-source-hooks)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Open source hooks for React, simply and easy to use &lt;3

## Install
```bash
npm i open-source-hooks

#yarn
yarn add open-source-hooks

#pnpm
pnpm add open-source-hooks
```

## Hooks

- **Sensors**
  - [useBreakPoints](#usebreakpoints)
  - [useBrowser](#usebrowser)
  - [useWindowSize](#usewindowsize)
- **Side-effects**
  - [useDebounce](#usedebounce)
  - [useLocalStorage](#uselocalstorage)
  - [useThrottle](#usethrottle)
- **Lifecycles**
  - [useEffectOnce](#useeffectonce)
  - [useUnmount](#useunmount)
  - [useUpdateEffect](#useupdateeffect)
- **State**
  - [useMethods](#usemethods)
  - [useToggle](#usetoggle)
- **Http-request**
  - [useQuery](#usequery)
  
## Usage

### useBreakpoints
```ts
import { useBreakpoints } from "open-source-hooks";

const screenSize = useBreakpoints();

useEffect(() => {
  console.log(`Your screen size: ${screenSize}`);
});
```
**↑ back to:** [Hooks](#hooks)

### useBrowser
```ts
import { useBrowser } from "open-source-hooks";

const { name, major } = useBrowser();

useEffect(() => {
  console.log(`Browser name: ${name}, major version: ${major}`);
}, []);
```
**↑ back to:** [Hooks](#hooks)

### useDebounce
```ts
import { useDebounce } from "open-source-hooks";

const [searchInput, setSearchInput] = useState("");
const { debouncedValue } = useDebounce(searchInput);

useEffect(() => {
  console.log(`New search value: ${debouncedValue}`);
  // handle search here
}, [debouncedValue]);
```
**↑ back to:** [Hooks](#hooks)

### useEffectOnce
```ts
import { useEffectOnce } from "open-source-hooks";

useEffectOnce(() => {
  console.log(`This line only runs once");
});
```
**↑ back to:** [Hooks](#hooks)

### useLocalStorage
```ts
import { useLocalStorage } from "open-source-hooks";

const [value, setValue] = useLocalStorage("name", "init value");

useEffect(() => {
  setValue("new value");
}, []);

useEffect(() => {
  console.log(`Current value of 'name': ${value}`);
}, [value]);
```
**↑ back to:** [Hooks](#hooks)

### useMethods
```ts
import { useMethods } from "open-source-hooks";

const initialState = { count: 0 };

function createMethods(state: typeof initialState) {
  return {
    increment() {
      return { ...state, count: state.count + 1 };
    },
    decrement() {
      return { ...state, count: state.count - 1 };
    },
  };
}

const [state, methods] = useMethods<
  ReturnType<typeof createMethods>,
  typeof initialState
>(createMethods, initialState);

useEffect(() => {
  methods.increment();
}, []);

useEffect(() => {
  console.log(`Current state value: ${state}`);
}, [state]);
```
**↑ back to:** [Hooks](#hooks)

### useQuery
```ts
import { useQuery } from "open-source-hooks";

const { data } = useQuery("https://api.github.com/users/octocat", {
  onSuccess: (res) => {
    console.log(res);
  },
  processData: (res) => JSON.stringify(res),
});

useEffect(() => {
  if (data) {
    console.log(`Current response: ${data}`);
  }
}, [data]);
```
**↑ back to:** [Hooks](#hooks)

### useThrottle
```ts
import { useThrottle } from "open-source-hooks";

const [throttle, setThrottle] = useState("init-value");
const throttleValue = useThrottle(throttle, 500);
const interval = useRef<NodeJS.Timeout>();

useEffect(() => {
  interval.current = setInterval(() => setThrottle(prev => `${prev}-new-value`), 100);
  return () => clearInterval(interval.current);
}, []);

useEffect(() => {
  console.log(`Throttle value changed to: ${throttleValue}`);
}, [throttleValue]);
```
**↑ back to:** [Hooks](#hooks)

### useToggle
```ts
import { useToggle } from "open-source-hooks";

const [toggle, setToggle] = useToggle(false);

useEffect(() => {
  setToggle();
}, []);

useEffect(() => {
  console.log(`Toggle state: ${toggle}`);
  // toggle must be true on second log
}, [toggle]);
```
**↑ back to:** [Hooks](#hooks)

### useUnmount
```ts
import { useUnmount } from "open-source-hooks";

useUnmount(() => {
  console.log("useUnmount");
  // cannot run until component unmounted
});
```
**↑ back to:** [Hooks](#hooks)

### useUpdateEffect
```ts
import { useUpdateEffect } from "open-source-hooks";

useUpdateEffect(() => {
  console.log("useUpdateEffect");
  // run on rerender only
});
```
**↑ back to:** [Hooks](#hooks)

### useWindowSize
```ts
import { useWindowSize } from "open-source-hooks";

const { width, height } = useWindowSize();

useEffect(() => {
  console.log(`Window width: ${width}, window height: ${height}`);
});
```
**↑ back to:** [Hooks](#hooks)

## Example
See [./example](./example)

## License
MIT License © 2020 [Thang Luong](https://github.com/aslanluong)
