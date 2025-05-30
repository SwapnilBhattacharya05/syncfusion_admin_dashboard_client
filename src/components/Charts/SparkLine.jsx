import {
  SparklineComponent,
  Inject,
  SparklineTooltip,
} from "@syncfusion/ej2-react-charts";

const SparkLine = ({ id, currentColor, color, type, height, width, data }) => {
  return (
    <SparklineComponent
      id={id}
      height={height}
      width={width}
      lineWidth={1}
      valueType="Numeric"
      fill={color}
      border={{ color: currentColor, width: 2 }}
      dataSource={data}
      xName="xval"
      yName="yval"
      type={type}
      tooltipSettings={{
        visible: true,
        format: "sale ${yval}",
        trackLineSettings: {
          visible: true,
          color: currentColor,
        },
      }}
    >
      <Inject services={[SparklineTooltip]} />
    </SparklineComponent>
  );
};
export default SparkLine;
