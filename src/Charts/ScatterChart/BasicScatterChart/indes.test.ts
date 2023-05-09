import { AnalysisColumnValueType, NumberCalculateType, StringCalculateType } from '../../../Utils'
import { AnalysisColumn, Column } from '../../../interfaces'
import { getBasicScatterChartOptions } from './index'

const testDataset = {
    deviceName: ["device_1", "device_2", "device_3", "device_1"],
    deviceState: ["OK", "WARN", "NG", "NG"],
    deviceValue: [10, 15, 30, 45]
}
const categoryColumn: Column<string> = {
    title: "deviceState",
    valueList: testDataset.deviceState,
}
const calculateColumn: AnalysisColumn<string | number> = {
    title: "deviceValue",
    valueType: AnalysisColumnValueType.number,
    valueList: testDataset.deviceValue,
    calculateType: NumberCalculateType.sum
}

describe("BasicScatterChart", () => {
    test('getBasicScatterChartOptions callback function 1', () => {
        const testFunc = jest.fn();
        getBasicScatterChartOptions(categoryColumn, calculateColumn, testFunc);
        expect(testFunc).toBeCalledTimes(1);
    })
    test('getBasicScatterChartOptions callback function 2', () => {
        let resultFromCallback: any;

        const resultFromReturn = getBasicScatterChartOptions(categoryColumn, calculateColumn, (option) => {
            resultFromCallback = option;
        });
        expect(resultFromReturn).toEqual(resultFromCallback);
    })

    test('getBasicScatterChartOptions option xAxis data', () => {
        const result: any = getBasicScatterChartOptions(categoryColumn, calculateColumn);
        const expected = ["OK", "WARN", "NG"];
        expect(result.xAxis.data).toEqual(expected);
    })

    test('getBasicScatterChartOptions option series', () => {
        const result: any = getBasicScatterChartOptions(categoryColumn, calculateColumn);
        const seriesItemOption = {
            type: 'line',
            stack: 'total',
            emphasis: {
                focus: 'series'
            },
            symbol: 'circle',
            label: {
                show: false
            },
            lineStyle: {
                width: 0
            },
        }
        const expected = [
            {
                ...seriesItemOption,
                name: "deviceValue",
                data: [10, 15, 75]
            }
        ];
        expect(result.series).toMatchObject(expected);
    })
})