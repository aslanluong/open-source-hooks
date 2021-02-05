import { FC, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  useHelloWorld,
  useLocalStorage,
  useWindowSize,
  useBreakpoints,
  useMethods,
  useQuery,
  useToggle,
  useThrottle,
  useEffectOnce,
  useUnmount,
  useBrowser,
} from "./dist/index";

const App: FC = () => {
  const message = useHelloWorld();
  useQuery("https://api.github.com/users/octocat", {
    onSuccess: (res) => {
      console.log(res);
    },
  });

  const [value, setValue, removeValue] = useLocalStorage(
    "value",
    "useLocalStorage"
  );

  useEffect(() => {
    setValue((prev) => prev + " set");
    setValue((prev) => prev + " multi");
    setValue((prev) => prev + " times");
  }, []);

  const screen = useBreakpoints();
  const windowSize = useWindowSize();

  const initialState = {
    count: 0,
  };

  function createMethods(state: typeof initialState) {
    return {
      reset() {
        return initialState;
      },
      increment() {
        return { ...state, count: state.count + 1 };
      },
      incrementMulti(number: number) {
        return { ...state, count: state.count + number };
      },
      decrement() {
        return { ...state, count: state.count - 1 };
      },
    };
  }

  // const [state, methods] = useMethods(createMethods, initialState);
  const [state, methods] = useMethods<
    ReturnType<typeof createMethods>,
    typeof initialState
  >(createMethods, initialState);

  const [toggle, setToggle] = useToggle(false);

  const [throttle, setThrottle] = useState("initialState");
  const throttleValue = useThrottle(throttle, 500);

  useEffectOnce(() => {
    console.log("useEffectOnce");
  });

  const UnmountComponent = () => {
    useUnmount(() => {
      console.log("useUnmount");
    });

    // useEffect(() => {
    //   return () => {
    //     console.log("useUnmount");
    //   };
    // }, []);
    return <div>unMountComponent</div>;
  };

  const { name, version, major } = useBrowser();
  useEffect(() => {
    console.log(name, version, major);
  }, [name]);

  return (
    <div>
      Example page.
      <div>
        --------------------------- v1.0.0 ---------------------------
        <div>{message}</div>
      </div>
      <div>
        --------------------------- v1.1.0 ---------------------------
        <div>useDebounce</div>
      </div>
      <div>
        --------------------------- v1.2.0 ---------------------------
        <div>Test value [useLocalStorage]: {JSON.stringify(value)}</div>
        <div onClick={() => setValue("Set OK")}>Test set [useLocalStorage]</div>
        <div onClick={() => removeValue()}>Test remove [useLocalStorage]</div>
      </div>
      <div>
        --------------------------- v1.3.0 ---------------------------
        <div>{JSON.stringify(windowSize)}</div>
      </div>
      <div>
        --------------------------- v1.4.0 ---------------------------
        <div>{screen}</div>
      </div>
      <div>
        --------------------------- v1.5.0 ---------------------------
        <div>{JSON.stringify(state)}</div>
        <div onClick={() => methods.reset()}>reset</div>
        <div onClick={() => methods.increment()}>increment</div>
        <div onClick={() => methods.incrementMulti(5)}>incrementMulti (+5)</div>
      </div>
      <div>
        --------------------------- v1.7.0 ---------------------------
        <div>{JSON.stringify(toggle)}</div>
        <div onClick={setToggle}>toggle</div>
        <div onClick={() => setToggle(true)}>toggle true</div>
      </div>
      <div>
        --------------------------- v1.8.0 ---------------------------
        <div>throttle value: {JSON.stringify(throttleValue)}</div>
        <div>input: {JSON.stringify(throttle)}</div>
        <input onChange={(e) => setThrottle(e.target.value)} />
      </div>
      <div>
        --------------------------- v1.10.0 ---------------------------
        {toggle && <UnmountComponent />}
        <div onClick={setToggle}>toggle</div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
