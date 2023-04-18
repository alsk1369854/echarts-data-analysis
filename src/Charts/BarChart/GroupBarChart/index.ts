import { createAnalysisColumn, getColumnValueCategoryCorrespondsOtherColumnValueListMap, getListMedian, getListStandardDeviation, getListVariance, getMinColumnLength, swapXAxisAndYAxis } from "../../../Utils";
import { AnalysisColumnValueType, CalculateTypeViewText, NumberCalculateType, StringCalculateType } from "../../../Utils/BasicEnum";
import { AnalysisColumn, Column, EChartsOption } from './../../../interfaces';

const DEFAULT_ECHART_OPTIONS: EChartsOption = {
    title: {
        text: "圖表",
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        top: 30,
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        show: true,
        //     orient: 'vertical',
        //     left: 'right',
        top: 30,
        feature: {
            //         mark: { show: true },
            //         dataView: { show: true, readOnly: false },
            //         magicType: { show: true, type: ['line', 'bar', 'stack'] },
            //         restore: { show: true },
            saveAsImage: { show: true }
        }
    },
    xAxis: {
        axisLabel: {
            interval: 0 // 強制顯示所有標籤
        },
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: 'Direct',
            type: 'bar',
            stack: 'total',
            label: {
                show: true
            },
            emphasis: {
                focus: 'series'
            },
            data: [320, 302, 301, 334, 390, 330, 320]
        },
        {
            name: 'Mail Ad',
            type: 'bar',
            stack: 'total',
            label: {
                show: true
            },
            emphasis: {
                focus: 'series'
            },
            data: [120, 132, 101, 134, 90, 230, 210]
        },
    ]
};


const getSeriesByStringValueColumn = (
    xAxisCorrespondsYAxisMap: Map<string, Map<string, (string[] | number[])>>,
    yAxisColumn: AnalysisColumn
): {} => {
    let {
        title: yAxisTitle,
        calculateType: yAxisCalculateType,
    } = yAxisColumn;

    let seriesData: any[] = [];
    switch (yAxisCalculateType) {
        case StringCalculateType.countDifferent:
            xAxisCorrespondsYAxisMap.forEach((yAxisValueListMap, xAxisValueCategory) => {
                let yAxisValueList = yAxisValueListMap.get(yAxisTitle) as string[];
                const countDifferent = new Set(yAxisValueList).size;
                seriesData.push(countDifferent);
            })
            break;
        case StringCalculateType.count:
            xAxisCorrespondsYAxisMap.forEach((yAxisValueListMap, xAxisValueCategory) => {
                let yAxisValueList = yAxisValueListMap.get(yAxisTitle) as string[];
                const count = yAxisValueList.length;
                seriesData.push(count);
            })
            break;
    }

    return {
        name: yAxisTitle,
        type: 'bar',
        barGap: 0,
        // stack: 'total',
        label: {
            show: true
        },
        emphasis: {
            focus: 'series'
        },
        data: seriesData
    }
}

const getSeriesByNumberValueColumn = (
    xAxisCorrespondsYAxisMap: Map<string, Map<string, (string[] | number[])>>,
    yAxisColumn: AnalysisColumn
): {} => {
    let {
        title: yAxisTitle,
        calculateType: yAxisCalculateType,
    } = yAxisColumn;

    let seriesData: any[] = [];
    switch (yAxisCalculateType) {
        case NumberCalculateType.sum:
            xAxisCorrespondsYAxisMap.forEach((yAxisValueListMap, xAxisValueCategory) => {
                let yAxisValueList = yAxisValueListMap.get(yAxisTitle) as number[];
                const sum = yAxisValueList.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                seriesData.push(sum);
            })
            break;
        case NumberCalculateType.average:
            xAxisCorrespondsYAxisMap.forEach((yAxisValueListMap, xAxisValueCategory) => {
                let yAxisValueList = yAxisValueListMap.get(yAxisTitle) as number[];
                const sum = yAxisValueList.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                const count = yAxisValueList.length;
                seriesData.push((sum / count).toFixed(2));
            })
            break;
        case NumberCalculateType.min:
            xAxisCorrespondsYAxisMap.forEach((yAxisValueListMap, xAxisValueCategory) => {
                let yAxisValueList = yAxisValueListMap.get(yAxisTitle) as number[];
                // const min = Math.min(...yAxisValueList);
                let min = (yAxisValueList.length > 0) ? Number.MAX_VALUE : 0;
                yAxisValueList.forEach(value => { min = Math.min(value, min) });
                seriesData.push(min);
            })
            break;
        case NumberCalculateType.max:
            xAxisCorrespondsYAxisMap.forEach((yAxisValueListMap, xAxisValueCategory) => {
                let yAxisValueList = yAxisValueListMap.get(yAxisTitle) as number[];
                // const max = Math.max(...yAxisValueList);
                let max = (yAxisValueList.length > 0) ? Number.MIN_VALUE : 0;
                yAxisValueList.forEach(value => { max = Math.max(value, max) });
                seriesData.push(max);
            })
            break;
        case NumberCalculateType.countDifferent:
            xAxisCorrespondsYAxisMap.forEach((yAxisValueListMap, xAxisValueCategory) => {
                let yAxisValueList = yAxisValueListMap.get(yAxisTitle) as number[];
                const countDifferent = new Set(yAxisValueList).size;
                seriesData.push(countDifferent);
            })
            break;
        case NumberCalculateType.count:
            xAxisCorrespondsYAxisMap.forEach((yAxisValueListMap, xAxisValueCategory) => {
                let yAxisValueList = yAxisValueListMap.get(yAxisTitle) as number[];
                const count = yAxisValueList.length;
                seriesData.push(count);
            })
            break;
        case NumberCalculateType.standardDeviation:
            xAxisCorrespondsYAxisMap.forEach((yAxisValueListMap, xAxisValueCategory) => {
                let yAxisValueList = yAxisValueListMap.get(yAxisTitle) as number[];
                const standardDeviation = getListStandardDeviation(yAxisValueList);
                seriesData.push(standardDeviation.toFixed(2));
            })
            break;
        case NumberCalculateType.variance:
            xAxisCorrespondsYAxisMap.forEach((yAxisValueListMap, xAxisValueCategory) => {
                let yAxisValueList = yAxisValueListMap.get(yAxisTitle) as number[];
                const variance = getListVariance(yAxisValueList);
                seriesData.push(variance.toFixed(2));
            })
            break;
        case NumberCalculateType.median:
            xAxisCorrespondsYAxisMap.forEach((yAxisValueListMap, xAxisValueCategory) => {
                let yAxisValueList = yAxisValueListMap.get(yAxisTitle) as number[];
                const median = getListMedian(yAxisValueList);
                seriesData.push(median);
            })
            break;
    }

    return {
        name: yAxisTitle,
        type: 'bar',
        stack: 'total',
        label: {
            show: true
        },
        emphasis: {
            focus: 'series'
        },
        data: seriesData
    }
}


