import { CalculateTypeViewText, NumberCalculateType, StringCalculateType } from '../../../Utils'
import { Column } from '../../../interfaces'
import { getRadarChartOptions } from './index'

const testDataset = {
    deviceName: ["device_1", "device_2", "device_3"],
    deviceState: ["OK", "WARN", "NG"],
    deviceValue: [10, 15, 30]
}
const categoryColumn: Column = {
    title: "deviceState",
    valueList: testDataset.deviceState,
}
const yAxisColumnList: Column[] = [
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

describe('Basic Radar Chart', () => {
    test('getRadarChartOptions callback function', () => {
        const testFunc = jest.fn();
        getRadarChartOptions(categoryColumn, yAxisColumnList, testFunc);
        expect(testFunc).toBeCalledTimes(1);
    })

    test('getRadarChartOptions option legend', () => {
        const option: any = getRadarChartOptions(categoryColumn, yAxisColumnList);
        const expectedLegend: any = {
            data: yAxisColumnList.map((column: Column) => column.title)
        }
        expect(option.legend).toEqual(expectedLegend);
    })
})
