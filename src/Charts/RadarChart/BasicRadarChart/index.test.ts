import { CalculateTypeViewText, NumberCalculateType, StringCalculateType } from '../../../Utils'
import { Column } from '../../../interfaces'
import { getRadarChartOptions } from './index'

const testDataset = {
    deviceName: ["device_1", "device_2", "device_3"],
    deviceState: ["OK", "WARN", "NG"],
    deviceValue: [10, 15, 30]
}
const categoryColumn: Column<string> = {
    title: "deviceState",
    valueList: testDataset.deviceState,
}
const yAxisColumnList: Column<string | number>[] = [
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
    test('getRadarChartOptions callback function 1', () => {
        const testFunc = jest.fn();
        getRadarChartOptions(categoryColumn, yAxisColumnList, testFunc);
        expect(testFunc).toBeCalledTimes(1);
    })
    test('getRadarChartOptions callback function 2', () => {
        let resultFromCallback: any;

        const resultFromReturn = getRadarChartOptions(categoryColumn, yAxisColumnList, (option)=>{
            resultFromCallback = option;
        });
        expect(resultFromReturn).toEqual(resultFromCallback);
    })

    test('getRadarChartOptions option legend data', () => {
        const option: any = getRadarChartOptions(categoryColumn, yAxisColumnList);
        const expected: string[] = yAxisColumnList.map(column => column.title);
        expect(option.legend.data).toEqual(expected);
    })

    test('getRadarChartOptions option radar indicator', () => {
        const option: any = getRadarChartOptions(categoryColumn, yAxisColumnList);
        const expected: any[] = [
            { name: categoryColumn.valueList[0], max: yAxisColumnList[1].valueList[0] },
            { name: categoryColumn.valueList[1], max: yAxisColumnList[1].valueList[1] },
            { name: categoryColumn.valueList[2], max: yAxisColumnList[1].valueList[2] },
        ];
        expect(option.radar.indicator).toEqual(expected);
    })

    test('getRadarChartOptions option series data', () => {
        const option: any = getRadarChartOptions(categoryColumn, yAxisColumnList);
        const expected: any[] = [
            {
                value: [1, 1, 1],
                name: yAxisColumnList[0].title
            }, {
                value: [10, 15, 30],
                name: yAxisColumnList[1].title
            }, {
                value: [1, 1, 1],
                name: yAxisColumnList[2].title
            }
        ];
        expect(option.series.data).toEqual(expected);
    })
})
