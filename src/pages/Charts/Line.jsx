import { ChartsHeader, Header, LineChart } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";

const Line = () => {
  const { currentColor, currentMode } = useStateContext();
  return (
    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <Header title="Inflation Rate" category="Chart" />
      <div className="w-full">
        <LineChart />
      </div>
    </div>
  );
};
export default Line;
