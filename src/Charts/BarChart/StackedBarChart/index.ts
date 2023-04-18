import { Column, EChartsOption } from './../../../interfaces';
import { getGroupBarChartOptions } from "../GroupBarChart";
import { swapXAxisAndYAxis } from '../../../Utils';


export const getStackedBarChartOptions = (
  xAxisColumn: Column,
  yAxisColumnList: Column[],
  callbackFunc?: (eChartsOption: EChartsOption) => void
): EChartsOption => {
  let eChartsOption = getGroupBarChartOptions(xAxisColumn, yAxisColumnList);
  
  // add each series stack option for "total"
  if (eChartsOption && eChartsOption.series) {
    eChartsOption.series = eChartsOption.series as any[];
    eChartsOption.series = eChartsOption.series.map((seriesItem: any) => {
      return {
        ...seriesItem, stack: 'total'
      }
    })
  }

  if (callbackFunc) callbackFunc(eChartsOption);
  return eChartsOption;
}

export const getStackedHorizontalBarChart = (
  yAxisColumn: Column,
  xAxisColumnList: Column[],
  callbackFunc?: (eChartsOption: EChartsOption) => void
): EChartsOption => {
  let eChartsOption = getStackedBarChartOptions(yAxisColumn, xAxisColumnList);
  swapXAxisAndYAxis(eChartsOption);

  if (callbackFunc) callbackFunc(eChartsOption);
  return eChartsOption;
}