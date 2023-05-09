import { swapXAxisAndYAxis } from "../../../Utils";
import { AnalysisColumn, Column, EChartsOption } from "../../../interfaces";
import { getStackedBarChartOptions } from "../StackedBarChart";

export const getStackedHorizontalBarChartOptions = (
    yAxisColumn: Column<string | number | null>,
    xAxisColumnList: AnalysisColumn<string | number | null>[],
    callbackFunc?: (eChartsOption: EChartsOption) => void
  ): EChartsOption => {
    let eChartsOption = getStackedBarChartOptions(yAxisColumn, xAxisColumnList);
    swapXAxisAndYAxis(eChartsOption);
  
    if (callbackFunc) callbackFunc(eChartsOption);
    return eChartsOption;
  }