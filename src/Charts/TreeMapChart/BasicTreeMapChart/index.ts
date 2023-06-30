import {
  createCalculateAnalysisColumn,
  createCategoryColumn,
  filterOutListEmptyValues,
  getColumnValueCategoryCorrespondsOtherColumnValueListMap,
  getValueListCalculateValue,
} from "../../../Utils";
import { AnalysisColumn, Column, EChartsOption } from "../../../interfaces";
import { getChartOptionTitleText } from "../../../Utils/ChartUtil";
import { DEFAULT_ECHARTS_OPTIONS_TOOLBOX } from "../../../configs/ChartsOptionConfig";

const DEFAULT_ECHARTS_OPTION: EChartsOption = {
  title: {
    text: "圖表",
  },
  toolbox: DEFAULT_ECHARTS_OPTIONS_TOOLBOX,
  tooltip: {},
  series: {
    type: "treemap",
    data: [
      {
        name: "nodeA", // First tree
        value: 10,
        children: [
          {
            name: "nodeAa", // First leaf of first tree
            value: 4,
          },
          {
            name: "nodeAb", // Second leaf of first tree
            value: 6,
          },
        ],
      },
      {
        name: "nodeB", // Second tree
        value: 20,
        children: [
          {
            name: "nodeBa", // Son of first tree
            value: 20,
            children: [
              {
                name: "nodeBa1", // Granson of first tree
                value: 20,
              },
            ],
          },
        ],
      },
    ],
  },
};

export const getBasicTreeMapChartOptions = (
  categoryColumn: Column<string | number | null>,
  calculateColumnList: AnalysisColumn<string | number | null>[],
  callbackFunc?: (eChartsOption: EChartsOption) => void
): EChartsOption => {
  let eChartsOption: EChartsOption = { ...DEFAULT_ECHARTS_OPTION };

  const generalCategoryColumn = createCategoryColumn(categoryColumn);
  const calculateAnalysisColumnList = calculateColumnList.map((column) =>
    createCalculateAnalysisColumn(column)
  );

  const categoryCorrespondsCalculateColumnValueListMap =
    getColumnValueCategoryCorrespondsOtherColumnValueListMap(
      generalCategoryColumn,
      calculateAnalysisColumnList
    );

  // update title text
  let newTitle: any = {
    ...eChartsOption.title,
    text: getChartOptionTitleText(calculateAnalysisColumnList, [
      generalCategoryColumn,
    ]),
  };
  eChartsOption.title = newTitle;

  // update series data
  let newSeries: any = {
    ...eChartsOption.series,
    data: [],
  };
  categoryCorrespondsCalculateColumnValueListMap.forEach(
    (calculateValueListMap, category) => {
      const newSeriesDataItemChildren = calculateAnalysisColumnList.map(
        (column) => {
          const {
            title: calculateColumnTitle,
            calculateType: calculateColumnCalculateType,
          } = column;
          const categoryCorrespondsCalculateValueList =
            calculateValueListMap.get(calculateColumnTitle);
          let value = 0;
          if (categoryCorrespondsCalculateValueList) {
            const filterOutNullValueCategoryCorrespondsCalculateValueList =
              filterOutListEmptyValues(
                categoryCorrespondsCalculateValueList
              ) as (string | number)[];
            value = getValueListCalculateValue(
              filterOutNullValueCategoryCorrespondsCalculateValueList,
              calculateColumnCalculateType
            );
          }
          return {
            name: calculateColumnTitle,
            value,
          };
        }
      );
      newSeries.data.push({
        name: category,
        value: newSeriesDataItemChildren.reduce(
          (accumulator: any, currentValue: any) =>
            accumulator + currentValue.value,
          0
        ),
        children: newSeriesDataItemChildren,
      });
    }
  );
  eChartsOption.series = newSeries;

  if (callbackFunc) callbackFunc(eChartsOption);
  return eChartsOption;
};
