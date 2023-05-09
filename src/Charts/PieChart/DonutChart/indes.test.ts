import { AnalysisColumnValueType, NumberCalculateType, StringCalculateType } from '../../../Utils'
import { AnalysisColumn, Column } from '../../../interfaces'
import { getDonutChartOptions } from './index'

const testDataset = {
    deviceName: ["device_1", "device_2", "device_3", "device_1"],
    deviceState: ["OK", "WARN", "NG", "NG"],
    deviceValue: [10, 15, 30, 45]
}
const categoryColumn: Column<string> = {
    title: "deviceState",
    valueList: testDataset.deviceState,
}
const calculateColumn: AnalysisColumn<number> = {
    title: "deviceValue",
    valueType: AnalysisColumnValueType.number,
    valueList: testDataset.deviceValue,
    calculateType: NumberCalculateType.sum
}

describe("DonutChart", () => {
    test('getDonutChartOptions callback function 1', () => {
        const testFunc = jest.fn();
        getDonutChartOptions(categoryColumn, calculateColumn, testFunc);
        expect(testFunc).toBeCalledTimes(1);
    })
    test('getDonutChartOptions callback function 2', () => {
        let resultFromCallback: any;

        const resultFromReturn = getDonutChartOptions(categoryColumn, calculateColumn, (option) => {
            resultFromCallback = option;
        });
        expect(resultFromReturn).toEqual(resultFromCallback);
    })

    test('getDonutChartOptions option series data', () => {
        const result: any = getDonutChartOptions(categoryColumn, calculateColumn);
        const expected = [
            { value: 10, name: 'OK' },
            { value: 15, name: 'WARN' },
            { value: 75, name: 'NG' },
        ];
        expect(result.series.data).toEqual(expected);
    })

    test('getDonutChartOptions option series radius', () => {
        const result: any = getDonutChartOptions(categoryColumn, calculateColumn);
        expect(result.series).toHaveProperty('radius', ['40%', '80%']);
    })

})