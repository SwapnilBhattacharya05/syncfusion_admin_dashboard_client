import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  Resize,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";

import { scheduleData } from "../assets/dummy";
import { Header } from "../components";
import { useStateContext } from "../contexts/ContextProvider";

const Calendar = () => {
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
      <Header title="Calendar" category="App" />

      <ScheduleComponent
        height="650px"
        eventSettings={{ dataSource: scheduleData }}
        selectedDate={new Date(2021, 0, 10)} // JUST FOR TEST PURPOSE
      >
        <Inject
          services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]}
        />
      </ScheduleComponent>
    </div>
  );
};
export default Calendar;
