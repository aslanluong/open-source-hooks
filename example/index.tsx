import { FC, useEffect } from "react";
import ReactDOM from "react-dom";
import { useHelloWorld, useLocalStorage, useWindowSize } from "./dist/index";

const App: FC = () => {
  const message = useHelloWorld();
  useEffect(() => {
    console.log(message);
  }, [message]);

  const [value, setValue, removeValue] = useLocalStorage("value", {
    name: "useLocalStorage",
  });

  const windowSize = useWindowSize();

  return (
    <div>
      Example page. {JSON.stringify(windowSize)}
      <div>Test value [useLocalStorage]: {JSON.stringify(value)}</div>
      <div onClick={() => setValue({ name: "Set OK" })}>
        Test set [useLocalStorage]
      </div>
      <div onClick={() => removeValue()}>Test remove [useLocalStorage]</div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
