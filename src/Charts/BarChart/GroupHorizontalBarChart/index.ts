import { swapXAxisAndYAxis } from "../../../Utils";
import { Column, EChartsOption } from "../../../interfaces";
import { getGroupBarChartOptions } from "../GroupBarChart";

export const getGroupHorizontalBarChart = (
    yAxisColumn: Column<string | number | null>,
    xAxisColumnList: Column<string | number | null>[],
    callbackFunc?: (eChartsOption: EChartsOption) => void
): EChartsOption => {
    let eChartsOption = getGroupBarChartOptions(yAxisColumn, xAxisColumnList);
    swapXAxisAndYAxis(eChartsOption);

    if (callbackFunc) callbackFunc(eChartsOption);
    return eChartsOption;
}