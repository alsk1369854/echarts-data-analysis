import { AnalysisColumn, Column } from '../../interfaces'
import { AnalysisColumnValueType, CalculateTypeViewText, NumberCalculateType, StringCalculateType } from '../BasicEnum'
import { createCalculateAnalysisColumn, createCategoryColumn } from '../BasicUtil'
import { getChartOptionTitleText } from './index'

const testDataset = {
    deviceName: ["device_1", "device_2", "device_3"],
    deviceState: ["OK", "WARN", "NG"],
    deviceValue: [10, 15, 30]
}

describe('ChartUtil', () => {
    // getChartOptionTitle()
    test("getChartOptionTitle 1", () => {
        const mainColumn: Column<string> = {
            title: "deviceState",
            valueList: testDataset.deviceState,
        }
        const calculateColumnList: AnalysisColumn<string | number>[] = [
            {
                title: "deviceName",
                valueType: AnalysisColumnValueType.string,
                valueList: testDataset.deviceName,
                calculateType: StringCalculateType.count
            }, {
                title: "deviceValue",
                valueType: AnalysisColumnValueType.number,
                valueList: testDataset.deviceValue,
                calculateType: NumberCalculateType.average
            }, {
                title: "deviceState",
                valueType: AnalysisColumnValueType.string,
                valueList: testDataset.deviceState,
                calculateType: StringCalculateType.countDifferent
            }
        ]
        const calculateAnalysisColumnList = calculateColumnList.map((column) => createCalculateAnalysisColumn(column));

        const result = getChartOptionTitleText(calculateAnalysisColumnList, [mainColumn]);
        const expectedTitleText = `${calculateAnalysisColumnList[0].title} 的${CalculateTypeViewText[calculateAnalysisColumnList[0].calculateType]}, ${calculateAnalysisColumnList[1].title} 的${CalculateTypeViewText[calculateAnalysisColumnList[1].calculateType]} 與 ${calculateAnalysisColumnList[2].title} 的${CalculateTypeViewText[calculateAnalysisColumnList[2].calculateType]} 依據 ${mainColumn.title}`
        expect(result).toBe(expectedTitleText);
    })

    test("getChartOptionTitle 2", () => {
        const categroyColumnList: Column<string | number>[] = [
            {
                title: "deviceState",
                valueList: testDataset.deviceState,
            }, {
                title: "deviceName",
                valueList: testDataset.deviceName,
            }, {
                title: "deviceValue",
                valueList: testDataset.deviceValue,
            }
        ]
        const gereralCategroyColumnList = categroyColumnList.map(column => createCategoryColumn(column))
        const calculateColumn: AnalysisColumn<number> = {
            title: "deviceValue",
            valueType: AnalysisColumnValueType.number,
            valueList: testDataset.deviceValue,
            calculateType: NumberCalculateType.average
        }

        const calculateAnalysisColumn = createCalculateAnalysisColumn(calculateColumn);

        const result = getChartOptionTitleText([calculateAnalysisColumn], gereralCategroyColumnList);
        const expectedTitleText = `${calculateAnalysisColumn.title} 的${CalculateTypeViewText[calculateAnalysisColumn.calculateType]} 依據 ${gereralCategroyColumnList[0].title}, ${gereralCategroyColumnList[1].title} 與 ${gereralCategroyColumnList[2].title}`
        expect(result).toBe(expectedTitleText);
    })
})