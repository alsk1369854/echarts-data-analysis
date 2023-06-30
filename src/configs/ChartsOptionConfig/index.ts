import { DataZoomComponentOption } from "echarts";

export const DEFAULT_ECHARTS_OPTIONS_LEGEND = {
  type: "scroll",
  top: 30,
};

export const DEFAULT_ECHARTS_OPTIONS_GRID = {
  left: "3%",
  right: "4%",
  // bottom: '3%',
  bottom: 60,
  containLabel: true,
};

export const DEFAULT_ECHARTS_OPTIONS_DATA_ZOOM: DataZoomComponentOption = {
  show: true,
  start: 0,
  height: 0,
  labelFormatter: "",
  showDataShadow: false,
  filterMode: "empty",
  minValueSpan: 10,
  maxValueSpan: 10,
};

export const DEFAULT_ECHARTS_OPTIONS_TOOLBOX = {
  show: true,
  //     orient: 'vertical',
  //     left: 'right',
  top: 50,
  feature: {
    //         mark: { show: true },
    //         dataView: { show: true, readOnly: false },
    //         magicType: { show: true, type: ['line', 'bar', 'stack'] },
    //         restore: { show: true },
    saveAsImage: { show: true },
  },
};
