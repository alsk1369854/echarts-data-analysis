import { AnalysisColumn, AnalysisColumnValueType, CalculateTypeViewText, Column, EChartsOption, NumberCalculateType, StringCalculateType, columnListToRowList, createAnalysisColumn, createCategoryColumn, filterOutListEmptyValues, getListMedian, getListStandardDeviation, getListVariance, getValueListCalculateValue } from "../../..";
import { getChartOptionTitleText } from "../../../Utils/ChartUtil";
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



/**
 * 
 * @param rowList alike: [
 *  {a:1, b:4}, 
 *  {a:2, b:5}, 
 *  {a:3, b:b}, 
 * ]
 * @param relationTreeColumnNameOrderList Ordered list of category column names created by the relationship tree
 * @param measureAnalysisColumn Calculate target column
 * @param orderNumber Create the current depth of the relationship tree
 * @returns A relational tree for each category column, with values calculated from measure columns
 */
const getColumnRelationTreeWithMeasureColumnMap = (
    rowList: any[],
    relationTreeColumnNameOrderList: string[],
    measureAnalysisColumn: AnalysisColumn<string | number | null>,
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
                const { title, calculateType } = measureAnalysisColumn;
                const measureValueListOfRowList: (string | number | null)[] = rowList.map(row => row[title]);
                const generalMeasureValueListOfRowList = filterOutListEmptyValues(measureValueListOfRowList) as (string | number)[];
                value = getValueListCalculateValue(generalMeasureValueListOfRowList, calculateType);
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
    categoryColumnList: Column<string | number | null>[],
    measureColumn: Column<string | number | null>,
    callbackFunc?: (eChartsOption: EChartsOption) => void
): EChartsOption => {
    // init result value
    let eChartsOption = { ...DEFAULT_ECHARTS_OPTIONS };

    // create analysis column
    const categoryAnalysisColumnList = categoryColumnList.map(column => {
        return createCategoryColumn(column);
    })
    const measureAnalysisColumn = createAnalysisColumn(measureColumn);

    // update title text
    let newTitle = {
        ...eChartsOption.title,
        text: getChartOptionTitleText([measureAnalysisColumn], categoryAnalysisColumnList),
    }
    eChartsOption.title = newTitle;

    // update series data
    let newSeries: any = {
        ...eChartsOption.series,
        data: []
    };
    // create row list by total columns
    const analysisColumns = [...categoryAnalysisColumnList, measureAnalysisColumn];
    let columnsValueList: any = {};
    analysisColumns.forEach((column) => {
        const { title, valueList } = column;
        columnsValueList[title] = valueList;
    })
    const rowList = columnListToRowList(columnsValueList);
    // create sunburst category column relation tree map
    let relationTreeColumnNameOrderList = categoryAnalysisColumnList.map(column => column.title)
    let categoryColumnRelationTreeMap = getColumnRelationTreeWithMeasureColumnMap(rowList, relationTreeColumnNameOrderList, measureAnalysisColumn);
    // set new series data
    newSeries.data = getSunburstDataListByColumnRelationTreeMap(categoryColumnRelationTreeMap);
    eChartsOption.series = newSeries;

    if (callbackFunc) callbackFunc(eChartsOption);
    return eChartsOption
}