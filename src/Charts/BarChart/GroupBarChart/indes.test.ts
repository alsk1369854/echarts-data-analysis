import { NumberCalculateType, StringCalculateType } from '../../../Utils'
import { Column } from '../../../interfaces'
import { getGroupBarChartOptions } from './index'

const testDataset = {
    deviceName: ["device_1", "device_2", "device_3", "device_1"],
    deviceState: ["OK", "WARN", "NG", "NG"],
    deviceValue: [10, 15, 30, 45]
}
const categoryColumn: Column<string> = {
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

describe("GroupBarChart", () => {
    test('getGroupBarChartOptions callback function 1', () => {
        const testFunc = jest.fn();
        getGroupBarChartOptions(categoryColumn, calculateColumnList, testFunc);
        expect(testFunc).toBeCalledTimes(1);
    })
    test('getGroupBarChartOptions callback function 2', () => {
        let resultFromCallback: any;

        const resultFromReturn = getGroupBarChartOptions(categoryColumn, calculateColumnList, (option) => {
            resultFromCallback = option;
        });
        expect(resultFromReturn).toEqual(resultFromCallback);
    })

    test('getGroupBarChartOptions option xAxis data', () => {
        const result: any = getGroupBarChartOptions(categoryColumn, calculateColumnList);
        const expected = ["OK", "WARN", "NG"];
        expect(result.xAxis.data).toEqual(expected);
    })

    test('getGroupBarChartOptions option series', () => {
        const result: any = getGroupBarChartOptions(categoryColumn, calculateColumnList);
        const seriesItemOption = {
            type: 'bar',
            barGap: 0,
            label: {
                show: true
            },
            emphasis: {
                focus: 'series'
            },
        }
        const expected = [
            {
                ...seriesItemOption,
                name: "deviceName",
                data: [1, 1, 2]
            }, {
                ...seriesItemOption,
                name: "deviceValue",
                data: [10, 15, 37.5]
            }, {
                ...seriesItemOption,
                name: "deviceState",
                data: [1, 1, 1]
            }
        ];
        expect(result.series).toEqual(expected);
    })
})