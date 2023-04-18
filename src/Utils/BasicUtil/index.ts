import { AnalysisColumn, Column, EChartsOption } from "../../interfaces";
import { AnalysisColumnValueType, NumberCalculateType, StringCalculateType } from "../BasicEnum";

export const isNumberValue = (value: any): boolean => {
    if (value === null || value === "null") return true;
    if (Number.isFinite(value)) return true;
    return false;
}

export const getColumnValueListType = (valueList: any[]): AnalysisColumnValueType => {
    const valueListType = (Object.values(valueList).every(value => isNumberValue(value))) ?
        AnalysisColumnValueType.number
        : AnalysisColumnValueType.string;
    return valueListType;
}

export const createAnalysisColumn = (
    column: Column,
): AnalysisColumn => {
    const { title, valueList, calculateType } = column;

    const valueType = getColumnValueListType(valueList);

    const newCalculateType = (valueType === AnalysisColumnValueType.number) ?
        Object.values(NumberCalculateType).includes(calculateType as NumberCalculateType) ? calculateType : NumberCalculateType.count
        : Object.values(StringCalculateType).includes(calculateType as StringCalculateType) ? calculateType : StringCalculateType.count

    return {
        title,
        valueList,
        valueType,
        calculateType: newCalculateType!
    }
}

export const getMinColumnLength = (columnList: Column[]): number => {
    let minLength = Number.MAX_VALUE;
    columnList.forEach(column => {
        const columnLength = column.valueList.length
        minLength = Math.min(minLength, columnLength);
    })

    if (minLength === Number.MAX_VALUE) minLength = 0;
    return minLength;
}

/**
 * 
 * @param analysisColumnList { 
 *  a:[1,2,3], 
 *  b:[4,5,6]
 * }
 * 
 * @returns [
 *  {a:1, b:4}, 
 *  {a:2, b:5}, 
 *  {a:3, b:b}, 
 * ]
 */
export const columnListToRowList = (columnsValueList: any): {}[] => {
    let result = [];

    let minColumnLength = Number.MAX_VALUE;
    Object.values(columnsValueList).forEach((valueList: any) => {
        minColumnLength = Math.min(minColumnLength, valueList.length)
    })
    if (minColumnLength === Number.MAX_VALUE) minColumnLength = 0;

    for (let i = 0; i < minColumnLength; i++) {
        let tempObj: any = {};
        Object.keys(columnsValueList).forEach((key: string) => {
            tempObj[key] = columnsValueList[key][i];
        })
        result.push(tempObj)
    }

    return result;
}

export const getColumnValueCategoryCorrespondsOtherColumnValueListMap = (
    mainColumn: Column,
    otherColumnList: Column[]
): Map<string, Map<string, any[]>> => {
    let resultMap: Map<string, Map<string, any[]>> = new Map();

    // redefine main column value type to string[] 
    // rename main column null values to "(Blank)"
    let mainColumnValueList = mainColumn.valueList as string[]
    mainColumnValueList = mainColumnValueList.map(value => {
        if (value === null) {
            return "(Blank)"
        } else {
            return "" + value;
        }
    });

    // find max column length
    const totalColumnList = otherColumnList.concat(mainColumn);
    const minColumnLength = getMinColumnLength(totalColumnList);

    // build map
    // category names
    const mainColumnValueSet: Set<string> = new Set(mainColumnValueList);
    // init map space
    mainColumnValueSet.forEach(valueCategory => {
        let otherColumnMap: Map<string, any[]> = new Map();
        otherColumnList.forEach(column => {
            const { title } = column;
            otherColumnMap.set(title, []);
        });
        resultMap.set(valueCategory, otherColumnMap);
    })
    // insert map values
    for (let i = 0; i < minColumnLength; i++) {
        const categoryValue: string = mainColumnValueList[i];
        if (resultMap.has(categoryValue)) {
            let otherColumnMap: Map<string, any[]> = resultMap.get(categoryValue) as Map<string, any[]>;
            otherColumnList.forEach((column: Column) => {
                const { title, valueList } = column
                const yAxisValue = valueList[i];
                otherColumnMap.get(title)!.push(yAxisValue);
            })
        }
    }

    return resultMap;
}

export const swapXAxisAndYAxis = (eChartsOptions: EChartsOption): EChartsOption => {
    let { xAxis, yAxis } = eChartsOptions;
    eChartsOptions.xAxis = yAxis as any;
    eChartsOptions.yAxis = xAxis as any;
    return eChartsOptions;
}

export const getListMedian = (numberList: number[]): number => {
    const sortedValueList = numberList.sort();
    const medianIndex = Math.floor(numberList.length / 2);
    const median = sortedValueList[medianIndex];
    return (median) ? median : 0;
}

export const getListVariance = (numberList: number[]): number => {
    const sum = numberList.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const count = numberList.length;
    const average = sum / count;
    const variance = numberList.reduce((accumulator, currentValue) => {
        return accumulator + Math.pow(average - currentValue, 2);
    }, 0);
    return variance;
}

export const getListStandardDeviation = (numberList: number[]): number => {
    const variance = getListVariance(numberList);
    const standardDeviation = Math.sqrt(variance);
    return standardDeviation;
}

