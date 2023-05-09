import { getStackedBarChartOptions } from '../../BarChart';
import { AnalysisColumn, Column, EChartsOption } from './../../../interfaces';


export const getStackedLineChartOptions = (
    xAxisColumn: Column<string | number | null>,
    yAxisColumnList: AnalysisColumn<string | number | null>[],
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

