import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  Legend,
  Category,
  StackingColumnSeries,
  Tooltip,
} from "@syncfusion/ej2-react-charts";

import { useState, useEffect } from "react";
import axios from "axios";
import { useStateContext } from "../../contexts/ContextProvider"; // Import your context

const Stacked = ({
  width,
  height,
  labelRotation,
  labelIntersectAction,
  sliceAmount = 10, // Default to 10 if not provided
}) => {
  const [chartData, setChartData] = useState([]);
  const { currentMode } = useStateContext(); // Access currentMode from context

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders`
        );

        // Limit the data to the passed sliceAmount
        const limitedData = data.slice(0, sliceAmount);

        // Process data to group by location and date
        const groupedData = limitedData.reduce((acc, order) => {
          const location = order.location;
          const date = new Date(order.createdAt).toLocaleDateString(); // Group by date
          const retailPrice = order.retailPrice || 0;
          const discountedPrice = order.discountedPrice || 0;

          if (!acc[location]) {
            acc[location] = {};
          }

          if (!acc[location][date]) {
            acc[location][date] = { retail: 0, discounted: 0 };
          }

          acc[location][date].retail += retailPrice;
          acc[location][date].discounted += discountedPrice;

          return acc;
        }, {});

        // Transform grouped data into a series-friendly format
        const seriesData = [];
        Object.keys(groupedData).forEach((location) => {
          Object.keys(groupedData[location]).forEach((date) => {
            seriesData.push({
              x: `${location} - ${date}`,
              retail: groupedData[location][date].retail,
              discounted: groupedData[location][date].discounted,
            });
          });
        });

        setChartData(seriesData);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    fetchData();
  }, [sliceAmount]); // Add sliceAmount to the dependency array to fetch data when it changes

  const priceStackedPrimaryXAxis = {
    valueType: "Category",
    title: "Location - Date",
    labelRotation, // Pass labelRotation as a prop
    labelIntersectAction, // Pass labelIntersectAction as a prop
    labelStyle: { color: currentMode === "Dark" ? "#E5E7EB" : "#333" }, // Axis label color
    titleStyle: { color: currentMode === "Dark" ? "#E5E7EB" : "#333" }, // Axis title color
  };

  const priceStackedPrimaryYAxis = {
    title: "Total Price",
    titleStyle: { color: currentMode === "Dark" ? "#E5E7EB" : "#333" }, // Y-Axis title color
    labelStyle: { color: currentMode === "Dark" ? "#E5E7EB" : "#333" }, // Y-Axis label color
  };

  const priceStackedCustomSeries = [
    {
      type: "StackingColumn",
      name: "Retail Price",
      dataSource: chartData,
      xName: "x",
      yName: "retail",
      cornerRadius: { topLeft: 5, topRight: 5 },
    },
    {
      type: "StackingColumn",
      name: "Discounted Price",
      dataSource: chartData,
      xName: "x",
      yName: "discounted",
      cornerRadius: { topLeft: 5, topRight: 5 },
    },
  ];

  return (
    <ChartComponent
      width={width}
      height={height}
      id="priceCharts"
      legendSettings={{
        background: "transparent", // Make the legend background transparent
        textStyle: { color: currentMode === "Dark" ? "#E5E7EB" : "#333" }, // Dynamically change legend text color based on theme
      }}
      primaryXAxis={priceStackedPrimaryXAxis}
      primaryYAxis={priceStackedPrimaryYAxis}
      chartArea={{ border: { width: 0 } }}
      tooltip={{ enable: true }}
    >
      <Inject services={[StackingColumnSeries, Category, Legend, Tooltip]} />
      <SeriesCollectionDirective>
        {priceStackedCustomSeries.map((item, index) => (
          <SeriesDirective key={index} {...item} />
        ))}
      </SeriesCollectionDirective>
    </ChartComponent>
  );
};

export default Stacked;
