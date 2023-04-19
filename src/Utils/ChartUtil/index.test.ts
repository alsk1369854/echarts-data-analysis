import { Column } from '../../interfaces'
import { CalculateTypeViewText, NumberCalculateType, StringCalculateType } from '../BasicEnum'
import { createAnalysisColumn } from '../BasicUtil'
import { getChartOptionTitleText } from './index'

const testDataset = {
    deviceName: ["device_1", "device_2", "device_3"],
    deviceState: ["OK", "WARN", "NG"],
    deviceValue: [10, 15, 30]
}
const mainColumn: Column<string> = {
    title: "deviceState",
    valueList: testDataset.deviceState,
}
const calculateColumnList: Column<string | number>[] = [
    {
        title: "deviceName",
        valueList: testDataset.deviceName,
        calculateType: StringCalculateType.count
    }, {
        title: "deviceValue",
        valueList: testDataset.deviceValue,
        calculateType: NumberCalculateType.average
    }, {
        title: "deviceState",
        valueList: testDataset.deviceState,
        calculateType: StringCalculateType.countDifferent
    }
]

const calculateAnalysisColumnList = calculateColumnList.map((column) => createAnalysisColumn(column));

describe('ChartUtil', () => {
    // getChartOptionTitle()
    test("getChartOptionTitle", () => {
        const result = getChartOptionTitleText(calculateAnalysisColumnList, [mainColumn]);
        const expectedTitleText = `${calculateAnalysisColumnList[0].title} 的${CalculateTypeViewText[calculateAnalysisColumnList[0].calculateType]}, ${calculateAnalysisColumnList[1].title} 的${CalculateTypeViewText[calculateAnalysisColumnList[1].calculateType]} 與 ${calculateAnalysisColumnList[2].title} 的${CalculateTypeViewText[calculateAnalysisColumnList[2].calculateType]} 依據 ${mainColumn.title}`
        expect(result).toBe(expectedTitleText);
    })
})