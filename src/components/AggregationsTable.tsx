import { Button } from '@blueprintjs/core';
import { NewAggregationColumn } from './NewAggregationColumn';
import { Cell, Column, IRegion, Table2 } from '@blueprintjs/table';
import * as React from 'react';
import { dummyTableData } from '../data/dummyData';
import { evaluate } from 'mathjs';
import { ColumnStructure } from '../types/ColumnStructure';

const aggColumns: ColumnStructure[] = [];

type AggregationsTableProps = {
  columns: any[],
  numberOfRows: number,
  selectedColumns: string[],
  onSelectColumn: (selectedColumns: IRegion[]) => void
}

export const AggregationsTable = ({
                                    columns,
                                    numberOfRows,
                                    selectedColumns,
                                    onSelectColumn,
                                  }: AggregationsTableProps) => {
  const [isDialogOpen2, setIsDialogOpen2] = React.useState(false);

  const getSparseRefFromIndexes = (
    rowIndex: number,
    columnIndex: number,
  ): string => `${columnIndex}-${rowIndex}`;

  const createColumnName = (i: number, columnName: string): string => {
    const columnNames = columns.map(column => column.columnId);
    const returnedColumnName = (columnName + ' ' + i).toLowerCase().replace(/\s/g, '_');
    if (!columnNames.includes(returnedColumnName))
      return returnedColumnName;
    else
      return createColumnName(i + 1, columnName);
  };

  const handleNewAggColumnSubmit = ({ columnName, expression }: { columnName: string, expression: string }) => {
    const allColumnNames = columns.map(column => column.columnId);
    const colNamesInExpression = allColumnNames.filter(name => expression.includes(name));

    const scope = colNamesInExpression.reduce((acc, curr) => {
      const columnIndex = columns.findIndex(column => column.columnId === curr);
      acc[curr] = [];

      for (let rowIndex = 0; rowIndex < numberOfRows - 1; rowIndex++) {
        if (columns[columnIndex].columnType === 'calculation')
          acc[curr].push(columns[columnIndex].calculations(rowIndex));

        if (columns[columnIndex].columnType === 'time')
          acc[curr].push(new Date(dummyTableData[getSparseRefFromIndexes(rowIndex, columnIndex)]).getTime());

        if (columns[columnIndex].columnType === 'data')
          acc[curr].push(dummyTableData[getSparseRefFromIndexes(rowIndex, columnIndex)]);
      }

      return acc;
    }, {});

    const columnId = createColumnName(0, columnName);

    aggColumns.push({
      columnName,
      columnType: 'calculation',
      columnId: columnId,
      calculations: () => evaluate(expression, scope),
    });

  };

  const aggCellRenderer = (rowIndex: number, columnIndex: number) => {
    return <Cell>{String(aggColumns[columnIndex].calculations())}</Cell>;
  };

  const cols = aggColumns.map((column) => (
    <Column
      key={`${column.columnId}`}
      cellRenderer={aggCellRenderer}
      name={column.columnName}
    />
  ));

  return <div>
    <Button
      icon="plus"
      text="Add Aggregation Column"
      onClick={() => setIsDialogOpen2(true)}
    />

    <NewAggregationColumn
      isOpen={isDialogOpen2}
      onClose={() => setIsDialogOpen2(false)}
      onSubmit={handleNewAggColumnSubmit}
      selectedColumns={selectedColumns}
    />

    <Table2 defaultRowHeight={35} numRows={1} onSelection={onSelectColumn}>
      {cols}
    </Table2>
  </div>;
};