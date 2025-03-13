import {
  ColumnDirective,
  ColumnsDirective,
  ContextMenu,
  Edit,
  ExcelExport,
  Filter,
  GridComponent,
  Inject,
  Page,
  PdfExport,
  Resize,
  Sort,
} from "@syncfusion/ej2-react-grids";
import axios from "axios";
import { useEffect, useState } from "react";

import { Header } from "../components";
import { useStateContext } from "../contexts/ContextProvider";

const Orders = () => {
  const { currentColor, currentMode } = useStateContext();
  const [ordersData, setOrdersData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders`
        );

        const formattedData = data.map((order) => {
          const randomImage =
            order.image?.length > 0
              ? order.image[Math.floor(Math.random() * order.image.length)] // Get a random image
              : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/624px-No-Image-Placeholder.svg.png";

          return {
            orderID: order._id,
            productName: order.productName || "Unknown Product",
            image: randomImage,
            status: order.status,
            location: order.location,
            customerName: order.customerId?.name || "Unknown",
            brand: order.brand || "Unknown",
            discountedPrice: order.discountedPrice
              ? parseFloat(order.discountedPrice)
              : 0, // ✅ Replacing yearlyAmountSpent with discountedPrice
          };
        });

        setOrdersData(formattedData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const editing = { allowDeleting: true, allowEditing: true };

  return (
    <div
      className={`m-2 md:m-10 p-2 md:p-10 rounded-3xl ${
        currentMode === "Dark" ? "dark-mode" : "light-mode"
      }`}
      style={{
        backgroundColor: currentMode === "Dark" ? "#33373E" : "white",
        color: currentMode === "Dark" ? "#E5E7EB" : "black",
      }}
    >
      <Header title="Orders" category="Page" />

      <GridComponent
        id="gridcomp"
        dataSource={ordersData}
        allowPaging
        allowSorting
        allowExcelExport
        allowPdfExport
        editSettings={editing}
        style={{ backgroundColor: currentColor }}
      >
        <ColumnsDirective>
          <ColumnDirective
            field="image"
            headerText="Image"
            textAlign="Center"
            width="130"
            template={(props) => (
              <img
                src={props.image}
                alt="Product"
                className="w-12 h-12 rounded-md mx-auto shadow-md"
              />
            )}
          />
          <ColumnDirective
            field="productName"
            headerText="Product Name"
            width="200"
            textAlign="Center"
          />
          <ColumnDirective
            field="discountedPrice"
            headerText="Price"
            format="C2"
            textAlign="Center"
            width="120"
          />
          <ColumnDirective
            field="brand"
            headerText="Brand"
            width="120"
            textAlign="Center"
          />
          <ColumnDirective
            field="customerName"
            headerText="Customer"
            width="150"
            textAlign="Center"
          />
          <ColumnDirective
            field="status"
            headerText="Status"
            width="120"
            textAlign="Center"
            template={(props) => {
              const statusColors = {
                return: "#FB9678",
                complete: "#8BE78B",
                pending: "#03C9D7",
                cancelled: "#FF5C8E",
              };

              return (
                <span
                  className="px-2 py-1 rounded-lg text-white"
                  style={{
                    backgroundColor:
                      statusColors[props.status.toLowerCase()] || "red",
                  }}
                >
                  {props.status}
                </span>
              );
            }}
          />
          <ColumnDirective
            field="location"
            headerText="Location"
            width="150"
            textAlign="Center"
          />
        </ColumnsDirective>

        <Inject
          services={[
            Resize,
            Sort,
            ContextMenu,
            Filter,
            Page,
            ExcelExport,
            Edit,
            PdfExport,
          ]}
        />
      </GridComponent>
    </div>
  );
};

export default Orders;
