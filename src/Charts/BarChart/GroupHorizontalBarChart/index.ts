import { swapXAxisAndYAxis } from "../../../Utils";
import { AnalysisColumn, Column, EChartsOption } from "../../../interfaces";
import { getGroupBarChartOptions } from "../GroupBarChart";

export const getGroupHorizontalBarChart = (
    yAxisColumn: Column<string | number | null>,
    xAxisColumnList: AnalysisColumn<string | number | null>[],
    callbackFunc?: (eChartsOption: EChartsOption) => void
): EChartsOption => {
    let eChartsOption = getGroupBarChartOptions(yAxisColumn, xAxisColumnList);
    swapXAxisAndYAxis(eChartsOption);

    if (callbackFunc) callbackFunc(eChartsOption);
    return eChartsOption;
}