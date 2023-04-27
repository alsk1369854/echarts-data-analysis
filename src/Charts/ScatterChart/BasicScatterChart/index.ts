import { Column, EChartsOption } from "../../..";
import { getStackedLineChartOptions } from "../../LineChart"

export const getBasicScatterChartOptions = (
    xAxisColumn: Column<string | number | null>,
    yAxisColumn: Column<string | number | null>,
    callbackFunc?: (eChartsOption: EChartsOption) => void
): EChartsOption => {
    let eChartsOption = getStackedLineChartOptions(xAxisColumn, [yAxisColumn]);

    // change tooltip axisPointer type to "cross"
    eChartsOption.tooltip = {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        }
    }

    // update series
    // remove line chart series line width
    if (eChartsOption && eChartsOption.series) {
        eChartsOption.series = eChartsOption.series as any[];
        eChartsOption.series = eChartsOption.series.map(seriesItem => {
            return {
                ...seriesItem,
                symbolSize: 10,
                symbol: 'circle',
                label: {
                    show: false
                },
                lineStyle: {
                    width: 0
                },
            }
        })
    }

    if (callbackFunc) callbackFunc(eChartsOption);
    return eChartsOption;
}
