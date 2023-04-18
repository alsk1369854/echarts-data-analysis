import { CalculateTypeViewText, NumberCalculateType, StringCalculateType } from '../../../Utils/BasicEnum';
import { AnalysisColumnValueType } from '../../..';
import { createAnalysisColumn, getListMedian, getListStandardDeviation, getListVariance } from '../../../Utils';
import { AnalysisColumn, Column, EChartsOption } from '../../../interfaces';

const DEFAULT_ECHART_OPTIONS: EChartsOption = {
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
        top: 55,
        orient: 'vertical', // 直向排列
        left: 'right' // 靠右
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

const getCategoryValueListMap = <K, V>(
    categoryColumnValueList: K[],
    valueColumnValueList: V[]
): Map<K, V[]> => {
    let categoryValueListMap: Map<K, V[]> = new Map();
    for (let i = 0; i < valueColumnValueList.length && i < categoryColumnValueList.length; i++) {
        const value = valueColumnValueList[i];
        const category = categoryColumnValueList[i];

        const calculateMapValue = categoryValueListMap.get(category);
        if (calculateMapValue) {
            calculateMapValue.push(value);
        } else {
            categoryValueListMap.set(category, [value]);
        }
    }
    return categoryValueListMap;
}



const updateEChartsOptionsByNumberValue = (
    eChartsOption: EChartsOption,
    valueAnalysisColumn: AnalysisColumn,
    categoryAnalysisColumn: AnalysisColumn,
): void => {
    let {
        title: valueTitle,
        valueList: valueColumnValueList,
        calculateType: valueCalculateType
    } = valueAnalysisColumn;
    let {
        title: categoryTitle,
        valueList: categoryColumnValueList
    } = categoryAnalysisColumn;

    // default calculate type
    let calculateType = NumberCalculateType.sum;
    // update title
    let newTitle: any = {
        text: `${valueTitle} 的${CalculateTypeViewText[calculateType]} 根據 ${categoryTitle}`,
    }
    // 檢查數據計算類型的合法性
    if (Object.values(NumberCalculateType).includes(valueCalculateType as NumberCalculateType)) {
        const calculateViewText = CalculateTypeViewText[valueCalculateType];
        calculateType = valueCalculateType as NumberCalculateType; // 更新使用者指定的計算類型
        newTitle.text = `${valueTitle} 的${calculateViewText} 根據 ${categoryTitle}`;
    }
    eChartsOption.title = newTitle;

    // update series
    let newSeries: any = {
        ...eChartsOption.series,
        data: []
    }

    categoryColumnValueList = categoryColumnValueList as string[];
    valueColumnValueList = valueColumnValueList as number[];
    const categoryValueListMap: Map<string, number[]> = getCategoryValueListMap(
        categoryColumnValueList,
        valueColumnValueList
    );

    switch (calculateType) {
        case NumberCalculateType.sum:
            categoryValueListMap.forEach((valueList, key) => {
                const sum = valueList.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                newSeries.data.push({ value: sum, name: "" + key });
            })
            break;
        case NumberCalculateType.average:
            categoryValueListMap.forEach((valueList, key) => {
                const sum = valueList.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                const count = valueList.length;
                newSeries.data.push({ value: (sum / count), name: "" + key });
            })
            break;
        case NumberCalculateType.min:
            categoryValueListMap.forEach((valueList, key) => {
                // const min = Math.min(...valueList);
                let min = (valueList.length > 0) ? Number.MAX_VALUE : 0;
                valueList.forEach(value => { min = Math.min(value, min) });
                newSeries.data.push({ value: min, name: "" + key });
            })
            break;
        case NumberCalculateType.max:
            categoryValueListMap.forEach((valueList, key) => {
                // const max = Math.max(...valueList);
                let max = (valueList.length > 0) ? Number.MIN_VALUE : 0;
                valueList.forEach(value => { max = Math.max(value, max) });
                newSeries.data.push({ value: max, name: "" + key });
            })
            break;
        case NumberCalculateType.count:
            categoryValueListMap.forEach((valueList, key) => {
                const count = valueList.length;
                newSeries.data.push({ value: count, name: "" + key });
            })
            break;
        case NumberCalculateType.standardDeviation:
            categoryValueListMap.forEach((valueList, key) => {
                const standardDeviation = getListStandardDeviation(valueList);
                newSeries.data.push({ value: standardDeviation, name: "" + key });
            })
            break;
        case NumberCalculateType.variance:
            categoryValueListMap.forEach((valueList, key) => {
                const variance = getListVariance(valueList);
                newSeries.data.push({ value: variance, name: "" + key });
            })
            break;
        case NumberCalculateType.median:
            categoryValueListMap.forEach((valueList, key) => {
                const median = getListMedian(valueList);
                newSeries.data.push({ value: median, name: "" + key });
            })
            break;
    }
    eChartsOption.series = newSeries;

    // delete memory
    categoryValueListMap.clear();
}

const updateEChartsOptionsByStringValue = (
    eChartsOption: EChartsOption,
    valueAnalysisColumn: AnalysisColumn,
    categoryAnalysisColumn: AnalysisColumn,
): void => {
    let {
        title: valueTitle,
        valueList: valueColumnValueList,
        calculateType: valueCalculateType
    } = valueAnalysisColumn;
    let {
        title: categoryTitle,
        valueList: categoryColumnValueList
    } = categoryAnalysisColumn;

    // default calculate type
    let calculateType = StringCalculateType.count;
    // update title
    let newTitle: any = {
        text: `${valueTitle} 的${CalculateTypeViewText[calculateType]} 根據 ${categoryTitle}`,
    }
    if (Object.values(StringCalculateType).includes(valueCalculateType as StringCalculateType)) {
        const calculateViewText = CalculateTypeViewText[valueCalculateType];
        calculateType = valueCalculateType as StringCalculateType; // 更新使用者指定的計算類型
        newTitle.text = `${valueTitle} 的${calculateViewText} 根據 ${categoryTitle}`
    }
    eChartsOption.title = newTitle;

    // update series
    let newSeries: any = {
        ...eChartsOption.series,
        data: []
    }

    categoryColumnValueList = categoryColumnValueList as string[];
    valueColumnValueList = valueColumnValueList as string[];
    const categoryValueListMap: Map<string, string[]> = getCategoryValueListMap(
        categoryColumnValueList,
        valueColumnValueList
    );

    switch (calculateType) {
        case StringCalculateType.countDifferent:
            categoryValueListMap.forEach((valueList, key) => {
                const countDifferent = new Set(valueList).size;
                newSeries.data.push({ value: countDifferent, name: "" + key });
            })
            break;
        case StringCalculateType.count:
            categoryValueListMap.forEach((valueList, key) => {
                const count = valueList.length;
                newSeries.data.push({ value: count, name: "" + key });
            })
            break;
    }

    eChartsOption.series = newSeries;

    // delete memory
    categoryValueListMap.clear();
}


export const getBasicPieChartOptions = (
    categoryColumn: Column,
    valueColumn: Column,
    callbackFunc?: (eChartsOption: EChartsOption) => void
): EChartsOption => {
    // init result value
    let eChartsOption: EChartsOption = { ...DEFAULT_ECHART_OPTIONS };

    // create analysis column
    const categoryAnalysisColumn: AnalysisColumn = createAnalysisColumn(categoryColumn);
    const valueAnalysisColumn: AnalysisColumn = createAnalysisColumn(valueColumn);

    // switch calculate function
    const { valueType: valueColumnType } = valueAnalysisColumn;
    switch (valueColumnType) {
        case AnalysisColumnValueType.number:
            updateEChartsOptionsByNumberValue(eChartsOption, valueAnalysisColumn, categoryAnalysisColumn);
            break;
        case AnalysisColumnValueType.string:
        default:
            updateEChartsOptionsByStringValue(eChartsOption, valueAnalysisColumn, categoryAnalysisColumn);
    }

    if (callbackFunc) callbackFunc(eChartsOption);
    return eChartsOption;
}
