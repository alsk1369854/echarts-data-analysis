import { createAnalysisColumn, createCategoryColumn, filterOutListEmptyValues, getColumnValueCategoryCorrespondsOtherColumnValueListMap, getValueListCalculateValue, swapXAxisAndYAxis } from "../../../Utils";
import { getChartOptionTitleText } from "../../../Utils/ChartUtil";
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
            // stack: 'total', // stacked bar option
            label: {
                show: true
            },
            emphasis: {
                focus: 'series'
            },
            data: [320, 302, 301, 334, 390, 330, 320]
        },
    ]
};

const getSeriesItem = (
    xAxisColumnValueCategoryCorrespondsYAxisColumnsValueListMap: Map<string, Map<string, (string | number | null)[]>>,
    yAxisColumn: AnalysisColumn<number | string | null>
): any => {
    let {
        title: yAxisTitle,
        calculateType: yAxisCalculateType,
    } = yAxisColumn;

    let seriesData: any[] = [];
    xAxisColumnValueCategoryCorrespondsYAxisColumnsValueListMap.forEach((yAxisValueListMap, xAxisValueCategory) => {
        const correspondsYAxisValueList = yAxisValueListMap.get(yAxisTitle);
        let generalYAxisValueList: (string | number)[] = [];
        let value = 0;
        if (correspondsYAxisValueList) {
            generalYAxisValueList = filterOutListEmptyValues(correspondsYAxisValueList) as (string | number)[];
            value = getValueListCalculateValue(generalYAxisValueList, yAxisCalculateType);
        }
        seriesData.push(value);
    })

    return {
        name: yAxisTitle,
        type: 'bar',
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
    xAxisColumn: Column<string | number | null>,
    yAxisColumnList: Column<string | number | null>[],
    callbackFunc?: (eChartsOption: EChartsOption) => void
): EChartsOption => {
    // init return value
    let eChartsOption: EChartsOption = { ...DEFAULT_ECHART_OPTIONS };

    // create analysis column
    const xAxisAnalysisColumn: Column<string> = createCategoryColumn(xAxisColumn);
    const yAxisAnalysisColumnList: AnalysisColumn<string | number | null>[] = yAxisColumnList.map(column => {
        return createAnalysisColumn(column);
    })

    // create x axis category corresponds y axis value list map
    const xAxisColumnValueCategoryCorrespondsYAxisColumnsValueListMap =
        getColumnValueCategoryCorrespondsOtherColumnValueListMap(xAxisAnalysisColumn, yAxisAnalysisColumnList);


    // update title text
    let newTitle = {
        ...eChartsOption.title,
        text: getChartOptionTitleText(yAxisAnalysisColumnList, [xAxisAnalysisColumn]),
    }
    eChartsOption.title = newTitle;

    // update xAxis data
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
        const seriesItem = getSeriesItem(xAxisColumnValueCategoryCorrespondsYAxisColumnsValueListMap, yAxisColumn);;
        newSeries.push(seriesItem);
    })
    eChartsOption.series = newSeries;

    if (callbackFunc) callbackFunc(eChartsOption);
    return eChartsOption;
}


export const getGroupHorizontalBarChart = (
    yAxisColumn: Column<string | number | null>,
    xAxisColumnList: Column<string | number | null>[],
    callbackFunc?: (eChartsOption: EChartsOption) => void
): EChartsOption => {
    let eChartsOption = getGroupBarChartOptions(yAxisColumn, xAxisColumnList);
    swapXAxisAndYAxis(eChartsOption);

    if (callbackFunc) callbackFunc(eChartsOption);
    return eChartsOption;
}