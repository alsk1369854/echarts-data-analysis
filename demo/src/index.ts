// import ECharts library
import { EChartsOption, init, EChartsType } from 'echarts'
// import echarts-data-analysis library
import { Column, NumberCalculateType, StringCalculateType, getStackedBarChartOptions } from '../../dist'


// basic preparation DOM initialization ECharts
// 基於準備好的 DOM，初始化 ECharts
let myChart: EChartsType = init(document.getElementById('main') as HTMLElement);

// chart analysis dataset
// 圖表分析資料集
const myDataset: {} = {
    設備名稱: ["device_1", "device_2", "device_3"],
    設備狀態: ["OK", "WARN", "NG"],
    設備數值: [10, 15, 30]
}

// create column object
// 建立列物件
const xAxisColumn: Column = {
    title: "設備名稱",
    valueList: myDataset["設備名稱"]
}
const yAxisColumnList: Column[] = [
    {
        title: "設備狀態",
        valueList: myDataset["設備狀態"],
        calculateType: StringCalculateType.count,
    },
    {
        title: "設備數值",
        valueList: myDataset["設備數值"],
        calculateType: NumberCalculateType.average,
    }
]

// get ECharts stacked bar chart options according to columns
// 根據列數據獲取 ECharts 堆積條形圖配置項
getStackedBarChartOptions(xAxisColumn, yAxisColumnList, (option: EChartsOption) => {
    // set options for ECharts DOM
    // 為 ECharts DOM 設置配置項
    myChart.setOption(option);
})


