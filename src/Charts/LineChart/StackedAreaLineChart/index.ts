import { Column, EChartsOption } from "../../../interfaces";
import { getStackedLineChartOptions } from "../StackedLineChart";

export const getStackedAreaLineChartOptions = (
    xAxisColumn: Column<string | number | null>,
    yAxisColumnList: Column<string | number | null>[],
    callbackFunc?: (eChartsOption: EChartsOption) => void
): EChartsOption => {
    let eChartsOption = getStackedLineChartOptions(xAxisColumn, yAxisColumnList);

    // add series areaStyle 
    if (eChartsOption && eChartsOption.series) {
        eChartsOption.series = eChartsOption.series as any[];
        eChartsOption.series = eChartsOption.series.map(seriesItem => {
            return {
                ...seriesItem,
                areaStyle: {},
            }
        })
    }

    if (callbackFunc) callbackFunc(eChartsOption);
    return eChartsOption;
}
