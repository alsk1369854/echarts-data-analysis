import { Column, EChartsOption } from "../../..";
import { getBasicPieChartOptions } from "../BasicPieChart";

export const getDonutChartOptions = (
    categoryColumn: Column<string | number | null>,
    valueColumn: Column<string | number | null>,
    callbackFunc?: (eChartsOption: EChartsOption) => void
): EChartsOption => {
    let eChartsOption = getBasicPieChartOptions(categoryColumn, valueColumn);

    // update series radius
    if (eChartsOption && eChartsOption.series) {
        eChartsOption.series = {
            ...eChartsOption.series,
            radius: ['40%', '80%'],
        } as any
    }

    if (callbackFunc) callbackFunc(eChartsOption);
    return eChartsOption;
}
