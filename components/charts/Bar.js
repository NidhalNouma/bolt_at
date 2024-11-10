import React, { Fragment, useMemo, useState, useEffect } from "react";
import {
  LineChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PropTypes from "prop-types";
import { useTheme } from "../../contexts/ThemeContext";
import TooltipComponent from "./Tooltips";
import { addAlpha } from "../../utils/functions";
import { curveCardinal } from "d3-shape";
import moment from "moment";

const RechartJSLine = ({
  data: entryData,
  title,
  className,
  chartId,
  defaultColor,
  minYAxis = null,
}) => {
  const { theme } = useTheme();
  const numLabels = 6; // You can change this value as needed

  const [data, setData] = useState([]);

  useEffect(() => {
    if (!entryData || entryData.length === 0) {
      let labels = Array.from({ length: numLabels }, (_, i) =>
        moment()
          .subtract(numLabels - 1 - i, "days")
          .format("YYYY-MM-DD")
      );

      let data = Array(numLabels).fill(0);
      let label = "";
      let color = defaultColor;

      setData([{ labels, label, data, color }]);
    } else setData(entryData);
  }, [entryData]);

  // Calculate max and min for Y-axis
  const maxAbsValue = Math.max(
    ...data.flatMap((dataset) =>
      dataset.data.map((value) => (value ? Math.abs(value) : 0))
    )
  );
  const margin = maxAbsValue * 0.1;
  const yAxisMax = maxAbsValue + margin;
  let yAxisMin = -maxAbsValue - margin;
  if (minYAxis !== null) yAxisMin = minYAxis;

  const processedData = useMemo(() => {
    // Function to generate the last `numLabels` days with data set to 0
    const generateEmptyData = () => {
      return Array.from({ length: numLabels }, (_, i) => {
        const label = moment()
          .subtract(numLabels - 1 - i, "days")
          .format("YYYY-MM-DD");
        return {
          label,
          value: 0,
        };
      });
    };

    // Check if data is empty or not available
    if (!data || data.length === 0) {
      return generateEmptyData();
    }
    // Function to fill out labels and data arrays
    const fillLabelsAndData = (labels, data) => {
      const filledLabels = [...labels];
      const filledData = [...data];

      // If there are fewer than numLabels, fill in the missing labels and data points
      while (filledLabels.length < numLabels) {
        const lastLabel =
          filledLabels.length > 0
            ? moment(filledLabels[0], "YYYY-MM-DD")
            : moment(); // If no labels exist, use the current date as a reference

        const newLabel = lastLabel.subtract(1, "days").format("YYYY-MM-DD");
        filledLabels.unshift(newLabel);
        filledData.unshift(0);
      }

      return { labels: filledLabels, data: filledData };
    };

    // Process each dataset in the data array
    const filledData = data.map((dataset) => {
      if (dataset.labels.length === 0) {
        // If labels array is empty, generate the last `numLabels` days with data set to 0
        const labels = Array.from({ length: numLabels }, (_, i) =>
          moment()
            .subtract(numLabels - 1 - i, "days")
            .format("YYYY-MM-DD")
        );
        const data = Array(numLabels).fill(0);
        return { ...dataset, labels, data };
      }

      // Fill out labels and data arrays if they are less than numLabels
      const { labels, data: filledData } = fillLabelsAndData(
        dataset.labels,
        dataset.data
      );
      return { ...dataset, labels, data: filledData };
    });

    // Transform the filled data into the desired format
    const transformedData = filledData[0].labels.map((label, index) => {
      const dataPoint = { label };
      filledData.forEach((dataset) => {
        dataPoint[dataset.label] = dataset.data[index];
      });
      return dataPoint;
    });

    return transformedData;
  }, [data]);

  // console.log(processedData, data);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <TooltipComponent
          visible={true}
          title={label}
          labels={payload.map((item) => ({
            text: `${item.name}: ${item.value}`,
            backgroundColor: item.fill,
            borderColor: item.stroke,
          }))}
        />
      );
    }

    return null;
  };

  const cardinal = curveCardinal.tension(0.9);
  // console.log(cardinal);

  return (
    <article>
      {title}
      {theme && (
        <Fragment>
          <div className={className}>
            <ResponsiveContainer className={`w-full h-full `}>
              <BarChart data={processedData}>
                <XAxis
                  hide={true}
                  axisLine={false}
                  dataKey="label"
                  tickLine={false}
                  tick={(props) => {
                    const { x, y, payload } = props;
                    return (
                      <text
                        className="text-xs fill-text/60 text-center w-full"
                        x={x}
                        y={y}
                        dy={16}
                        textAnchor="end"
                      >
                        {new Date(payload.value).getMonth() +
                          1 +
                          "/" +
                          new Date(payload.value).getDate()}
                        {/* {payload.value} */}
                      </text>
                    );
                  }}
                />
                <YAxis hide={true} domain={[yAxisMin, yAxisMax]} />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: addAlpha(
                      getComputedStyle(
                        document.documentElement
                      ).getPropertyValue("--chart-text-color"),
                      0.2
                    ),
                    strokeWidth: 1,
                    strokeDasharray: "5 5",

                    fill: "transparent",
                  }}
                />
                {data.map((dataset, index) => (
                  <Bar
                    key={dataset.label}
                    dataKey={dataset.label}
                    radius={[10, 10, 0, 0]}
                    fill={
                      dataset.color ||
                      defaultColor ||
                      addAlpha(
                        getComputedStyle(
                          document.documentElement
                        ).getPropertyValue("--chart-text-color"),
                        1
                      )
                    }
                    strokeWidth={2}
                    // barSize={10}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="h-[0.02rem] rounded-full w-full bg-text/30"></div>
          <div className="w-full flex items-center justify-between mt-0.5">
            <span className="text-xs text-text/60">
              {new Date(processedData[0].label).getMonth()
                ? new Date(processedData[0].label).getMonth() +
                  1 +
                  "/" +
                  new Date(processedData[0].label).getDate()
                : processedData[0].label}
            </span>
            <span className="text-xs text-text/60">
              {new Date(
                processedData[processedData.length - 1].label
              ).getMonth()
                ? new Date(
                    processedData[processedData.length - 1].label
                  ).getMonth() +
                  1 +
                  "/" +
                  new Date(
                    processedData[processedData.length - 1].label
                  ).getDate()
                : processedData[processedData.length - 1].label}
            </span>
          </div>
        </Fragment>
      )}
    </article>
  );
};

RechartJSLine.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      labels: PropTypes.arrayOf(PropTypes.string).isRequired,
      color: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(PropTypes.number).isRequired,
    })
  ).isRequired,
  // chartId: PropTypes.string.isRequired,
};

export default RechartJSLine;