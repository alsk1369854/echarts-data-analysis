import { CalculateTypeViewText, NumberCalculateType, StringCalculateType } from '../../../Utils/BasicEnum';
import { AnalysisColumnValueType } from '../../..';
import { createAnalysisColumn, createCategoryColumn, filterOutListEmptyValues, getColumnValueCategoryCorrespondsOtherColumnValueListMap, getListMedian, getListStandardDeviation, getListVariance, getValueListCalculateValue } from '../../../Utils';
import { AnalysisColumn, Column, EChartsOption } from '../../../interfaces';
import { getChartOptionTitleText } from '../../../Utils/ChartUtil';

const DEFAULT_ECHARTS_OPTION: EChartsOption = {
    title: {
        text: "圖表",
    },
    toolbox: {
        show: true,
        top: 30,
        feature: {
            saveAsImage: { show: true }
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: '{b}<br/> 值: {c}<br/> 百分比: {d}%'
    },
    legend: {
        type: 'scroll',
        top: 30, // when right top value is : 55 
        // orient: 'vertical', // 直向排列
        // left: 'right' // 靠右
    },
    series: {
        type: 'pie',
        label: {
            formatter: '{b}({d}%)',
        },
        top: 30,
        data: [],
        radius: [0, '70%'],
        emphasis: {
            itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
    },
}

export const getBasicPieChartOptions = (
    categoryColumn: Column<string | number | null>,
    valueColumn: Column<string | number | null>,
    callbackFunc?: (eChartsOption: EChartsOption) => void
): EChartsOption => {
    // init result value
    let eChartsOption: EChartsOption = { ...DEFAULT_ECHARTS_OPTION };

    // create analysis column
    const generalCategoryColumn = createCategoryColumn(categoryColumn);
    const valueAnalysisColumn = createAnalysisColumn(valueColumn);
    const { title: valueColumnTitle, calculateType: valueColumnCalculateType } = valueAnalysisColumn;

    // update option title text
    let newTitle: any = {
        ...eChartsOption.title,
        text: getChartOptionTitleText([valueAnalysisColumn], [generalCategoryColumn]),
    }
    eChartsOption.title = newTitle;

    // update option series data
    let newSeries: any = {
        ...eChartsOption.series,
        data: []
    }
    const categoryCorrespondsValuesMap =
        getColumnValueCategoryCorrespondsOtherColumnValueListMap(generalCategoryColumn, [valueAnalysisColumn]);
    categoryCorrespondsValuesMap.forEach((valueColumnMap, categoryValue) => {
        const categoryCorrespondValueList = valueColumnMap.get(valueColumnTitle);
        if (categoryCorrespondValueList) {
            const generalCategoryCorrespondValueList = filterOutListEmptyValues(categoryCorrespondValueList) as (string | number)[];
            const value = getValueListCalculateValue(generalCategoryCorrespondValueList, valueColumnCalculateType);
            newSeries.data.push({ value: value, name: categoryValue });
        }
    })
    eChartsOption.series = newSeries;

    if (callbackFunc) callbackFunc(eChartsOption);
    return eChartsOption;
}
