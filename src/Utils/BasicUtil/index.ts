import { AnalysisColumn, Column, EChartsOption } from "../../interfaces";
import { AnalysisColumnValueType, NumberCalculateType, StringCalculateType } from "../BasicEnum";

export const isEmptyValue = (value: any): boolean => {
    let result: boolean = false;

    if (value === null ||
        value === "null" ||
        value === undefined) {

        result = true;
    }
    return result;
}

export const isNumberValue = (value: any): boolean => {
    let result: boolean = false;

    if (Number.isFinite(value) ||
        isEmptyValue(value)) {

        result = true;
    };
    return result;
}

export const getColumnValueListType = (
    valueList: any[]
): AnalysisColumnValueType => {
    const valueListType = (Object.values(valueList).every(value => isNumberValue(value))) ?
        AnalysisColumnValueType.number
        : AnalysisColumnValueType.string;
    return valueListType;
}


export const createAnalysisColumn = (
    column: Column<string | number | null>,
): AnalysisColumn<string | number | null> => {
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

export const createCategoryColumn = (
    column: Column<string | number | null>,
): Column<string> => {
    const { title, valueList } = column;
    return {
        title,
        valueList: valueList.map(value => {
            if (isEmptyValue(value)) {
                return "(Blank)";
            } else {
                return "" + value;
            }
        })
    }
}

export const filterOutListEmptyValues = <T>(valueList: T[]): T[] => {
    return valueList.filter(value => !isEmptyValue(value));
}

export const getMinColumnLength = (columnList: Column<any>[]): number => {
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

/**
 * @param mainColumn 設備名稱 column
 * @param otherColumnList mainColumn 值列別，對應的 column 類別
 * 
 * @returns
 * Map {
 *    "Device 01" => Map {
 *        "設備狀態" => Array ["OK","OK",],
 *        "設備數值" => Array [10,9,],
 *    },
 *    "Device 02" => Map {
 *        "設備狀態" => Array ["NG","WARN",],
 *        "設備數值" => Array [30,15,],
 *    },
 * } 
 */
export const getColumnValueCategoryCorrespondsOtherColumnValueListMap = <T extends string | number | null>(
    mainColumn: Column<string | number | null>,
    otherColumnList: Column<T>[]
): Map<string, Map<string, T[]>> => {
    let resultMap: Map<string, Map<string, T[]>> = new Map();

    // redefine main column value type to string[] 
    // rename main column null values to "(Blank)"
    const mainColumnValueList = createCategoryColumn(mainColumn).valueList;

    // find max column length
    const totalColumnList = [...otherColumnList, mainColumn];
    const minColumnLength = getMinColumnLength(totalColumnList);

    // build map
    // category names
    const mainColumnValueSet: Set<string> = new Set(mainColumnValueList);
    // init map space
    mainColumnValueSet.forEach(valueCategory => {
        let otherColumnMap: Map<string, T[]> = new Map();
        otherColumnList.forEach(column => {
            const { title } = column;
            otherColumnMap.set(title, []);
        });
        resultMap.set(valueCategory, otherColumnMap);
    })
    // insert map values
    for (let i = 0; i < minColumnLength; i++) {
        const categoryValue: string = mainColumnValueList[i];
        const categoryColumnMap = resultMap.get(categoryValue);
        if (categoryColumnMap) {
            otherColumnList.forEach((column) => {
                const { title, valueList } = column;
                const yAxisValue = valueList[i];
                const otherColumnMap = categoryColumnMap.get(title);
                if (otherColumnMap) {
                    otherColumnMap.push(yAxisValue)
                }
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

export const getValueListCalculateValue = <T extends string | number>(
    valueList: T[],
    calculateType: StringCalculateType | NumberCalculateType
): number => {
    let result = 0;

    switch (calculateType) {
        case StringCalculateType.count:
        case NumberCalculateType.count:
            result = valueList.length;
            break;
        case StringCalculateType.countDifferent:
        case NumberCalculateType.countDifferent:
            result = new Set(valueList).size;
            break;
        case NumberCalculateType.sum:
            result = (valueList as number[]).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            break;
        case NumberCalculateType.average:
            const count = valueList.length;
            if(count !== 0){
                const sum = (valueList as number[]).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                result = + (sum / count).toFixed(2);
            }else{
                result = 0;
            }
            break;
        case NumberCalculateType.min:
            const min = Math.min(...(valueList as number[]));
            result = (min === Infinity) ? 0 : min;
            break;
        case NumberCalculateType.max:
            const max = Math.max(...(valueList as number[]));
            result = (max === -Infinity) ? 0 : max;
            break;
        case NumberCalculateType.standardDeviation:
            result = + getListStandardDeviation((valueList as number[])).toFixed(2);
            break;
        case NumberCalculateType.variance:
            result = + getListVariance((valueList as number[])).toFixed(2);
            break;
        case NumberCalculateType.median:
            result = + getListMedian((valueList as number[])).toFixed(2);
            break;
    }

    return result;
}
