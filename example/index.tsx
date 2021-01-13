import { FC, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  useHelloWorld,
  useLocalStorage,
  useWindowSize,
  useBreakpoints,
} from "./dist/index";

// const useBreakPoint = createBreakpoint();
const App: FC = () => {
  const message = useHelloWorld();
  useEffect(() => {
    console.log(message);
  }, [message]);

  const [value, setValue, removeValue] = useLocalStorage(
    "value",
    "useLocalStorage"
  );

  const screen = useBreakpoints();
  const windowSize = useWindowSize();

  return (
    <div>
      Example page. {JSON.stringify(windowSize)}
      {screen}
      <div>Test value [useLocalStorage]: {JSON.stringify(value)}</div>
      <div onClick={() => setValue("Set OK")}>Test set [useLocalStorage]</div>
      <div onClick={() => removeValue()}>Test remove [useLocalStorage]</div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
