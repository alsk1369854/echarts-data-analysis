import { AnalysisColumn, Column, EChartsOption } from '../../interfaces';
import { AnalysisColumnValueType, NumberCalculateType, StringCalculateType } from '../BasicEnum';
import { isNumberValue, getColumnValueListType, createAnalysisColumn, getMinColumnLength, columnListToRowList, swapXAxisAndYAxis, getColumnValueCategoryCorrespondsOtherColumnValueListMap, getListStandardDeviation, getListMedian, getListVariance } from './index'

describe('BasicUtil', () => {
    // isNumberValue()
    test("isNumberValue number type", () => {
        const result = isNumberValue(1);
        expect(result).toBeTruthy();
    })
    test("isNumberValue Number object type", () => {
        const result = isNumberValue(new Number(1));
        expect(result).toBeFalsy();
    })
    test("isNumberValue null type", () => {
        const result = isNumberValue(null);
        expect(result).toBeTruthy();
    })

    // getColumnValueListType()
    test("getColumnValueListType 1", () => {
        const arr: any[] = ["1", null, "2"];
        const result = getColumnValueListType(arr);
        expect(result).toBe(AnalysisColumnValueType.string);
    })
    test("getColumnValueListType 2", () => {
        const arr: any[] = [3, null, 1];
        const result = getColumnValueListType(arr);
        expect(result).toBe(AnalysisColumnValueType.number);
    })
    test("getColumnValueListType 3", () => {
        const arr: any[] = ["3", null, 1];
        const result = getColumnValueListType(arr);
        expect(result).toBe(AnalysisColumnValueType.string);
    })

    // createAnalysisColumn()
    test("createAnalysisColumn 1", () => {
        const column: Column = {
            title: "test column",
            valueList: [1, 2, 3],
            calculateType: NumberCalculateType.average
        };
        const result = createAnalysisColumn(column);

        const expected: AnalysisColumn = {
            ...column,
            calculateType: NumberCalculateType.average,
            valueType: getColumnValueListType(column.valueList),
        }

        expect(result).toEqual(expected);
    })
    test("createAnalysisColumn 1", () => {
        const column: Column = {
            title: "test column",
            valueList: [1, 2, 3],
            calculateType: NumberCalculateType.average
        };
        const result = createAnalysisColumn(column);

        const expected: AnalysisColumn = {
            ...column,
            calculateType: NumberCalculateType.average,
            valueType: getColumnValueListType(column.valueList),
        }

        expect(result).toEqual(expected);
    })
    test("createAnalysisColumn 2", () => {
        const column: Column = {
            title: "test column",
            valueList: [1, null, 3],
            calculateType: NumberCalculateType.average
        };
        const result = createAnalysisColumn(column);

        const expected: AnalysisColumn = {
            ...column,
            calculateType: NumberCalculateType.average,
            valueType: getColumnValueListType(column.valueList),
        }

        expect(result).toEqual(expected);
    })
    test("createAnalysisColumn 3", () => {
        const column: Column = {
            title: "test column",
            valueList: ["12", null, 3],
            calculateType: NumberCalculateType.average
        };
        const result = createAnalysisColumn(column);

        const expected: AnalysisColumn = {
            ...column,
            calculateType: StringCalculateType.count,
            valueType: getColumnValueListType(column.valueList),
        }

        expect(result).toEqual(expected);
    })
    test("createAnalysisColumn 4", () => {
        const column: Column = {
            title: "test column",
            valueList: ["12", null, "22"],
            calculateType: StringCalculateType.countDifferent
        };
        const result = createAnalysisColumn(column);

        const expected: AnalysisColumn = {
            ...column,
            calculateType: StringCalculateType.countDifferent,
            valueType: getColumnValueListType(column.valueList),
        }

        expect(result).toEqual(expected);
    })
    test("createAnalysisColumn 5", () => {
        const column: Column = {
            title: "test column",
            valueList: [12, 25, 22],
            calculateType: StringCalculateType.countDifferent
        };
        const result = createAnalysisColumn(column);

        const expected: AnalysisColumn = {
            ...column,
            calculateType: NumberCalculateType.countDifferent,
            valueType: getColumnValueListType(column.valueList),
        }

        expect(result).toEqual(expected);
    })
    test("createAnalysisColumn 6", () => {
        const column: Column = {
            title: "test column",
            valueList: [12, 25, 22],
        };
        const result = createAnalysisColumn(column);

        const expected: AnalysisColumn = {
            ...column,
            calculateType: NumberCalculateType.count,
            valueType: getColumnValueListType(column.valueList),
        }

        expect(result).toEqual(expected);
    })

    // getMinColumnLength()
    test("getMinColumnLength 1", () => {
        const columnList: Column[] = [
            {
                title: "column_1",
                valueList: [12, 25, 22]
            }, {
                title: "column_2",
                valueList: [12, 30]
            }, {
                title: "column_3",
                valueList: ["a", "b", "c", "d"]
            },
        ];
        const result = getMinColumnLength(columnList);

        expect(result).toEqual(2);
    })
    test("getMinColumnLength 2", () => {
        const result = getMinColumnLength([]);

        expect(result).toEqual(0);
    })

    // columnListToRowList()
    test("columnListToRowList 1", () => {
        const columnTable: any = {
            column1: [1, 2, 3],
            column2: ["a", "b", "c"],
            column3: ["A", "B", "C"]
        }
        const result = columnListToRowList(columnTable);

        expect(result).toEqual([
            { column1: 1, column2: "a", column3: "A" },
            { column1: 2, column2: "b", column3: "B" },
            { column1: 3, column2: "c", column3: "C" },
        ]);
    })
    test("columnListToRowList 2", () => {
        const result = columnListToRowList({});

        expect(result).toEqual([]);
    })

    // getColumnValueCategoryCorrespondsOtherColumnValueListMap()
    test("getColumnValueCategoryCorrespondsOtherColumnValueListMap 1", () => {
        const mainColumn: Column = {
            title: "mainColumn",
            valueList: ["V1", "V2", "V1", null]
        }
        const otherColumnList: Column[] = [
            {
                title: "otherColumn1",
                valueList: ["o1", "o2", "o3", "o4"],
            },
            {
                title: "otherColumn2",
                valueList: [1, 2, 3, 4],
            }
        ]

        const result = getColumnValueCategoryCorrespondsOtherColumnValueListMap(mainColumn, otherColumnList);

        let expectedMap = new Map();
        let category1Map = new Map();
        category1Map.set(otherColumnList[0].title, ["o1", "o3"]);
        category1Map.set(otherColumnList[1].title, [1, 3]);
        expectedMap.set(mainColumn.valueList[0], category1Map);
        let category2Map = new Map();
        category2Map.set(otherColumnList[0].title, ["o2"]);
        category2Map.set(otherColumnList[1].title, [2]);
        expectedMap.set(mainColumn.valueList[1], category2Map);
        let category3Map = new Map();
        category3Map.set(otherColumnList[0].title, ["o4"]);
        category3Map.set(otherColumnList[1].title, [4]);
        expectedMap.set("(Blank)", category3Map);

        /*
        Map {
            "V1" => Map {
                "otherColumn1" => ["o1", "o3"], 
                "otherColumn2" => [1, 3]}, 
            "V2" => Map {
                "otherColumn1" => ["o2"], 
                "otherColumn2" => [2]}},
            "(Blank)" => Map {
                "otherColumn1" => ["o4"], 
                "otherColumn2" => [4]}}
        */
        expect(result).toEqual(expectedMap);
    })

    // swapXAxisAndYAxis()
    test("columnListToRowList 1", () => {
        let option: EChartsOption = {
            xAxis: { name: "1" },
            yAxis: { name: "2" }
        }

        swapXAxisAndYAxis(option);

        expect(option).toEqual({
            xAxis: { name: "2" },
            yAxis: { name: "1" }
        });
    })

    //getListMedian()
    test("getListMedian 1", () => {
        const result = getListMedian([]);
        expect(result).toBe(0);
    })
    test("getListMedian 2", () => {
        const result = getListMedian([1, 5, 6, 8]);
        expect(result).toBe(6);
    })
    test("getListMedian 3", () => {
        const result = getListMedian([1, 5, 8]);
        expect(result).toBe(5);
    })
    test("getListMedian 4", () => {
        const result = getListMedian([1]);
        expect(result).toBe(1);
    })

    //getListVariance()
    test("getListVariance 1", () => {
        const result = getListVariance([]);
        expect(result).toBe(0);
    })
    test("getListVariance 2", () => {
        const result = getListVariance([1, 2, 3]);
        /*
        2 = avg(1, 2, 3)
        1 = (2-1)^2 
        0 = (2-2)^2 
        1 = (2-3)^2 

        2 = sum(1, 0, 1)
        */
        expect(result).toBe(2);
    })

    //getListStandardDeviation()
    test("getListStandardDeviation 1", () => {
        const result = getListStandardDeviation([]);
        expect(result).toBe(0);
    })
    test("getListStandardDeviation 2", () => {
        const result = getListStandardDeviation([1, 2, 3]);
        /*
        2 = avg(1, 2, 3)
        1 = (2-1)^2 
        0 = (2-2)^2 
        1 = (2-3)^2 

        2 = sum(1, 0, 1)
        1.41 = sqrt(2, 2);
        */
        expect(result.toFixed(2)).toBe("1.41");
    })

})