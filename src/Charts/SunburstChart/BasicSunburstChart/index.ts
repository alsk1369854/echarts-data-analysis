import { AnalysisColumn, AnalysisColumnValueType, CalculateTypeViewText, Column, EChartsOption, NumberCalculateType, StringCalculateType, columnListToRowList, createAnalysisColumn, getListMedian, getListStandardDeviation, getListVariance } from "../../..";
import { ColumnRelationTreeNode, SunburstDataItem } from "./interfaces";

const DEFAULT_ECHARTS_OPTIONS: EChartsOption = {
    title: {
        text: "圖表",
    },
    tooltip: {
        trigger: 'item',
        formatter: '{b}<br/> 值: {c}<br/>'
    },
    toolbox: {
        show: true,
        top: 30,
        feature: {
            saveAsImage: { show: true }
        }
    },
    series: {
        type: 'sunburst',
        radius: [0, '70%'],
        label: {
            rotate: 'radial'
        },
        data: [
            {
                name: 'Grandpa',
                value: 100,
                children: [
                    {
                        name: 'child',
                        value: 50,
                    }
                ]
            }
        ],
    }
}



const getRowListCalculateValueByMeasureColumnForStringValueType = (
    rowList: {}[],
    measureAnalysisColumn: AnalysisColumn
): number => {
    let result = 0;

    const { title, calculateType } = measureAnalysisColumn;
    let measureValueListOfRowList: string[] = rowList.map((row: any) => {
        return row[title] as string;
    })

    switch (calculateType) {
        case StringCalculateType.count:
            result = measureValueListOfRowList.length;
            break;
        case StringCalculateType.countDifferent:
            result = new Set(measureValueListOfRowList).size;
            break;
    }

    return result;
}

const getRowListCalculateValueByMeasureColumnForNumberValueType = (
    rowList: {}[],
    measureAnalysisColumn: AnalysisColumn
): number => {
    let result = 0;

    const { title, calculateType } = measureAnalysisColumn;
    let measureValueListOfRowList: number[] = rowList.map((row: any) => {
        return row[title] as number;
    })

    // filter out null values (number type can not calculate "null")
    measureValueListOfRowList = measureValueListOfRowList.filter(value => measureValueListOfRowList !== null);

    if (measureValueListOfRowList.length > 0) {
        switch (calculateType) {
            case NumberCalculateType.sum:
                measureValueListOfRowList.forEach(value => {
                    result += value;
                });
                break;
            case NumberCalculateType.countDifferent:
                result = new Set(measureValueListOfRowList).size;
                break;
            case NumberCalculateType.average:
                measureValueListOfRowList.forEach(value => {
                    result += value;
                });
                const size = measureValueListOfRowList.length;
                result = + (result / size).toFixed(2)
                break;
            case NumberCalculateType.min:
                let min = Number.MAX_VALUE;
                measureValueListOfRowList.forEach(value => {
                    min = Math.min(min, value);
                });
                result = min;
                break;
            case NumberCalculateType.max:
                let max = Number.MIN_VALUE;
                measureValueListOfRowList.forEach(value => {
                    max = Math.max(max, value);
                });
                result = max;
                break;
            case NumberCalculateType.standardDeviation:
                const standardDeviation = getListStandardDeviation(measureValueListOfRowList);
                result = + standardDeviation.toFixed(2);
                break;
            case NumberCalculateType.variance:
                const variance = getListVariance(measureValueListOfRowList);
                result = + variance.toFixed(2);
                break;
            case NumberCalculateType.median:
                const median = getListMedian(measureValueListOfRowList);
                result = + median.toFixed(2);
                break;
        }
    }
    return result;
}

