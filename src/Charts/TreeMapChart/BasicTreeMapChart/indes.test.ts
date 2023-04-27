import { NumberCalculateType, StringCalculateType } from '../../../Utils'
import { Column } from '../../../interfaces'
import { getBasicTreeMapChartOptions } from './index'

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

describe("BasicTreeMapChart", () => {
    test('getBasicTreeMapChartOptions callback function 1', () => {
        const testFunc = jest.fn();
        getBasicTreeMapChartOptions(categoryColumn, calculateColumnList, testFunc);
        expect(testFunc).toBeCalledTimes(1);
    })
    test('getBasicTreeMapChartOptions callback function 2', () => {
        let resultFromCallback: any;

        const resultFromReturn = getBasicTreeMapChartOptions(categoryColumn, calculateColumnList, (option) => {
            resultFromCallback = option;
        });
        expect(resultFromReturn).toEqual(resultFromCallback);
    })

    test("getBasicTreeMapChartOptions series data", () => {

        const result: any = getBasicTreeMapChartOptions(categoryColumn, calculateColumnList);

        const expected: any[] = [
            {
                name: categoryColumn.valueList[0],
                value: 12,
                children: [
                    {
                        name: calculateColumnList[0].title,
                        value: 1
                    }, {
                        name: calculateColumnList[1].title,
                        value: 10
                    }, {
                        name: calculateColumnList[2].title,
                        value: 1
                    }
                ]
            }, {
                name: categoryColumn.valueList[1],
                value: 17,
                children: [
                    {
                        name: calculateColumnList[0].title,
                        value: 1
                    }, {
                        name: calculateColumnList[1].title,
                        value: 15
                    }, {
                        name: calculateColumnList[2].title,
                        value: 1
                    }
                ]
            }, {
                name: categoryColumn.valueList[2],
                value: 40.5,
                children: [
                    {
                        name: calculateColumnList[0].title,
                        value: 2
                    }, {
                        name: calculateColumnList[1].title,
                        value: 37.5
                    }, {
                        name: calculateColumnList[2].title,
                        value: 1
                    }
                ]
            }
        ];
        expect(result.series.data).toMatchObject(expected);
    })
})