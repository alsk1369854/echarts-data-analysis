# ECharts Data Analysis ![check-code-coverage](https://img.shields.io/badge/code--coverage-99.28%25-brightgreen)

## Quick start (快速開始)

### HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ECharts Data Analysis</title>
</head>
<body>

    <!-- prepare a defined hight and width DOM for ECharts -->
    <!-- 為 ECharts 準備一個定義了寬高的 DOM -->
    <div id="main" style="width: 600px;height:400px;"></div>

    <script src="./dist/index.min.js"></script>
</body>
</html>
```

### TypeScript

```typescript
// import ECharts library
import { init, EChartsType } from 'echarts'
// import echarts-data-analysis library
import { Column, NumberCalculateType, StringCalculateType, EChartsDataAnalysis, AnalysisColumn, getColumnValueListType } from '../../dist'


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
const yAxisColumnList: AnalysisColumn<any>[] = [
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
EChartsDataAnalysis.getStackedBarChartOptions(xAxisColumn, yAxisColumnList, (option) => {
    // set options for ECharts DOM
    // 為 ECharts DOM 設置配置項
    myChart.setOption(option);
})## Get ECharts option functions (獲取圖表方法)
```





## Enum

### ChartType (圖表類型)

| Key                  | Value                |
| -------------------- | -------------------- |
| stackedBar           | stackedBar           |
| stackedHorizontalBar | stackedHorizontalBar |
| groupBar             | groupBar             |
| groupHorizontalBar   | groupHorizontalBar   |
| stackedLine          | stackedLine          |
| stackedAreaLine      | stackedAreaLine      |
| scatter              | scatter              |
| pie                  | pie                  |
| donut                | donut                |
| sunburst             | sunburst             |
| radar                | radar                |

### AnalysisColumnValueType (列值類型)

| Key    | Value  |
| ------ | ------ |
| string | string |
| number | number |

### StringCalculateType (字串列計算類型)

| key            | Value          |
| -------------- | -------------- |
| count          | count          |
| countDifferent | countDifferent |

### NumberCalculateType (數值列計算類型)

| Key               | Value             |
| ----------------- | ----------------- |
| sum               | sum               |
| average           | average           |
| min               | min               |
| max               | max               |
| count             | count             |
| countDifferent    | countDifferent    |
| standardDeviation | standardDeviation |
| variance          | variance          |
| median            | median            |

### CalculateTypeViewText (計算類型呈現文字_繁體中文)

| Key               | Value  |
| ----------------- | ------ |
| sum               | 加總     |
| average           | 平均     |
| min               | 最小值    |
| max               | 最大值    |
| count             | 計數     |
| countDifferent    | 計數(相異) |
| standardDeviation | 標準差    |
| variance          | 變異數    |
| median            | 中間值    |

## interfaces

### Column (列接口)

| Value          | Type                                       | Description                               |
| -------------- | ------------------------------------------ | ----------------------------------------- |
| title          | string                                     | Column title \| 列標頭名                      |
| valueList      | string[] \| number[]                       | Column values \| 列數據                      |
| calculateType? | StringCalculateType \| NumberCalcylateType | Calculate type of column value \| 列值的計算類型 |

### AnalysisColumn extends Column (分析列接口)

| Key       | Type                    | Description                  |
| --------- | ----------------------- | ---------------------------- |
| valueType | AnalysisColumnValueType | Column values type  \| 列值的類型 |
