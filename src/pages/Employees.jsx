import { useEffect, useState } from "react";
import axios from "axios";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Search,
  Inject,
  Toolbar,
} from "@syncfusion/ej2-react-grids";
import { Header } from "../components";
import { useStateContext } from "../contexts/ContextProvider";

const Employees = () => {
  const { currentColor, currentMode } = useStateContext();
  const [employeesData, setEmployeesData] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/employees`
        );

        // Transform data to match Syncfusion Grid
        const formattedData = data.map((employee) => ({
          id: employee._id.slice(0, 5), // ✅ Slicing ID to 5 characters
          name: employee.name,
          education: employee.education,
          age: employee.age,
          gender: employee.gender,
        }));

        setEmployeesData(formattedData);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

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
      <Header title="Employees" category="Page" />

      <GridComponent
        dataSource={employeesData}
        allowPaging
        allowSorting
        toolbar={["Search"]}
        width="auto"
        style={{ backgroundColor: currentColor }}
      >
        <ColumnsDirective>
          <ColumnDirective
            field="id"
            headerText="ID"
            width="150"
            textAlign="Center"
          />
          <ColumnDirective
            field="name"
            headerText="Name"
            width="150"
            textAlign="Center"
          />
          <ColumnDirective
            field="education"
            headerText="Education"
            width="150"
            textAlign="Center"
          />
          <ColumnDirective
            field="age"
            headerText="Age"
            width="100"
            textAlign="Center"
          />
          <ColumnDirective
            field="gender"
            headerText="Gender"
            width="120"
            textAlign="Center"
          />
        </ColumnsDirective>
        <Inject services={[Page, Search, Toolbar]} />
      </GridComponent>
    </div>
  );
};

export default Employees;
