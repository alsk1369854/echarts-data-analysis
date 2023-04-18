import { Column, EChartsOption, getBasicPieChartOptions } from "../../..";

export const getDonutChartOptions = (
    categoryColumn: Column,
    valueColumn: Column,
    callbackFunc?: (eChartsOption: EChartsOption) => void
): EChartsOption => {
    let eChartsOption = getBasicPieChartOptions(categoryColumn, valueColumn);

    // update inside radius
    if (eChartsOption && eChartsOption.series) {
        eChartsOption.series = {
            ...eChartsOption.series,
            radius: ['40%', '80%'],
        } as any
    }

    if (callbackFunc) callbackFunc(eChartsOption);
    return eChartsOption;
}
