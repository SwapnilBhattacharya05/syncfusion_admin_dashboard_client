import { ChartsHeader, Header, LineChart } from "../../components";

const Line = () => {
  return (
    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <Header title="Order Status Across Locations" category="Chart" />
      <div className="w-full">
        <LineChart />
      </div>
    </div>
  );
};
export default Line;
