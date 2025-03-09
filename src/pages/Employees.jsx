import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Search,
  Inject,
  Toolbar,
} from "@syncfusion/ej2-react-grids";

import { employeesData, employeesGrid } from "../assets/dummy";
import { Header } from "../components";
import { useStateContext } from "../contexts/ContextProvider";

const Employees = () => {
    const { currentColor, currentMode } = useStateContext();
  
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
          {employeesGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
        <Inject services={[Page, Search, Toolbar]} />
      </GridComponent>
    </div>
  );
};
export default Employees;
