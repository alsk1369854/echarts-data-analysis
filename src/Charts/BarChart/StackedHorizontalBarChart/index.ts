import { swapXAxisAndYAxis } from "../../../Utils";
import { Column, EChartsOption } from "../../../interfaces";
import { getStackedBarChartOptions } from "../StackedBarChart";

export const getStackedHorizontalBarChartOptions = (
    yAxisColumn: Column<string | number | null>,
    xAxisColumnList: Column<string | number | null>[],
    callbackFunc?: (eChartsOption: EChartsOption) => void
  ): EChartsOption => {
    let eChartsOption = getStackedBarChartOptions(yAxisColumn, xAxisColumnList);
    swapXAxisAndYAxis(eChartsOption);
  
    if (callbackFunc) callbackFunc(eChartsOption);
    return eChartsOption;
  }