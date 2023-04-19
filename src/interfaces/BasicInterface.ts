import { AnalysisColumnValueType, NumberCalculateType, StringCalculateType } from "../Utils"
export { EChartsOption } from 'echarts';
// export type EChartsOption = any;

export type myColumnValueType = string | number | null;

export interface Column<T extends string | number | null> {
    title: string,
    valueList: T[],
    calculateType?: StringCalculateType | NumberCalculateType,
}

export interface AnalysisColumn<T extends string | number | null> extends Column<T> {
    valueType: AnalysisColumnValueType,
    calculateType: StringCalculateType | NumberCalculateType
}
