
export enum ChartType {
    // Bar charts
    stackedBar = "stackedBar",
    stackedHorizontalBar = "stackedHorizontalBar",
    groupBar = "groupBar",
    groupHorizontalBar = "groupHorizontalBar",
    waterfall = "waterfall",

    // Funnel charts
    basicFunnel = "basicFunnel",

    // Line charts
    stackedLine = "stackedLine",
    stackedAreaLine = "stackedAreaLine",

    // Pie charts
    basicPie = "basicPie",
    donut = "donut",

    // Radar Charts
    basicRadar = "basicRadar",

    // Scatter charts
    scatter = "scatter",

    // Sunburst charts
    basicSunburst = "basicSunburst",

    // Tree map charts
    basicTreeMap = "basicTreeMap",
}

export enum AnalysisColumnValueType {
    string = "string",
    number = "number"
}

export enum StringCalculateType {
    count = "count",
    countDifferent = "countDifferent",
}

export enum NumberCalculateType {
    sum = "sum",
    average = "average",
    min = "min",
    max = "max",
    count = "count",
    countDifferent = "countDifferent",
    standardDeviation = "standardDeviation",
    variance = "variance",
    median = "median",
}

export enum CalculateTypeViewText {
    sum = "加總",
    average = "平均",
    min = "最小值",
    max = "最大值",
    count = "計數",
    countDifferent = "計數(相異)",
    standardDeviation = "標準差",
    variance = "變異數",
    median = "中間值",
}


