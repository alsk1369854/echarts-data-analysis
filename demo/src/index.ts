// import ECharts library
import { EChartsOption, init, EChartsType } from 'echarts'
// import echarts-data-analysis library
import { Column, NumberCalculateType, StringCalculateType, EChartsDataAnalysis } from '../../dist'


// basic preparation DOM initialization ECharts
// 基於準備好的 DOM，初始化 ECharts
let myChart: EChartsType = init(document.getElementById('main') as HTMLElement);

// chart analysis dataset
// 圖表分析資料集
const myDataset: any = {
    設備名稱: ["Device 01", "Device 02", "Device 03", "Device 04"],
    設備狀態: ["OK", "NG", "WARN", "OK"],
    設備數值: [10, 30, 15, 9]
}

// create column object
// 建立列物件
const xAxisColumn: Column<string> = {
    title: "設備名稱",
    valueList: myDataset["設備名稱"]
}
const yAxisColumnList: Column<any>[] = [
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
// getStackedBarChartOptions(xAxisColumn, yAxisColumnList, (option: EChartsOption) => {
// getBasicPieChartOptions(xAxisColumn, yAxisColumnList[1], (option: EChartsOption) => {
//     console.log(option)
//     // set options for ECharts DOM
//     // 為 ECharts DOM 設置配置項
//     myChart.setOption(option);
// })

// EChartsDataAnalysis.getRadarChartOptions(xAxisColumn, yAxisColumnList, (option)=>{
//     console.log(option)
//     myChart.setOption(option);
// })

EChartsDataAnalysis.getDonutChartOptions(xAxisColumn, yAxisColumnList[0], (option) => {
    console.log(option)
    myChart.setOption(option);
})

// EChartsDataAnalysis.getBasicTreeMapChartOptions(xAxisColumn, yAxisColumnList, (option) => {
//     console.log(option)
//     myChart.setOption(option);
// })


// EChartsDataAnalysis.getWaterfallChartOptions(xAxisColumn, yAxisColumnList[1], (option) => {
//     console.log(option)
//     myChart.setOption(option);
// })


// EChartsDataAnalysis.getBasicFunnelChartOptions(xAxisColumn, yAxisColumnList[1], (option) => {
//     console.log(option)
//     myChart.setOption(option);
// })
