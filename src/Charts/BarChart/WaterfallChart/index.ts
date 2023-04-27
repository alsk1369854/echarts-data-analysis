import { DEFAULT_ECHARTES_OPTIONS_GRID, DEFAULT_ECHARTES_OPTIONS_LEGEND, DEFAULT_ECHARTES_OPTIONS_TOOLBOX } from "../../../configs/ChartsOptionConfig";
import { Column, EChartsOption } from "../../../interfaces";
import { getGroupBarChartOptions } from "../GroupBarChart";

const DEFAULT_ECHARTS_OPTION: EChartsOption = {
    title: {
        text: 'Chart',
    },
    legend: { show: false },
    grid: DEFAULT_ECHARTES_OPTIONS_GRID,
    toolbox: DEFAULT_ECHARTES_OPTIONS_TOOLBOX,
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },
        formatter: function (params: any) {
            var tar = params[1];
            return tar.name + '<br/>' + "Value" + ' : ' + tar.value;
        }
    },
    xAxis: {
        type: 'category',
        splitLine: { show: false },
        data: ['Total', 'Rent', 'Utilities', 'Transportation', 'Meals', 'Other']
    },
    yAxis: {
        type: 'value'
    },
    series: [
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
            data: [0, 1400, 1700, 1200, 300, 0]
        },
        {
            name: 'Bar ceil',
            type: 'bar',
            stack: 'Total',
            label: {
                show: true,
                position: 'inside'
            },
            data: [2900, 300, 1200, 200, 900, 300]
        }
    ]
};

export const getWaterfallChartOptions = (
    categoryColumn: Column<string | number | null>,
    yAxisColumn: Column<string | number | null>,
    callbackFunc?: (eChartsOption: EChartsOption) => void
): EChartsOption => {
    let eChartsOption = getGroupBarChartOptions(categoryColumn, [yAxisColumn]);

    // update option tooltip
    // - custom tooltip window
    eChartsOption.tooltip = {
        ...eChartsOption.tooltip,
        formatter: function (params: any) {
            var tar = params[1];
            return tar.name + '<br/>' + "Value" + ' : ' + tar.value;
        }
    };

    // update option legend
    // - hide legend
    eChartsOption.legend = {
        ...eChartsOption.legend,
        show: false,
    };

    // update option xAxis
    // - splitLine : remove between bar and bar line
    // - data : add total category
    let newXAxis = {
        ...eChartsOption.xAxis,
        splitLine: { show: false },
        data: [...(eChartsOption.xAxis as any).data, "Total"]
    }
    eChartsOption.xAxis = newXAxis;


    // update option series
    let newSeries: any[] = [
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
            data: [] // prepare bar ceil data list
        }, {
            name: 'value',
            type: 'bar',
            stack: 'Total',
            label: {
                show: true,
                position: 'inside'
            },
            data: [] // prepare bar floor data list
        }
    ]
    let newSeriesBarFloorData: number[] = [];
    let newSeriesBarValueData: number[] = [];
    if (eChartsOption.series) {
        const categoryValueList = (eChartsOption.series as any)[0].data as number[];
        let sum = 0;
        for (let i = 0; i < categoryValueList.length; i++) {
            newSeriesBarFloorData.push(sum);

            const categoryValue = categoryValueList[i];
            sum += categoryValue;
            newSeriesBarValueData.push(categoryValue);
        }

        newSeriesBarFloorData.push(0);
        newSeriesBarValueData.push(sum);
    }
    newSeries[0].data = newSeriesBarFloorData;
    newSeries[1].data = newSeriesBarValueData;
    eChartsOption.series = newSeries;


    if (callbackFunc) callbackFunc(eChartsOption);
    return eChartsOption;
}

