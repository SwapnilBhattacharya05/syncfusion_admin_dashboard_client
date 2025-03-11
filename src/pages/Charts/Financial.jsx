import { useEffect, useState } from "react";
import axios from "axios";
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  CandleSeries,
  Tooltip,
  Logarithmic,
  Zoom,
  Crosshair,
  Category,
} from "@syncfusion/ej2-react-charts";
import { useStateContext } from "../../contexts/ContextProvider";
import { Header } from "../../components";

const Financial = () => {
  const { currentMode } = useStateContext();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const { data: ordersData } = await axios.get(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders`
        );

        if (!Array.isArray(ordersData) || ordersData.length === 0) {
          console.warn("⚠️ No order data available!");
          return;
        }

        const groupedData = {};

        ordersData.forEach((order) => {
          const dateStr = new Date(order.createdAt).toISOString().split("T")[0]; // YYYY-MM-DD

          let retailPrice = Number(order.retailPrice);
          let discountedPrice = Number(order.discountedPrice);

          if (isNaN(retailPrice)) retailPrice = 0;
          if (isNaN(discountedPrice)) discountedPrice = 0;

          if (!groupedData[dateStr]) {
            groupedData[dateStr] = {
              x: dateStr,
              openingPrice: retailPrice,
              highestPrice: retailPrice,
              lowestPrice: discountedPrice,
              closingPrice: retailPrice,
            };
          } else {
            groupedData[dateStr].highestPrice = Math.max(
              groupedData[dateStr].highestPrice,
              retailPrice
            );
            groupedData[dateStr].lowestPrice = Math.min(
              groupedData[dateStr].lowestPrice,
              discountedPrice
            );
            groupedData[dateStr].closingPrice = retailPrice;
          }
        });

        const formattedData = Object.values(groupedData).sort(
          (a, b) => new Date(a.x) - new Date(b.x)
        );

        console.log("🔥 Updated Candlestick Chart Data:", formattedData);
        setChartData(formattedData);
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
      }
    };

    fetchFinancialData();
  }, []);

  // Set dynamic colors based on theme
  const axisLabelColor = currentMode === "Dark" ? "#E0E0E0" : "#333";
  const axisTitleColor = currentMode === "Dark" ? "#F5F5F5" : "#111"; // Slightly brighter title for contrast

  return (
    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <Header category="Financial" title="Order Price Trends" />
      <div className="w-full">
        <ChartComponent
          id="chart"
          primaryXAxis={{
            valueType: "Category",
            labelRotation: 45,
            labelIntersectAction: "Rotate45",
            majorGridLines: { width: 0 },
            labelStyle: { color: axisLabelColor }, // 🔥 Dynamic label color
          }}
          primaryYAxis={{
            title: "Price (USD)",
            titleStyle: { color: axisTitleColor }, // 🔥 Dynamic Y-Axis title color
            labelFormat: "${value}",
            valueType: "Logarithmic",
            majorGridLines: { width: 1 },
            lineStyle: { width: 0 },
            labelStyle: { color: axisLabelColor }, // 🔥 Dynamic label color
          }}
          chartArea={{ border: { width: 0 } }}
          tooltip={{ enable: true, shared: true }}
          crosshair={{
            enable: true,
            lineType: "Both",
            line: { width: 1, color: "gray" },
          }}
          background={currentMode === "Dark" ? "#33373E" : "#fff"}
        >
          <Inject
            services={[
              CandleSeries,
              Tooltip,
              Logarithmic,
              Crosshair,
              Zoom,
              Category,
            ]}
          />
          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={chartData}
              xName="x"
              open="openingPrice"
              close="closingPrice"
              low="lowestPrice"
              high="highestPrice"
              type="Candle"
              name="Price Trend"
              fill="#4CAF50"
              bearFillColor="#E74C3C"
              bullFillColor="#2ECC71"
            />
          </SeriesCollectionDirective>
        </ChartComponent>
      </div>
    </div>
  );
};

export default Financial;
