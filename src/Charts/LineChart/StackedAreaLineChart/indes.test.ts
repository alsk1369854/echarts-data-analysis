import { AnalysisColumnValueType, NumberCalculateType, StringCalculateType } from '../../../Utils'
import { AnalysisColumn, Column } from '../../../interfaces'
import { getStackedAreaLineChartOptions } from './index'

const testDataset = {
    deviceName: ["device_1", "device_2", "device_3", "device_1"],
    deviceState: ["OK", "WARN", "NG", "NG"],
    deviceValue: [10, 15, 30, 45]
}
const categoryColumn: Column<string> = {
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

describe("StackedAreaLineChart", () => {
    test('getStackedAreaLineChartOptions callback function 1', () => {
        const testFunc = jest.fn();
        getStackedAreaLineChartOptions(categoryColumn, calculateColumnList, testFunc);
        expect(testFunc).toBeCalledTimes(1);
    })
    test('getStackedAreaLineChartOptions callback function 2', () => {
        let resultFromCallback: any;

        const resultFromReturn = getStackedAreaLineChartOptions(categoryColumn, calculateColumnList, (option) => {
            resultFromCallback = option;
        });
        expect(resultFromReturn).toEqual(resultFromCallback);
    })

    test('getGroupBarChartOptions option xAxis data', () => {
        const result: any = getStackedAreaLineChartOptions(categoryColumn, calculateColumnList);
        const expected = ["OK", "WARN", "NG"];
        expect(result.xAxis.data).toEqual(expected);
    })

    test('getGroupBarChartOptions option series', () => {
        const result: any = getStackedAreaLineChartOptions(categoryColumn, calculateColumnList);
        const seriesItemOption = {
            type: 'line',
            label: {
                show: false
            },
            stack: 'total',
            areaStyle: {},
            barGap: 0,
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