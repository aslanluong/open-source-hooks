import { FC } from "react";
import ReactDOM from "react-dom";
import { useHelloWorld } from "./dist/index";

const App: FC = () => {
  const message = useHelloWorld();
  console.log(message);
  return <div>Example page.</div>;
};

ReactDOM.render(<App />, document.getElementById("root"));
