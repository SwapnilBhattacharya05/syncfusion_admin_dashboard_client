import { useEffect, useState } from "react";
import axios from "axios";
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  LineSeries,
  Category,
  Legend,
  Tooltip,
} from "@syncfusion/ej2-react-charts";
import { useStateContext } from "../../contexts/ContextProvider";

const LineChart = () => {
  const { currentMode } = useStateContext();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: ordersData } = await axios.get(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders`
        );

        const groupedData = {};
        const locations = new Set();

        ordersData.forEach((order) => {
          const { location, status } = order;

          if (!groupedData[status]) {
            groupedData[status] = {};
          }
          groupedData[status][location] =
            (groupedData[status][location] || 0) + 1;

          locations.add(location);
        });

        const xLabels = Array.from(locations);

        const formattedData = Object.keys(groupedData).map((status) => ({
          status,
          data: xLabels.map((location) => ({
            x: location, // Location on X-axis
            y: groupedData[status][location] || 0, // Order count on Y-axis
          })),
        }));

        console.log("Formatted Chart Data:", formattedData);
        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Theme-based axis title styles
  const axisTitleStyle = {
    color: currentMode === "Dark" ? "#E5E7EB" : "#333",
    size: "16px",
    fontWeight: "600",
  };

  return (
    <ChartComponent
      id="line-chart"
      height="420px"
      primaryXAxis={{
        valueType: "Category",
        title: "Location",
        titleStyle: axisTitleStyle,
      }}
      primaryYAxis={{
        title: "Number of Orders",
        titleStyle: axisTitleStyle,
      }}
      chartArea={{ border: { width: 0 } }}
      tooltip={{ enable: true }}
      legendSettings={{ visible: true }}
      background={currentMode === "Dark" ? "#33373E" : "#fff"}
    >
      <Inject services={[LineSeries, Category, Legend, Tooltip]} />
      <SeriesCollectionDirective>
        {chartData.map((item, index) => (
          <SeriesDirective
            key={index}
            name={item.status} // Legend name
            dataSource={item.data}
            xName="x"
            yName="y"
            type="Line"
            width={2}
            marker={{ visible: true, width: 8, height: 8 }}
          />
        ))}
      </SeriesCollectionDirective>
    </ChartComponent>
  );
};

export default LineChart;
