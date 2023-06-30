import {
  createCalculateAnalysisColumn,
  createCategoryColumn,
  filterOutListEmptyValues,
  getColumnValueCategoryCorrespondsOtherColumnValueListMap,
  getValueListCalculateValue,
} from "../../../Utils";
import { AnalysisColumn, Column, EChartsOption } from "../../../interfaces";
import { getChartOptionTitleText } from "../../../Utils/ChartUtil";
import {
  DEFAULT_ECHARTS_OPTIONS_LEGEND,
  DEFAULT_ECHARTS_OPTIONS_TOOLBOX,
} from "../../../configs/ChartsOptionConfig";

const DEFAULT_ECHARTS_OPTION: EChartsOption = {
  title: {
    text: "圖表",
  },
  legend: DEFAULT_ECHARTS_OPTIONS_LEGEND,
  toolbox: DEFAULT_ECHARTS_OPTIONS_TOOLBOX,
  tooltip: {
    trigger: "item",
    formatter: "{b}<br/> 值: {c}<br/> 百分比: {d}%",
  },
  series: {
    type: "pie",
    label: {
      formatter: "{b}({d}%)",
    },
    top: 60,
    data: [],
    radius: [0, "70%"],
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: "rgba(0, 0, 0, 0.5)",
      },
    },
  },
};

export const getBasicPieChartOptions = (
  categoryColumn: Column<string | number | null>,
  valueColumn: AnalysisColumn<string | number | null>,
  callbackFunc?: (eChartsOption: EChartsOption) => void
): EChartsOption => {
  // init result value
  let eChartsOption: EChartsOption = { ...DEFAULT_ECHARTS_OPTION };

  // create analysis column
  const generalCategoryColumn = createCategoryColumn(categoryColumn);
  const valueAnalysisColumn = createCalculateAnalysisColumn(valueColumn);
  const { title: valueColumnTitle, calculateType: valueColumnCalculateType } =
    valueAnalysisColumn;

  // update option title text
  let newTitle: any = {
    ...eChartsOption.title,
    text: getChartOptionTitleText(
      [valueAnalysisColumn],
      [generalCategoryColumn]
    ),
  };
  eChartsOption.title = newTitle;

  // update option series data
  let newSeries: any = {
    ...eChartsOption.series,
    data: [],
  };
  const categoryCorrespondsValuesMap =
    getColumnValueCategoryCorrespondsOtherColumnValueListMap(
      generalCategoryColumn,
      [valueAnalysisColumn]
    );
  categoryCorrespondsValuesMap.forEach((valueColumnMap, categoryValue) => {
    const categoryCorrespondValueList = valueColumnMap.get(valueColumnTitle);
    if (categoryCorrespondValueList) {
      const generalCategoryCorrespondValueList = filterOutListEmptyValues(
        categoryCorrespondValueList
      ) as (string | number)[];
      const value = getValueListCalculateValue(
        generalCategoryCorrespondValueList,
        valueColumnCalculateType
      );
      newSeries.data.push({ value: value, name: categoryValue });
    }
  });
  eChartsOption.series = newSeries;

  if (callbackFunc) callbackFunc(eChartsOption);
  return eChartsOption;
};
