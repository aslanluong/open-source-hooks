import { FC } from "react";
import ReactDOM from "react-dom";
import {
  useHelloWorld,
  useLocalStorage,
  useWindowSize,
  useBreakpoints,
  useMethods,
  useQuery,
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
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
