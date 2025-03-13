import { useEffect, useState } from "react";
import axios from "axios";
import { Header, Pie as PieChart } from "../../components";

const Pie = () => {
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

        // Group orders by brand
        const brandMap = {};
        ordersData.forEach((order) => {
          if (!order.brand) return;

          if (!brandMap[order.brand]) {
            brandMap[order.brand] = { x: order.brand, y: 0 };
          }
          brandMap[order.brand].y += 1;
        });

        // Convert to array and sort by order count (descending)
        let formattedData = Object.values(brandMap).sort((a, b) => b.y - a.y);

        // Keep only top 20 brands
        formattedData = formattedData.slice(0, 20);


        setChartData(formattedData);
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <Header category="Pie" title="Brand-wise Order Breakdown" />
      <div className="w-full">
        <PieChart
          id="chart-pie"
          legendVisiblity={true}
          data={chartData} // ✅ Pass fetched data
          height="500px"
        />
      </div>
    </div>
  );
};

export default Pie;
