import { filterOutListEmptyValues } from './../../../Utils/BasicUtil/index';
import { createAnalysisColumn, createCategoryColumn, getColumnValueCategoryCorrespondsOtherColumnValueListMap, getValueListCalculateValue } from "../../../Utils";
import { getChartOptionTitleText } from "../../../Utils/ChartUtil";
import { Column, EChartsOption } from "../../../interfaces";
import { SeriesDataItem } from './interfaces';
import { DEFAULT_ECHARTES_OPTIONS_GRID, DEFAULT_ECHARTES_OPTIONS_LEGEND, DEFAULT_ECHARTES_OPTIONS_TOOLBOX } from '../../../configs/ChartsOptionConfig';

const DEFAULT_ECHARTS_OPTION: EChartsOption = {
    title: {
        text: 'Funnel'
    },
    legend: DEFAULT_ECHARTES_OPTIONS_LEGEND,
    grid: DEFAULT_ECHARTES_OPTIONS_GRID,
    toolbox: DEFAULT_ECHARTES_OPTIONS_TOOLBOX,
    tooltip: {
        trigger: 'item',
        formatter: '{b}<br/> 值: {c}<br/> 百分比: {d}%'
    },
    series: {
        name: 'Funnel',
        type: 'funnel',
        label: {
            show: true,
            position: 'inside'
        },
        emphasis: {
            label: {
                fontSize: 20
            }
        },
        data: [
            { value: 60, name: 'Visit' },
            { value: 40, name: 'Inquiry' },
            { value: 20, name: 'Order' },
            { value: 80, name: 'Click' },
            { value: 100, name: 'Show' }
        ]
    }
};

export const getBasicFunnelChartOptions = (
    categoryColumn: Column<string | number | null>,
    calculateColumn: Column<string | number | null>,
    callbackFunc?: (eChartsOption: EChartsOption) => void
): EChartsOption => {
    let eChartsOption: EChartsOption = { ...DEFAULT_ECHARTS_OPTION };

    const generalCategoryColumn = createCategoryColumn(categoryColumn);
    const calculateAnalysisColumn = createAnalysisColumn(calculateColumn);
    const { title: calculateColumnTitle, calculateType: calculateColumnCalculateType } = calculateAnalysisColumn
    const categoryCorrespondsCalculateColumnValueListMap = getColumnValueCategoryCorrespondsOtherColumnValueListMap(generalCategoryColumn, [calculateAnalysisColumn]);

    // update option title text
    let newTitle: any = {
        ...eChartsOption.title,
        text: getChartOptionTitleText([calculateAnalysisColumn], [generalCategoryColumn])
    }
    eChartsOption.title = newTitle;

    // update legend data
    let newLegend: any = {
        ...eChartsOption.legend,
        data: []
    }
    // update series data
    let newSeries: any = {
        ...eChartsOption.series,
        data: []
    }
    categoryCorrespondsCalculateColumnValueListMap.forEach((calculateColumnValueListMap, category) => {
        const categoryCorrespondsCalculateColumnValueList = calculateColumnValueListMap.get(calculateColumnTitle);
        if (categoryCorrespondsCalculateColumnValueList) {
            const filterOutNullCategoryCorrespondsCalculateColumnValueList = filterOutListEmptyValues(categoryCorrespondsCalculateColumnValueList) as (string | number)[];
            newLegend.data.push(category);
            newSeries.data.push({
                name: category,
                value: getValueListCalculateValue(filterOutNullCategoryCorrespondsCalculateColumnValueList, calculateColumnCalculateType)
            } as SeriesDataItem)
        }
    })
    eChartsOption.series = newSeries;
    eChartsOption.legend = newLegend;

    if (callbackFunc) callbackFunc(eChartsOption);
    return eChartsOption;
}