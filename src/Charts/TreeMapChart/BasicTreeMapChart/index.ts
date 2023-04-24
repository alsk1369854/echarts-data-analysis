import { CalculateTypeViewText } from './../../../Utils/BasicEnum';
import { createAnalysisColumn, createCategoryColumn, filterOutListEmptyValues, getColumnValueCategoryCorrespondsOtherColumnValueListMap, getValueListCalculateValue } from "../../../Utils";
import { Column, EChartsOption } from "../../../interfaces";
import { getChartOptionTitleText } from '../../../Utils/ChartUtil';

const DEFAULT_ECHARTS_OPTION = {
    title: {
        text: "圖表",
    },
    tooltip: {},
    toolbox: {
        show: true,
        top: 30,
        feature: {
            saveAsImage: { show: true }
        }
    },
    series: {
        type: 'treemap',
        data: [
            {
                name: 'nodeA', // First tree
                value: 10,
                children: [
                    {
                        name: 'nodeAa', // First leaf of first tree
                        value: 4
                    },
                    {
                        name: 'nodeAb', // Second leaf of first tree
                        value: 6
                    }
                ]
            },
            {
                name: 'nodeB', // Second tree
                value: 20,
                children: [
                    {
                        name: 'nodeBa', // Son of first tree
                        value: 20,
                        children: [
                            {
                                name: 'nodeBa1', // Granson of first tree
                                value: 20
                            }
                        ]
                    }
                ]
            }
        ]
    }
};



export const getBasicTreeMapChartOptions = (
    categoryColumn: Column<string | number | null>,
    calculateColumnList: Column<string | number | null>[],
    callbackFunc?: (eChartsOption: EChartsOption) => void
): EChartsOption => {
    let eChartsOption: EChartsOption = { ...DEFAULT_ECHARTS_OPTION } as EChartsOption;

    const generalCategoryColumn = createCategoryColumn(categoryColumn);
    const calculateAnalysisColumnList = calculateColumnList.map(column => createAnalysisColumn(column));

    const categoryCorrespondsCalculateColumnValueListMap = getColumnValueCategoryCorrespondsOtherColumnValueListMap(generalCategoryColumn, calculateAnalysisColumnList);

    // update title text
    let newTitle: any = {
        ...eChartsOption.title,
        text: getChartOptionTitleText(calculateAnalysisColumnList, [generalCategoryColumn])
    }
    eChartsOption.title = newTitle;

    // update series data
    let newSeries: any = {
        ...eChartsOption.series,
        data: []
    }
    categoryCorrespondsCalculateColumnValueListMap.forEach((calculateValueListMap, category) => {
        const newSeriesDataItemChildren = calculateAnalysisColumnList.map(column => {
            const { title: calculateColumnTitle, calculateType: calculateColumnCalculateType } = column;
            const categoryCorrespondsCalculateValueList = calculateValueListMap.get(calculateColumnTitle);
            let value = 0;
            if (categoryCorrespondsCalculateValueList) {
                const filterOutNullValueCategoryCorrespondsCalculateValueList = filterOutListEmptyValues(categoryCorrespondsCalculateValueList) as (string | number)[];
                value = getValueListCalculateValue(filterOutNullValueCategoryCorrespondsCalculateValueList, calculateColumnCalculateType);
            }
            return {
                name: calculateColumnTitle,
                value,
            }
        })
        newSeries.data.push({
            name: category,
            value: newSeriesDataItemChildren.reduce((accumulator: any, currentValue: any) => accumulator + currentValue.value, 0),
            children: newSeriesDataItemChildren,
        })
    })
    eChartsOption.series = newSeries;


    if (callbackFunc) callbackFunc(eChartsOption);
    return eChartsOption;
}