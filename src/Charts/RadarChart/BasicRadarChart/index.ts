import { CalculateTypeViewText, createAnalysisColumn } from "../../../Utils";
import { getChartOptionTitle } from "../../../Utils/ChartUtil";
import { AnalysisColumn, Column, EChartsOption } from "../../../interfaces";

export const DEFAULT_RADAR_CHART_OPTIONS = {
    title: {
        text: 'Basic Radar Chart'
    },
    tooltip: {
        trigger: 'item',
        position: "right"
    },
    legend: {
        data: ['Allocated Budget', 'Actual Spending']
    },
    radar: {
        indicator: [
            { name: 'Sales', max: 6500 },
            { name: 'Administration', max: 16000 },
            { name: 'Information Technology', max: 30000 },
            { name: 'Customer Support', max: 38000 },
            { name: 'Development', max: 52000 },
            { name: 'Marketing', max: 25000 }
        ]
    },
    series: [
        {
            type: 'radar',
            symbol: 'none',
            emphasis: {
                focus: "self",
            },
            data: [
                {
                    value: [4200, 3000, 20000, 35000, 50000, 18000],
                    name: 'Allocated Budget'
                },
                {
                    value: [5000, 14000, 28000, 26000, 42000, 21000],
                    name: 'Actual Spending'
                }
            ]
        }
    ]
};

export const getRadarChartOptions = (
    categoryColumn: Column,
    yAxisColumnList: Column[],
    callbackFunc?: (eChartsOption: EChartsOption) => void
): EChartsOption => {
    // init return value
    let eChartsOption: EChartsOption = { ...DEFAULT_RADAR_CHART_OPTIONS } as EChartsOption;

    // create analysis column
    const categoryAnalysisColumn: AnalysisColumn = createAnalysisColumn(categoryColumn);
    const yAxisAnalysisColumnList: AnalysisColumn[] = yAxisColumnList.map(column => {
        return createAnalysisColumn(column);
    })

    // update title
    let newTitle: any = {
        text: getChartOptionTitle(categoryAnalysisColumn, yAxisAnalysisColumnList)
    }
    eChartsOption.title = newTitle;

    // update legend
    let newLegend: any = {
        data: yAxisAnalysisColumnList.map((column: Column) => column.title)
    }
    eChartsOption.legend = newLegend;


    if (callbackFunc) callbackFunc(eChartsOption);
    return eChartsOption;
}