const getColumnRelationTreeWithMeasureColumnMap = (
    rowList: {}[],
    relationTreeColumnNameOrderList: string[],
    measureAnalysisColumn: AnalysisColumn,
    orderNumber: number = 0
): Map<string, ColumnRelationTreeNode> => {
    let resultMap = new Map();

    if (orderNumber < relationTreeColumnNameOrderList.length) {
        // 建立每層列的每個類別的關係樹
        const currentColumnName = relationTreeColumnNameOrderList[orderNumber];

        const currentCategorySet = new Set();
        rowList.forEach((row: any) => {
            currentCategorySet.add(row[currentColumnName]);
        })
        currentCategorySet.forEach((category: any) => {
            let currentCategoryRowList = rowList.concat().filter((row: any) => {
                return (row[currentColumnName] === category);
            });
            let value = 0;

            // 已建立完成關係樹，依據計算數值列計算對應的 value
            if (orderNumber === relationTreeColumnNameOrderList.length - 1) {
                const { title, valueList, valueType, calculateType } = measureAnalysisColumn;
                switch (valueType) {
                    case AnalysisColumnValueType.string:
                        value = getRowListCalculateValueByMeasureColumnForStringValueType(currentCategoryRowList, measureAnalysisColumn);
                        break;
                    case AnalysisColumnValueType.number:
                        value = getRowListCalculateValueByMeasureColumnForNumberValueType(currentCategoryRowList, measureAnalysisColumn);
                        break;
                }
            }

            // 加總所有子類節點的值
            const childColumnRelationTreeMap = getColumnRelationTreeWithMeasureColumnMap(currentCategoryRowList, relationTreeColumnNameOrderList, measureAnalysisColumn, orderNumber + 1);
            childColumnRelationTreeMap.forEach((childColumnRelationTreeNode, key) => {
                const { value: childValue } = childColumnRelationTreeNode;
                value += childValue;
            })
            const categoryRelationTreeNode: ColumnRelationTreeNode = {
                name: category,
                value,
                childColumnRelationTreeMap
            }
            resultMap.set(category, categoryRelationTreeNode);
        })
    }

    return resultMap;
}




const getSunburstDataListByColumnRelationTreeMap = (
    columnRelationTreeMap: Map<string, ColumnRelationTreeNode>
): SunburstDataItem[] => {
    let result: SunburstDataItem[] = [];

    columnRelationTreeMap.forEach((columnRelationTreeNode, key) => {
        const { name, value, childColumnRelationTreeMap } = columnRelationTreeNode;
        result.push({
            name,
            value,
            children: getSunburstDataListByColumnRelationTreeMap(childColumnRelationTreeMap)
        })
    })

    return result;
}

export const getBasicSunburstChartOptions = (
    categoryColumnList: Column[],
    measureColumn: Column,
    callbackFunc?: (eChartsOption: EChartsOption) => void
): EChartsOption => {
    // init result value
    let eChartsOption = { ...DEFAULT_ECHARTS_OPTIONS };

    // create analysis column
    const categoryAnalysisColumnList: AnalysisColumn[] = categoryColumnList.map(column => {
        return createAnalysisColumn(column);
    })
    const measureAnalysisColumn: AnalysisColumn = createAnalysisColumn(measureColumn);
    const { title, calculateType } = measureAnalysisColumn;

    // update title
    let newTitle = {
        text: `${title} 的${CalculateTypeViewText[calculateType]} 依據 `
    }
    categoryAnalysisColumnList.forEach((column, index) => {
        const { title } = column
        let tempStr = title;
        if (index <= categoryAnalysisColumnList.length - 2) {
            if (index === categoryAnalysisColumnList.length - 2) {
                tempStr += " 與 ";
            } else {
                tempStr += ", ";
            }
        }
        newTitle.text = newTitle.text + tempStr;
    })
    eChartsOption.title = newTitle;

    // create row list by total columns
    const analysisColumns = categoryAnalysisColumnList.concat(measureAnalysisColumn);
    let columnsValueList: any = {};
    analysisColumns.forEach((column: AnalysisColumn) => {
        const { title, valueList } = column;
        columnsValueList[title] = valueList;
    })
    const rowList = columnListToRowList(columnsValueList);

    // create sunburst category column relation tree map
    let relationTreeColumnNameOrderList: string[] = categoryAnalysisColumnList.map(column => column.title)
    let categoryColumnRelationTreeMap: Map<string, ColumnRelationTreeNode> = getColumnRelationTreeWithMeasureColumnMap(rowList, relationTreeColumnNameOrderList, measureAnalysisColumn);

    // update series
    let newSeries: any = {
        ...eChartsOption.series,
        data: getSunburstDataListByColumnRelationTreeMap(categoryColumnRelationTreeMap)
    };
    eChartsOption.series = newSeries;

    if (callbackFunc) callbackFunc(eChartsOption);
    return eChartsOption
}