import {
  KanbanComponent,
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-react-kanban";

import { kanbanData, kanbanGrid } from "../assets/dummy";
import { Header } from "../components";
import { useStateContext } from "../contexts/ContextProvider";

const Kanban = () => {
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
      <Header title="Kanban" category="App" />

      <KanbanComponent
        id="kanban"
        dataSource={kanbanData}
        cardSettings={{
          contentField: "Summary",
          headerField: "Id",
        }}
        keyField="Status"
      >
        <ColumnsDirective>
          {kanbanGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
      </KanbanComponent>
    </div>
  );
};
export default Kanban;
