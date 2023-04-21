import { AnalysisColumn, AnalysisColumnValueType, Column, createAnalysisColumn, getColumnValueCategoryCorrespondsOtherColumnValueListMap, NumberCalculateType, StringCalculateType } from "../../dist";

// 資料集
const myDataset: any = {
    設備名稱: ["Device 01", "Device 02", "Device 02", "Device 01"],
    設備狀態: ["OK",        "NG",        "WARN",      "OK"],
    設備數值: [10,          30,          15,          9]
}
// 主軸 x-axis
const xAxisColumn: Column<string> = {
    title: "設備名稱",
    valueList: myDataset["設備名稱"]
}
// 計算軸 y-axis 
const yAxisAnalysisColumn: AnalysisColumn<any>[] = [
    {
        title: "設備狀態",
        valueList: myDataset["設備狀態"],
        valueType: AnalysisColumnValueType.number,
        calculateType: StringCalculateType.count,
    },
    {
        title: "設備數值",
        valueList: myDataset["設備數值"],
        valueType: AnalysisColumnValueType.string,
        calculateType: NumberCalculateType.average,
    }
]


const map = getColumnValueCategoryCorrespondsOtherColumnValueListMap(xAxisColumn, yAxisAnalysisColumn);
console.log("" + map);
console.log(map.toString());

describe("", () => {
    test("", () => {
        expect(map).toEqual(new Map());
    })
})