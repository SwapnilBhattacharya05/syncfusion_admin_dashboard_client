import {
  ColumnDirective,
  ColumnsDirective,
  Edit,
  Filter,
  GridComponent,
  Inject,
  Page,
  Selection,
  Sort,
  Toolbar,
} from "@syncfusion/ej2-react-grids";
import axios from "axios";
import { useEffect, useState } from "react";
import { Header } from "../components";
import { useStateContext } from "../contexts/ContextProvider";

const Customers = () => {
  const { currentColor, currentMode } = useStateContext();
  const [customersData, setCustomersData] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/customers`
        );

        // Status color mapping
        const statusColors = {
          Active: "#8BE78B",
          Pending: "#FB9678",
          Cancelled: "#FF5C8E",
        };

        // Transform data
        const formattedData = data.map((customer) => ({
          id: customer._id, // Using full ID for deletion
          name: customer.name,
          status: customer.status,
          statusColor: statusColors[customer.status] || "#CCCCCC",
          weeks: customer.weeks,
          yearlyAmountSpent:
            parseFloat(customer.yearlyAmountSpent?.$numberDecimal) || 0,
        }));

        setCustomersData(formattedData);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  // Custom template for status with a small dot
  const statusTemplate = (props) => (
    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <span
        style={{
          width: "8px",
          height: "8px",
          backgroundColor: props.statusColor,
          borderRadius: "50%",
          display: "inline-block",
        }}
      ></span>
      <span>{props.status}</span>
    </div>
  );

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
      <Header title="Customers" category="Page" />

      <GridComponent
        dataSource={customersData}
        allowPaging
        allowSorting
        toolbar={["Delete"]}
        editSettings={{ allowDeleting: true, allowEditing: true }}
        selectionSettings={{ type: "Multiple", mode: "Checkbox" }} // ✅ Enables row selection with checkboxes
        width="auto"
        style={{ backgroundColor: currentColor }}
      >
        <ColumnsDirective>
          <ColumnDirective type="checkbox" width="50" />{" "}
          {/* ✅ Adds checkbox column */}
          <ColumnDirective
            field="id"
            headerText="ID"
            width="100"
            textAlign="Center"
          />
          <ColumnDirective
            field="name"
            headerText="Name"
            width="150"
            textAlign="Center"
          />
          <ColumnDirective
            field="status"
            headerText="Status"
            width="50" // ✅ Reduced width
            textAlign="Center"
            template={statusTemplate}
          />
          <ColumnDirective
            field="weeks"
            headerText="Weeks"
            width="80"
            textAlign="Center"
          />
          <ColumnDirective
            field="yearlyAmountSpent"
            headerText="Yearly Spent"
            width="100"
            textAlign="Center"
            format="C2"
          />
        </ColumnsDirective>
        <Inject services={[Page, Toolbar, Selection, Edit, Sort, Filter]} />
      </GridComponent>
    </div>
  );
};

export default Customers;
