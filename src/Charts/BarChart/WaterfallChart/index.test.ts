import { NumberCalculateType, StringCalculateType } from '../../../Utils'
import { Column } from '../../../interfaces'
import { getWaterfallChartOptions } from './index'

const testDataset = {
    deviceName: ["device_1", "device_2", "device_3", "device_1"],
    deviceState: ["OK", "WARN", "NG", "NG"],
    deviceValue: [10, 15, 30, 45]
}
const categoryColumn: Column<string> = {
    title: "deviceState",
    valueList: testDataset.deviceState,
}

const calculateColumn: Column<number> = {
    title: "deviceValue",
    valueList: testDataset.deviceValue,
    calculateType: NumberCalculateType.sum
}


describe("WaterfallChart", () => {
    test('getWaterfallChartOptions callback function 1', () => {
        const testFunc = jest.fn();
        getWaterfallChartOptions(categoryColumn, calculateColumn, testFunc);
        expect(testFunc).toBeCalledTimes(1);
    })
    test('getWaterfallChartOptions callback function 2', () => {
        let resultFromCallback: any;

        const resultFromReturn = getWaterfallChartOptions(categoryColumn, calculateColumn, (option) => {
            resultFromCallback = option;
        });
        expect(resultFromReturn).toEqual(resultFromCallback);
    })

    test("getWaterfallChartOptions tooltip formatter", () => {
        const result: any = getWaterfallChartOptions(categoryColumn, calculateColumn);
        expect(typeof result.tooltip.formatter).toBe("function");
    })

    test("getWaterfallChartOptions legend show", () => {
        const result: any = getWaterfallChartOptions(categoryColumn, calculateColumn);
        expect(result.legend.show).toBe(false);
    })

    test("getWaterfallChartOptions xAxis splitLine", () => {
        const result: any = getWaterfallChartOptions(categoryColumn, calculateColumn);
        expect(result.xAxis.splitLine.show).toBe(false);
    })

    test("getWaterfallChartOptions xAxis data 'Total' category", () => {
        const result: any = getWaterfallChartOptions(categoryColumn, calculateColumn);
        expect(result.xAxis.data[result.xAxis.data.length - 1]).toBe("Total");
    })

    test("getWaterfallChartOptions series", () => {
        const result: any = getWaterfallChartOptions(categoryColumn, calculateColumn);
        const expected = [
            {
                name: 'Bar floor',
                type: 'bar',
                stack: 'Total',
                itemStyle: {
                    borderColor: 'transparent',
                    color: 'transparent'
                },
                emphasis: {
                    itemStyle: {
                        borderColor: 'transparent',
                        color: 'transparent'
                    }
                },
                data: [0, 10, 25, 0]
            }, {
                name: 'value',
                type: 'bar',
                stack: 'Total',
                label: {
                    show: true,
                    position: 'inside'
                },
                data: [10, 15, 75, 100]
            }
        ]
        expect(result.series).toEqual(expected);
    })
})