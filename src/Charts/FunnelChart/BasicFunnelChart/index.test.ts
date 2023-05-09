import { AnalysisColumnValueType, NumberCalculateType } from '../../../Utils'
import { AnalysisColumn, Column } from '../../../interfaces'
import { getBasicFunnelChartOptions } from './index'
import { SeriesDataItem } from './interfaces'

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

describe("BasicFunnelChart", () => {
    test('getBasicFunnelChartOptions callback function 1', () => {
        const testFunc = jest.fn();
        getBasicFunnelChartOptions(categoryColumn, calculateColumn, testFunc);
        expect(testFunc).toBeCalledTimes(1);
    })
    test('getBasicFunnelChartOptions callback function 2', () => {
        let resultFromCallback: any;

        const resultFromReturn = getBasicFunnelChartOptions(categoryColumn, calculateColumn, (option) => {
            resultFromCallback = option;
        });
        expect(resultFromReturn).toEqual(resultFromCallback);
    })

    test('getBasicFunnelChartOptions legend data', () => {
        const result: any = getBasicFunnelChartOptions(categoryColumn, calculateColumn);
        const expected: string[] = ["OK", "WARN", "NG"];
        expect(result.legend.data).toEqual(expected);
    })

    test('getBasicFunnelChartOptions series data', () => {
        const result: any = getBasicFunnelChartOptions(categoryColumn, calculateColumn);
        const expected: SeriesDataItem[] = [
            {
                name: "OK",
                value: 10
            }, {
                name: "WARN",
                value: 15
            }, {
                name: "NG",
                value: 75
            }
        ];
        expect(result.series.data).toEqual(expected);
    })
})