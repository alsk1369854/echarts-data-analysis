import { AnalysisColumnValueType, NumberCalculateType, StringCalculateType } from '../../../Utils'
import { AnalysisColumn, Column } from '../../../interfaces'
import { getBasicSunburstChartOptions } from './index'

const testDataset = {
    deviceName: ["device_1", "device_2", "device_3", "device_1", "device_1"],
    deviceState: ["OK", "WARN", "NG", "NG", "OK"],
    deviceValue: [10, 15, 30, 45, 12]
}
const categoryColumnList: Column<string | number>[] = [
    {
        title: "deviceName",
        valueList: testDataset.deviceName,
    }, {
        title: "deviceState",
        valueList: testDataset.deviceState,
    }
]

const calculateColumn: AnalysisColumn<number> = {
    title: "deviceValue",
    valueType: AnalysisColumnValueType.number,
    valueList: testDataset.deviceValue,
    calculateType: NumberCalculateType.sum
}

describe("SunburstChartOptions", () => {
    test('getBasicSunburstChartOptions callback function 1', () => {
        const testFunc = jest.fn();
        getBasicSunburstChartOptions(categoryColumnList, calculateColumn, testFunc);
        expect(testFunc).toBeCalledTimes(1);
    })
    test('getBasicSunburstChartOptions callback function 2', () => {
        let resultFromCallback: any;

        const resultFromReturn = getBasicSunburstChartOptions(categoryColumnList, calculateColumn, (option) => {
            resultFromCallback = option;
        });
        expect(resultFromReturn).toEqual(resultFromCallback);
    })

    test("getBasicSunburstChartOptions series data", () => {
        const result: any = getBasicSunburstChartOptions(categoryColumnList, calculateColumn);

        const expected: any[] = [
            {
                name: "device_1",
                value: 67,
                children: [
                    {
                        name: "OK",
                        value: 22
                    }, {
                        name: "NG",
                        value: 45
                    }
                ]
            }, {
                name: "device_2",
                value: 15,
                children: [
                    {
                        name: "WARN",
                        value: 15
                    }
                ]
            }, {
                name: "device_3",
                value: 30,
                children: [
                    {
                        name: "NG",
                        value: 30
                    }
                ]
            },
        ];
        expect(result.series.data).toMatchObject(expected);
    })
})