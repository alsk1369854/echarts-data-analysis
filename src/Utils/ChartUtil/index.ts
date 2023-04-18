import { AnalysisColumn, Column } from "../../interfaces";
import { CalculateTypeViewText } from "../BasicEnum";

export const getChartOptionTitle = (
    mainColumn: Column,
    calculateColumnList: AnalysisColumn[]
): string => {
    let titleText = "";

    calculateColumnList.forEach((column: AnalysisColumn, index: number) => {
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
    titleText += ` 依據 ${mainColumn.title}`;

    return titleText;
}