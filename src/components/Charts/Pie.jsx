import { useEffect, useState } from "react";
import {
  AccumulationChartComponent,
  AccumulationSeriesCollectionDirective,
  AccumulationSeriesDirective,
  AccumulationLegend,
  PieSeries,
  AccumulationDataLabel,
  Inject,
  AccumulationTooltip,
  AccumulationSelection,
} from "@syncfusion/ej2-react-charts";

import { useStateContext } from "../../contexts/ContextProvider";

const Doughnut = ({ legendVisiblity, data, height}) => {
  const { currentMode } = useStateContext();
  const [chartData, setChartData] = useState(data || []);

  useEffect(() => {
    if (data && data.length > 0) {
      setChartData(data);
    }
  }, [data]);

  return (
      <AccumulationChartComponent
        id="pie-chart"
        height={height} // ✅ Accept dynamic height
        legendSettings={{
          visible: legendVisiblity,
          background: "transparent",
          textStyle: { color: currentMode === "Dark" ? "#E5E7EB" : "#000" },
          maximumLabelWidth: 120,
        }}
        background={currentMode === "Dark" ? "#33373E" : "#fff"}
        tooltip={{ enable: true }}
      >
        <Inject
          services={[
            AccumulationLegend,
            PieSeries,
            AccumulationDataLabel,
            AccumulationTooltip,
            AccumulationSelection,
          ]}
        />
        <AccumulationSeriesCollectionDirective>
          <AccumulationSeriesDirective
            name="Orders"
            dataSource={chartData}
            xName="x"
            yName="y"
            innerRadius="40%"
            startAngle={0}
            endAngle={360}
            radius="70%"
            explode
            explodeOffset="10%"
            explodeIndex={2}
            dataLabel={{
              visible: true,
              name: "percentage",
              position: "Inside",
              font: {
                fontWeight: "600",
                color: currentMode === "Dark" ? "#E5E7EB" : "#000",
              },
            }}
          />
        </AccumulationSeriesCollectionDirective>
      </AccumulationChartComponent>
  );
};

export default Doughnut;
