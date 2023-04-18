
export interface ColumnRelationTreeNode {
    name: string,
    value: number,
    childColumnRelationTreeMap: Map<string, ColumnRelationTreeNode>
}

export interface SunburstDataItem {
    name: string,
    value: number,
    children: SunburstDataItem[]
}