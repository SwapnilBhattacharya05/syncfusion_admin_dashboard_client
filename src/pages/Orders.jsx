import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Resize,
  Sort,
  ContextMenu,
  Filter,
  Page,
  ExcelExport,
  PdfExport,
  Edit,
  Inject,
} from "@syncfusion/ej2-react-grids";

import { ordersData, contextMenuItems, ordersGrid } from "../assets/dummy";
import { Header } from "../components";
import { useStateContext } from "../contexts/ContextProvider";

const Orders = () => {
  const { currentColor, currentMode } = useStateContext();

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
        contextMenuItems={contextMenuItems}
        allowExcelExport
        allowPdfExport
        editSettings={editing}
        style={{ backgroundColor: currentColor }}
      >
        <ColumnsDirective>
          {ordersGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
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
