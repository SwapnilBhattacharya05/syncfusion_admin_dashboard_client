import { useEffect, useState } from "react";
import axios from "axios";
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  Legend,
  Category,
  Tooltip,
  ColumnSeries,
  DataLabel,
} from "@syncfusion/ej2-react-charts";

import { Header } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";

const Bar = () => {
  const { currentMode } = useStateContext();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: ordersData } = await axios.get(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders`
        );

        if (!Array.isArray(ordersData) || ordersData.length === 0) {
          console.warn("⚠️ No orders found in API response!");
          return;
        }

        // Group orders by location
        const locationMap = {};
        ordersData.forEach((order) => {
          if (!order.location) return;

          if (!locationMap[order.location]) {
            locationMap[order.location] = {
              location: order.location,
              count: 0,
            };
          }
          locationMap[order.location].count += 1;
        });

        // Convert to array & sort
        const formattedData = Object.values(locationMap).sort(
          (a, b) => b.count - a.count
        );

        // Assign colors dynamically
        const colorPalette = ["#EA8FEA", "#C0DEFF", "#FFCAC8"]; // Darker Green, Yellow, Red
        formattedData.forEach((item, index) => {
          item.color = colorPalette[index % colorPalette.length]; // Cycle through three colors
        });

        console.log("🔥 Processed Bar Chart Data:", formattedData);

        setChartData(formattedData);
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // X and Y axis configuration
  const primaryXAxis = {
    valueType: "Category",
    title: "Location",
    titleStyle: { color: currentMode === "Dark" ? "#E5E7EB" : "#000" }, // ✅ Fix applied
    labelStyle: { color: currentMode === "Dark" ? "#E5E7EB" : "#000" },
  };

  const primaryYAxis = {
    title: "Order Count",
    titleStyle: { color: currentMode === "Dark" ? "#E5E7EB" : "#000" }, // ✅ Fix applied
    labelStyle: { color: currentMode === "Dark" ? "#E5E7EB" : "#000" },
  };

  return (
    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <Header category="Bar" title="Orders by Location" />
      <div className="w-full">
        <ChartComponent
          id="bar-chart"
          primaryXAxis={primaryXAxis}
          primaryYAxis={primaryYAxis}
          chartArea={{ border: { width: 0 } }}
          tooltip={{ enable: true }}
          background={currentMode === "Dark" ? "#33373E" : "#fff"}
          legendSettings={{
            background: "transparent",
            textStyle: { color: currentMode === "Dark" ? "#E5E7EB" : "#000" },
          }}
        >
          <Inject
            services={[ColumnSeries, Legend, Tooltip, Category, DataLabel]}
          />
          <SeriesCollectionDirective>
            <SeriesDirective
              name="Orders"
              dataSource={chartData}
              xName="location"
              yName="count"
              type="Column"
              marker={{ dataLabel: { visible: true } }}
              pointColorMapping="color" // Map colors dynamically
            />
          </SeriesCollectionDirective>
        </ChartComponent>
      </div>
    </div>
  );
};

export default Bar;
