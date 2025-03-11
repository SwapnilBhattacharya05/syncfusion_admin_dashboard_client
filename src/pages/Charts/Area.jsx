import { useEffect, useState } from "react";
import axios from "axios";
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  SplineAreaSeries,
  DateTime,
  Legend,
} from "@syncfusion/ej2-react-charts";

import { Header } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";

const Area = () => {
  const { currentMode } = useStateContext();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data: customersData } = await axios.get(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/customers`
        );

        if (!Array.isArray(customersData) || customersData.length === 0) {
          console.warn("⚠️ No customers found in API response!");
          return;
        }

        const groupedData = {};
        const statusCategories = ["Pending", "Active", "Cancelled"];

        customersData.forEach((customer) => {
          if (customer.weeks == null || !customer.status) return;

          const weeks = customer.weeks;

          if (!groupedData[weeks]) {
            groupedData[weeks] = {
              weeks,
              ...Object.fromEntries(
                statusCategories.map((status) => [status, 0])
              ),
            };
          }

          groupedData[weeks][customer.status] += 1;
        });

        const formattedData = Object.values(groupedData).sort(
          (a, b) => a.weeks - b.weeks
        );

        console.log("🔥 Processed Chart Data:", formattedData);

        setChartData(formattedData);
      } catch (error) {
        console.error("❌ Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  const primaryXAxis = {
    valueType: "Double",
    title: "Weeks",
    labelFormat: "0",
    interval: 1,
    titleStyle: { color: currentMode === "Dark" ? "#E5E7EB" : "#000" }, // 👈 Dynamic color
  };

  const primaryYAxis = {
    title: "Customers Count",
    titleStyle: { color: currentMode === "Dark" ? "#E5E7EB" : "#000" }, // 👈 Dynamic color
  };

  return (
    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <Header title="Customer Subscription Status Over Time" category="Chart" />
      <ChartComponent
        id="area-chart"
        height="420px"
        primaryXAxis={primaryXAxis}
        primaryYAxis={primaryYAxis}
        chartArea={{ border: { width: 0 } }}
        tooltip={{ enable: true }}
        background={currentMode === "Dark" ? "#33373E" : "#fff"}
      >
        <Inject services={[SplineAreaSeries, DateTime, Legend]} />
        <SeriesCollectionDirective>
          {[
            { status: "Pending", color: "#F6DC43" },
            { status: "Active", color: "#8BE78B" },
            { status: "Cancelled", color: "#FF5C8E" },
          ].map(({ status, color }, index) => (
            <SeriesDirective
              key={index}
              name={status}
              dataSource={chartData}
              xName="weeks"
              yName={status}
              type="SplineArea"
              opacity={0.7}
              fill={color} // 👈 Sets the color
            />
          ))}
        </SeriesCollectionDirective>
      </ChartComponent>
    </div>
  );
};

export default Area;
