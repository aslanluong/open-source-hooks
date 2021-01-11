import { FC } from "react";
import ReactDOM from "react-dom";
import { useHelloWorld, useLocalStorage } from "./dist/index";

const App: FC = () => {
  const message = useHelloWorld();
  console.log(message);

  const [value, setValue, removeValue] = useLocalStorage("value", {
    name: "useLocalStorage",
  });
  return (
    <div>
      Example page.
      <div>Test value [useLocalStorage]: {JSON.stringify(value)}</div>
      <div onClick={() => setValue({ name: "Set OK" })}>
        Test set [useLocalStorage]
      </div>
      <div onClick={() => removeValue()}>Test remove [useLocalStorage]</div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
