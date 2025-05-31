import { ColumnType } from './ColumnType';

export type ColumnStructure = {
  columnName: string;
  columnType: ColumnType;
  columnId: string;
  calculations?: any;
}