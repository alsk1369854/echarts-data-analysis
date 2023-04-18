import { AnalysisColumnValueType, NumberCalculateType, StringCalculateType } from "../Utils"
export { EChartsOption } from 'echarts';
// export type EChartsOption = any;

export interface Column {
    title: string,
    valueList: (string | number | null)[],
    calculateType?: StringCalculateType | NumberCalculateType,
}

export interface AnalysisColumn extends Column {
    valueType: AnalysisColumnValueType,
    calculateType: StringCalculateType | NumberCalculateType
}