export const getGroupBarChartOptions = (
    xAxisColumn: Column,
    yAxisColumnList: Column[],
    callbackFunc?: (eChartsOption: EChartsOption) => void
): EChartsOption => {
    // init return value
    let eChartsOption: EChartsOption = { ...DEFAULT_ECHART_OPTIONS };

    // create analysis column
    const xAxisAnalysisColumn: AnalysisColumn = createAnalysisColumn(xAxisColumn);
    const yAxisAnalysisColumnList: AnalysisColumn[] = yAxisColumnList.map(column => {
        return createAnalysisColumn(column);
    })
    const { title: xAxisValueCategory } = xAxisAnalysisColumn;

    // create x axis category corresponds y axis value list map
    const xAxisColumnValueCategoryCorrespondsYAxisColumnsValueListMap =
        getColumnValueCategoryCorrespondsOtherColumnValueListMap(xAxisAnalysisColumn, yAxisAnalysisColumnList);


    // update title
    let newTitle = {
        text: "",
    }
    yAxisAnalysisColumnList.forEach((yAxisColumn, index) => {
        let {
            title: yAxisTitle,
            calculateType: yAxisCalculateType,
        } = yAxisColumn;
        const calculateViewText = CalculateTypeViewText[yAxisCalculateType];
        newTitle.text = newTitle.text + `${yAxisTitle} 的${calculateViewText}`
        if (index !== yAxisAnalysisColumnList.length - 1) {
            newTitle.text = newTitle.text + " 與 ";
        }
    })
    newTitle.text = newTitle.text + ` 依據 ${xAxisValueCategory}`;
    eChartsOption.title = newTitle;


    // update xAxis
    let newXAxis: any = {
        ...eChartsOption.xAxis,
        data: []
    };
    xAxisColumnValueCategoryCorrespondsYAxisColumnsValueListMap.forEach((value, key) => {
        newXAxis.data.push(key);
    });
    eChartsOption.xAxis = newXAxis;


    // update series
    let newSeries: any[] = [];
    yAxisAnalysisColumnList.forEach(yAxisColumn => {
        const { valueType: yAxisValueType } = yAxisColumn;
        let seriesItem = {};
        switch (yAxisValueType) {
            case AnalysisColumnValueType.number:
                seriesItem = getSeriesByNumberValueColumn(xAxisColumnValueCategoryCorrespondsYAxisColumnsValueListMap, yAxisColumn);
                break;
            case AnalysisColumnValueType.string:
            default:
                seriesItem = getSeriesByStringValueColumn(xAxisColumnValueCategoryCorrespondsYAxisColumnsValueListMap, yAxisColumn);
        }
        newSeries.push(seriesItem);
    })
    eChartsOption.series = newSeries;

    if (callbackFunc) callbackFunc(eChartsOption);
    return eChartsOption;
}


export const getGroupHorizontalBarChart = (
    yAxisColumn: Column,
    xAxisColumnList: Column[],
    callbackFunc?: (eChartsOption: EChartsOption) => void
): EChartsOption => {
    let eChartsOption = getGroupBarChartOptions(yAxisColumn, xAxisColumnList);
    swapXAxisAndYAxis(eChartsOption);

    if (callbackFunc) callbackFunc(eChartsOption);
    return eChartsOption;
}