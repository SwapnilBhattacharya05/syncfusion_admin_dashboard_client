import { BsBoxSeam } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import { FiBarChart, FiShoppingCart, FiStar } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import { HiOutlineRefresh } from "react-icons/hi";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { LineChart, Pie, SparkLine, Stacked } from "../components";

import {
  ChartComponent,
  DateTime,
  Inject,
  Legend,
  SeriesCollectionDirective,
  SeriesDirective,
  SplineAreaSeries,
} from "@syncfusion/ej2-react-charts";

import axios from "axios";
import { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";

const Ecommerce = () => {
  const { currentColor, currentMode } = useStateContext();
  const [customersData, setCustomersData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [areaChartData, setAreaChartData] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/customers`
        );

        const formattedData = data.map((customer) => ({
          id: customer._id,
          name: customer.name,
          status: customer.status,
          statusColor: customer.status === "Active" ? "#8BE78B" : "#FB9678",
          weeks: customer.weeks,
          yearlyAmountSpent:
            parseFloat(customer.yearlyAmountSpent.$numberDecimal) || 0,
        }));

        setCustomersData(formattedData); // 👈 First, update state

        // Group data AFTER setting customersData
        const groupedData = {};
        const statusCategories = ["Pending", "Active", "Cancelled"];

        formattedData.forEach((customer) => {
          if (
            customer.weeks === null ||
            customer.weeks === undefined ||
            !customer.status
          )
            return;

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

        const formattedAreaChartData = Object.values(groupedData).sort(
          (a, b) => a.weeks - b.weeks
        );

        setAreaChartData(formattedAreaChartData); // 👈 Now update chart data
      } catch (error) {
        console.log(error);
      }
    };

    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders`
        );
        setOrdersData(data);

        // Sort by highest retail price & get top 5 products
        const sortedProducts = [...data]
          .sort((a, b) => b.retailPrice - a.retailPrice)
          .slice(0, 5);

        setTopProducts(sortedProducts);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCustomers();
    fetchOrders();
  }, []);

  const generateEcomPieChartData = () => {
    if (!ordersData || ordersData.length === 0) {
      return [];
    }

    // Calculate total retail price and total discounted price
    const totalRetailPrice = ordersData.reduce(
      (sum, order) => sum + (order.retailPrice || 0),
      0
    );
    const totalDiscountedPrice = ordersData.reduce(
      (sum, order) => sum + (order.discountedPrice || 0),
      0
    );

    return [
      {
        x: "Retail Price",
        y: totalRetailPrice,
        text: `$${totalRetailPrice.toFixed(2)}`,
      },
      {
        x: "Discounted Price",
        y: totalDiscountedPrice,
        text: `$${totalDiscountedPrice.toFixed(2)}`,
      },
    ];
  };

  // Generate data
  const ecomPieChartData = generateEcomPieChartData();

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

  // Function to calculate total yearly earnings
  const getTotalYearlyEarnings = () => {
    const totalYearlyAmountSpent = customersData.reduce(
      (total, customer) => total + customer.yearlyAmountSpent,
      0
    );

    return formatNumber(totalYearlyAmountSpent);
  };

  // Function to format large numbers dynamically
  const formatNumber = (num) => {
    const formatter = new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 1,
    });
    return formatter.format(num);
  };

  // Function to calculate and format total retail price
  const getTotalRetailPrice = formatNumber(
    ordersData.reduce((sum, order) => sum + (order.retailPrice || 0), 0)
  );

  // Function to calculate and format total discount price
  const getTotalDiscountPrice = formatNumber(
    ordersData.reduce((sum, order) => sum + (order.discountedPrice || 0), 0)
  );

  // Function to calculate discount percentage
  const getDiscountPercentage = () => {
    const totalRetail = ordersData.reduce(
      (sum, order) => sum + (order.retailPrice || 0),
      0
    );
    const totalDiscount = ordersData.reduce(
      (sum, order) => sum + (order.discountedPrice || 0),
      0
    );

    if (totalRetail === 0) return "0%"; // Avoid division by zero

    const discountPercent = ((1 - totalDiscount / totalRetail) * 100).toFixed(
      1
    ); // Keep one decimal
    return `${discountPercent}%`;
  };

  // Calculate total Sales based on status "Complete"
  const salesTotal = ordersData
    .filter((order) => order.status === "Complete")
    .reduce((total, order) => total + order.status.length, 0);

  // Calculate total Refunds based on status "Return"
  const refundsTotal = ordersData
    .filter((order) => order.status === "Return")
    .reduce((total, order) => total + order.status.length, 0);

  // Find the customer who spent the most
  const topCustomer =
    customersData.length > 0
      ? customersData.reduce((prev, current) =>
          prev.yearlyAmountSpent > current.yearlyAmountSpent ? prev : current
        )
      : { name: "No Customers", yearlyAmountSpent: 0 };

  // Find the product with best sale which has most value even after being discounted
  const bestSeller =
    ordersData.length > 0
      ? ordersData.reduce((prev, current) =>
          prev.discountedPrice > current.discountedPrice ? prev : current
        )
      : { name: "No Products", discountedPrice: 0 };

  // Generate Sparkline Data (Mocked Trend)
  const sparklineData = ordersData.slice(0, 10).map((order, index) => ({
    xval: index + 1,
    yval: order.retailPrice,
  }));

  const getBestSellingProduct = (orders) => {
    if (!orders || orders.length === 0) return null; // Handle empty data

    // Step 1: Count occurrences of each product name
    const productCounts = orders.reduce((acc, order) => {
      acc[order.productName] = (acc[order.productName] || 0) + 1;
      return acc;
    }, {});

    // Step 2: Find the product with the highest count
    return Object.entries(productCounts).reduce((best, current) =>
      current[1] > best[1] ? current : best
    );
  };

  const [bestSellerProduct, bestSellerCount] = getBestSellingProduct(
    ordersData
  ) || ["No product", 0];

  return (
    <div className="mt-24">
      <div className="flex flex-wrap lg:flex-nowrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-400">Earnings</p>
              <p className="text-2xl">${getTotalYearlyEarnings()}</p>
            </div>
          </div>
        </div>

        <div className="flex m-3 flex-wrap justify-center gap-1.5 items-center">
          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl">
            <button
              type="button"
              style={{
                color: "#03c9d7",
                backgroundColor: "#e5fafb",
              }}
              className="text-2xl opacity-[0.9] p-4 rounded-full hover:drop-shadow-xl"
            >
              <MdOutlineSupervisorAccount />
            </button>
            <p className="mt-3">
              <span className="text-lg font-semibold">
                {customersData.length}
              </span>
            </p>
            <p className="text-sm text-gray-400 mt-1">Customers</p>
          </div>
          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl">
            <button
              type="button"
              style={{
                color: "rgb(255, 244, 229)",
                backgroundColor: "rgb(254, 201, 15)",
              }}
              className="text-2xl opacity-[0.9] p-4 rounded-full hover:drop-shadow-xl"
            >
              <BsBoxSeam />
            </button>
            <p className="mt-3">
              <span className="text-lg font-semibold">{ordersData.length}</span>
            </p>
            <p className="text-sm text-gray-400 mt-1">Products</p>
          </div>
          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl">
            <button
              type="button"
              style={{
                color: "rgb(228, 106, 118)",
                backgroundColor: "rgb(255, 244, 229)",
              }}
              className="text-2xl opacity-[0.9] p-4 rounded-full hover:drop-shadow-xl"
            >
              <FiBarChart />
            </button>
            <p className="mt-3">
              <span className="text-lg font-semibold">{salesTotal}</span>
            </p>
            <p className="text-sm text-gray-400 mt-1">Sales</p>
          </div>
          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl">
            <button
              type="button"
              style={{
                color: "rgb(0, 194, 146)",
                backgroundColor: "rgb(235, 250, 242)",
              }}
              className="text-2xl opacity-[0.9] p-4 rounded-full hover:drop-shadow-xl"
            >
              <HiOutlineRefresh />
            </button>
            <p className="mt-3">
              <span className="text-lg font-semibold">{refundsTotal}</span>
            </p>
            <p className="text-sm text-gray-400 mt-1">Refunds</p>
          </div>
        </div>
      </div>

      {/* REVENUE SECTION */}
      <div className="flex gap-10 flex-wrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-4 rounded-2xl md:w-780">
          <div className="flex justify-between">
            <p className="font-semibold text-xl">Revenue Updates</p>
            <div className="flex items-center gap-4">
              <p className="flex items-center gap-2 text-gray-500 hover:drop-shadow-xl">
                <span>
                  <GoDotFill />
                </span>
                <span>Discounted Price</span>
              </p>

              <p className="flex items-center gap-2 text-green-400 hover:drop-shadow-xl">
                <span>
                  <GoDotFill />
                </span>
                <span>Retail Price</span>
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-10 flex-wrap justify-between">
            <div className="border-r-1 border-color m-4  pr-36">
              <div>
                <p>
                  <span className="text-3xl font-semibold">
                    ${getTotalRetailPrice}
                  </span>
                </p>
                <p className="text-gray-500 mt-1">Retail Price</p>
              </div>

              <div className="mt-8">
                <p>
                  <span className="text-3xl font-semibold">
                    ${getTotalDiscountPrice}
                  </span>
                  <span className="p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white bg-green-400 ml-3 text-xs">
                    {getDiscountPercentage()}
                  </span>
                </p>
                <p className="text-gray-500 mt-1">Discounted Price</p>
              </div>
            </div>

            <div>
              <Stacked width="320px" height="360px" />
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white dark:bg-secondary-dark-bg dark:text-gray-200 rounded-2xl md:w-400 p-8 m-3 flex flex-col gap-10">
            <div>
              <p className="text-2xl font-semibold ">
                $
                {formatNumber(
                  ordersData
                    .reduce(
                      (sum, order) => sum + (order.discountedPrice || 0),
                      0
                    )
                    .toFixed(2)
                )}
              </p>
              <p className="text-gray-400">Retail vs Discount</p>
            </div>

            <div className="w-80">
              <Pie
                id="pie-chart"
                data={ecomPieChartData}
                legendVisiblity={false}
                height="276px"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-10 m-4 flex-wrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
          <div className="flex justify-between items-center gap-2">
            <p className="text-xl font-semibold">Most Valuable Products</p>
          </div>
          <div className="mt-10 w-72 md:w-400">
            {topProducts.map((product) => (
              <div key={product._id} className="flex justify-between mt-4">
                <div className="flex gap-4">
                  <img
                    src={product.image[0]}
                    alt={product.productName}
                    className="w-12 h-12 rounded-lg"
                  />
                  <div>
                    <p className="text-md font-semibold">
                      {product.productName}
                    </p>
                    <p className="text-sm text-gray-400">
                      {formatNumber(product.retailPrice)}
                    </p>
                  </div>
                </div>
                <p className="text-green-600 font-semibold">
                  ${formatNumber(product.discountedPrice)}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-96 md:w-760">
          <div className="flex justify-between items-center gap-2 mb-10">
            <p className="text-xl font-semibold">
              Order Status Trends Across Locations
            </p>
            {/* <DropDown currentMode={currentMode} /> */}
          </div>
          <div className="md:w-full overflow-auto">
            <LineChart />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center">
        <div className="md:w-[615px] bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3">
          <div className="flex justify-between">
            <p className="text-xl font-semibold">Products Stats</p>
          </div>

          <div className="mt-10 ">
            <div className="flex justify-between mt-4 w-full">
              <div className="flex gap-4">
                <button
                  type="button"
                  style={{ background: "rgb(254, 201, 15)" }}
                  className="text-2xl hover:drop-shadow-xl text-white rounded-full p-3"
                >
                  <FaRegUser />
                </button>
                <div>
                  <p className="text-md font-semibold">Top Customer</p>
                  <p className="text-sm text-gray-400">{topCustomer.name}</p>
                </div>
              </div>

              <p className={`text-green-400`}>
                ${topCustomer.yearlyAmountSpent.toFixed(2)}
              </p>
            </div>

            <div className="flex justify-between mt-4 w-full">
              <div className="flex gap-4">
                <button
                  type="button"
                  className="text-2xl hover:drop-shadow-xl text-white rounded-full p-3"
                  style={{ background: "#FB9678" }}
                >
                  <FiShoppingCart />
                </button>
                <div>
                  <p className="text-md font-semibold">Best Seller</p>
                  <p className="text-sm text-gray-400 text-ellipsis overflow-hidden text-nowrap w-40">
                    {bestSeller.productName}
                  </p>
                </div>
              </div>
              <p className={`text-green-400`}>${bestSeller.discountedPrice}</p>
            </div>
            <div className="flex justify-between mt-4 w-full">
              <div className="flex gap-4">
                <button
                  type="button"
                  className="text-2xl hover:drop-shadow-xl text-white rounded-full p-3"
                  style={{ background: "#00C292" }}
                >
                  <FiStar />
                </button>
                <div>
                  <p className="text-md font-semibold">Most Ordered</p>
                  <p className="text-sm text-gray-400 text-ellipsis overflow-hidden text-nowrap w-40">
                    {bestSellerProduct}
                  </p>
                </div>
              </div>
              <p className={`text-green-400`}>{bestSellerCount}</p>
            </div>

            <div className="mt-4 flex justify-center">
              <SparkLine
                currentColor={currentColor}
                id="area-sparkLine"
                height="160px"
                type="Area"
                data={sparklineData}
                width="420px"
                color="rgb(242, 252, 253)"
              />
            </div>
          </div>
        </div>

        <div className="w-[615px] bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3">
          <div className="flex justify-between">
            <p className="text-xl font-semibold">
              Customer Subscription Status Over Time
            </p>
          </div>
          <div className="mt-10">
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
                    dataSource={areaChartData}
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
        </div>
      </div>
    </div>
  );
};
export default Ecommerce;
