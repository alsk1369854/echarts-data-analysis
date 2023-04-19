import { AnalysisColumn, Column } from "../../interfaces";
import { CalculateTypeViewText } from "../BasicEnum";

export const getChartOptionTitleText = (
    calculateColumnList: AnalysisColumn<string | number | null>[],
    categoryColumnList: Column<string>[],
): string => {
    let titleText = "";

    calculateColumnList.forEach((column, index) => {
        const { title, calculateType } = column;
        let temp = `${title} 的`;
        temp += `${CalculateTypeViewText[calculateType]}`;
        if (index <= calculateColumnList.length - 2) {
            if (index === calculateColumnList.length - 2) {
                temp += " 與 ";
            } else {
                temp += ", ";
            }
        }
        titleText += temp;
    })

    titleText += " 依據 ";

    categoryColumnList.forEach((column, index) => {
        const { title } = column;
        let temp = `${title}`;
        if (index <= categoryColumnList.length - 2) {
            if (index === categoryColumnList.length - 2) {
                temp += " 與 ";
            } else {
                temp += ", ";
            }
        }
        titleText += temp;
    })

    return titleText;
}