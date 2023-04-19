import { getStackedBarChartOptions } from '../../BarChart';
import { Column, EChartsOption } from './../../../interfaces';


export const getStackedLineChartOptions = (
    xAxisColumn: Column<string | number | null>,
    yAxisColumnList: Column<string | number | null>[],
    callbackFunc?: (eChartsOption: EChartsOption) => void
): EChartsOption => {
    let eChartsOption = getStackedBarChartOptions(xAxisColumn, yAxisColumnList);

    // change series type to line
    if (eChartsOption && eChartsOption.series) {
        eChartsOption.series = eChartsOption.series as any[];
        eChartsOption.series = eChartsOption.series.map((seriesItem: any) => {
            return {
                ...seriesItem,
                type: 'line',
                label: {
                    show: false
                },
            }
        })
    }

    if (callbackFunc) callbackFunc(eChartsOption);
    return eChartsOption;
}

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
