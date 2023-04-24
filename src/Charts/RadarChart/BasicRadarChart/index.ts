import { createAnalysisColumn, createCategoryColumn, filterOutListEmptyValues, getColumnValueCategoryCorrespondsOtherColumnValueListMap, getValueListCalculateValue } from "../../../Utils";
import { getChartOptionTitleText } from "../../../Utils/ChartUtil";
import { Column, EChartsOption } from "../../../interfaces";
import { RadarIndicatorItem } from "./interfaces";

export const DEFAULT_ECHARTS_OPTION = {
    title: {
        text: 'Basic Radar Chart'
    },
    tooltip: {
        trigger: 'item',
        position: "right"
    },
    grid: {
        top: 60
    },
    legend: {
        top: 30,
        data: ['Allocated Budget', 'Actual Spending']
    },
    radar: {
        center: ['50%', '60%'], // chart position x-axis and y-axis
        // radius: 80, // chart size
        indicator: [
            { name: 'Sales', max: 6500 },
            { name: 'Administration', max: 16000 },
            { name: 'Information Technology', max: 30000 },
            { name: 'Customer Support', max: 38000 },
            { name: 'Development', max: 52000 },
            { name: 'Marketing', max: 25000 }
        ]
    },
    series: {
        type: 'radar',
        // symbol: 'none', // 點顯示
        emphasis: {
            lineStyle: {
                width: 4
            }
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

};

export const getRadarChartOptions = (
    categoryColumn: Column<string | number | null>,
    yAxisColumnList: Column<string | number | null>[],
    callbackFunc?: (eChartsOption: EChartsOption) => void
): EChartsOption => {
    // init return value
    let eChartsOption: EChartsOption = { ...DEFAULT_ECHARTS_OPTION } as EChartsOption;

    // create analysis column
    const categoryAnalysisColumn = createCategoryColumn(categoryColumn);
    const yAxisAnalysisColumnList = yAxisColumnList.map(column => {
        return createAnalysisColumn(column);
    })

    // create categroy corresponds y-axis column values map
    const categoryCorrespondsYAxisColumnValuesMap = getColumnValueCategoryCorrespondsOtherColumnValueListMap(categoryAnalysisColumn, yAxisAnalysisColumnList);

    // update title text
    const newTitle: any = {
        ...eChartsOption.title,
        text: getChartOptionTitleText(yAxisAnalysisColumnList, [categoryAnalysisColumn])
    }
    eChartsOption.title = newTitle;

    // update legend data
    const newLegend: any = {
        ...eChartsOption.legend,
        data: yAxisAnalysisColumnList.map((column) => column.title)
    }
    eChartsOption.legend = newLegend;

    // update radar indicator
    let newRadar: any = {
        ...eChartsOption.radar,
        indicator: []
    }
    let categoryMaximumValueMap: Map<string, number> = new Map();
    categoryCorrespondsYAxisColumnValuesMap.forEach((yAxisColumnValuesMap, categoryValue) => {
        categoryMaximumValueMap.set(categoryValue, Number.MIN_VALUE);
    })

    // update series data
    const newSeries: any = {
        ...eChartsOption.series,
        data: yAxisAnalysisColumnList.map(column => {
            const { title: yAxisTitle, calculateType: yAxisCalculateType } = column;
            let seriesDataItem: any = {
                value: [],
                name: yAxisTitle
            }
            categoryCorrespondsYAxisColumnValuesMap.forEach((yAxisColumnValuesMap, categoryValue) => {
                const categoryCorrespondsYAxisColumnValues = yAxisColumnValuesMap.get(yAxisTitle);
                if (categoryCorrespondsYAxisColumnValues) {
                    const generalCategoryCorrespondsYAxisColumnValues = filterOutListEmptyValues(categoryCorrespondsYAxisColumnValues) as (string | number)[];
                    const value = getValueListCalculateValue(generalCategoryCorrespondsYAxisColumnValues, yAxisCalculateType);
                    seriesDataItem.value.push(value);

                    // update category maximum value
                    let categoryMaximumValue = categoryMaximumValueMap.get(categoryValue);
                    if (categoryMaximumValue) {
                        categoryMaximumValue = Math.max(categoryMaximumValue, value);
                    } else {
                        categoryMaximumValue = value;
                    }
                    categoryMaximumValueMap.set(categoryValue, categoryMaximumValue);
                }
            })
            return seriesDataItem;
        })
    }
    eChartsOption.series = newSeries;


    categoryMaximumValueMap.forEach((categoryMaxiMumValue, category) => {
        newRadar.indicator.push({
            name: category,
            max: (categoryMaxiMumValue > 0) ? categoryMaxiMumValue : 0
        } as RadarIndicatorItem);
    })
    eChartsOption.radar = newRadar;


    if (callbackFunc) callbackFunc(eChartsOption);
    return eChartsOption;
}