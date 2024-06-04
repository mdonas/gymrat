import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import Stack from "@mui/material/Stack";

const chartsParams = {
  margin: { bottom: 20, left: 25, right: 5 },
  height: 300,
};

export default function BasicColor({ series, updateSeries }) {
  console.log(series);
  const [selectedData, setSelectedData] = React.useState(series || 0);

  React.useEffect(() => {
    setSelectedData(series);
  }, [series]);

  const handleChange = (newSeries) => {
    updateSeries(newSeries);
  };
  return (
    <Stack
      direction="column"
      spacing={2}
      alignItems="center"
      sx={{ width: "100%" }}
    >
      <LineChart
        {...chartsParams}
        sx={{ backgroundColor: "#f0f0f0", padding: "10px" }}
        series={[
          {
            data: selectedData,
            color: "#4e79a7", // puedes cambiar este color por defecto
            domain: ["auto", "auto"],
          },
        ]}
        yAxis={[{ min: 5, max: 80 }]}
      />
    </Stack>
  );
}
