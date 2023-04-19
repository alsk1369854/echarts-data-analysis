import { CalculateTypeViewText, createAnalysisColumn, createCategoryColumn, getColumnValueCategoryCorrespondsOtherColumnValueListMap } from "../../../Utils";
import { getChartOptionTitleText } from "../../../Utils/ChartUtil";
import { AnalysisColumn, Column, EChartsOption } from "../../../interfaces";
import { SeriesDataItem } from "./interfaces";

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
    categoryColumn: Column<string | number | null>,
    yAxisColumnList: Column<string | number | null>[],
    callbackFunc?: (eChartsOption: EChartsOption) => void
): EChartsOption => {
    // init return value
    let eChartsOption: EChartsOption = { ...DEFAULT_RADAR_CHART_OPTIONS } as EChartsOption;

    // create analysis column
    const categoryAnalysisColumn = createCategoryColumn(categoryColumn);
    const yAxisAnalysisColumnList = yAxisColumnList.map(column => {
        return createAnalysisColumn(column);
    })

    // update title text
    let newTitle: any = {
        ...eChartsOption.title,
        text: getChartOptionTitleText(yAxisAnalysisColumnList, [categoryAnalysisColumn])
    }
    eChartsOption.title = newTitle;

    // update legend data
    let newLegend: any = {
        ...eChartsOption.legend,
        data: yAxisAnalysisColumnList.map((column) => column.title)
    }
    eChartsOption.legend = newLegend;

    // update series data
    let newSeries: any = {
        ...eChartsOption.series,
        data: []
    }
    const categoryCorrespondsYAxisColumnValuesMap: Map<string, Map<string, any[]>> =
        getColumnValueCategoryCorrespondsOtherColumnValueListMap(categoryAnalysisColumn, yAxisAnalysisColumnList);
    categoryCorrespondsYAxisColumnValuesMap.forEach((yAxisColumnValuesMap: Map<string, any[]>, categoryValue: string) => {
        let seriesDataItem: SeriesDataItem = {
            value: [],
            name: categoryValue
        }
        yAxisAnalysisColumnList.forEach((column) => {

        })
    })

    eChartsOption.series = newSeries;


    if (callbackFunc) callbackFunc(eChartsOption);
    return eChartsOption;
}