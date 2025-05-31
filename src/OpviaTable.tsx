import * as React from 'react';

import { Cell, Column, IRegion, Table2 } from '@blueprintjs/table';
import { dummyTableData } from './data/dummyData';
import { evaluate } from 'mathjs';
import { useState } from 'react';
import { Button } from '@blueprintjs/core';
import { NewColumnCreationPopUp } from './components/NewColumnCreationPopUp';
import { AggregationsTable } from './components/AggregationsTable';
import { ColumnStructure } from './types/ColumnStructure';

const columns: ColumnStructure[] = [
  { columnName: 'Time', columnType: 'time', columnId: 'time_col' },
  {
    columnName: 'Cell Density (Cell Count/Litre)',
    columnType: 'data',
    columnId: 'var_col_1',
  },
  { columnName: 'Volume (Litres)', columnType: 'data', columnId: 'var_col_2' },
];

const OpviaTable: React.FC = () => {
  const getSparseRefFromIndexes = (
    rowIndex: number,
    columnIndex: number,
  ): string => `${columnIndex}-${rowIndex}`;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  const numberOfRows = 95; //Could have done the same by checking how long the dummy data went.

  const onSelectColumn = (selectedRegions: IRegion[]) => {
    if (!selectedRegions || selectedRegions.length === 0)
      return;

    const columnsToSelect = selectedRegions.map(region => region.cols);
    const columnsReturned = [];
    for (let i = 0; i < columnsToSelect.length; i++) {
      const columnRange = columnsToSelect[i];
      if (columnRange) {
        const start = columnRange[0];
        const end = columnRange[1];

        for (let colIndex = start; colIndex <= end; colIndex++) {
          columnsReturned.push(colIndex);
        }
      }
    }

    const columnNames = columnsReturned.map(column => columns[column].columnId);

    setSelectedColumns(columnNames);
  };

  const createColumnName = (i: number, columnName: string): string => {
    const columnNames = columns.map(column => column.columnId);
    const returnedColumnName = (columnName + ' ' + i).toLowerCase().replace(/\s/g, '_');
    if (!columnNames.includes(returnedColumnName))
      return returnedColumnName;
    else
      return createColumnName(i + 1, columnName);
  };

  const handleNewColumnSubmit = ({ columnName, expression }: { columnName: string, expression: string }) => {
    const allColumnNames = columns.map(column => column.columnId);
    const colNamesInExpression = allColumnNames.filter(name => expression.includes(name));

    const columnId = createColumnName(0,columnName);

    columns.push({
      columnName,
      columnType: 'calculation',
      columnId: columnId,
      calculations: (rowIndex: number) => {
        const scope = colNamesInExpression.reduce((acc, curr) => {
          const columnIndex = columns.findIndex(column => column.columnId === curr);
          if (columns[columnIndex].columnType === 'calculation')
            acc[curr] = columns[columnIndex].calculations(rowIndex);

          if (columns[columnIndex].columnType === 'time')
            acc[curr] = new Date(dummyTableData[getSparseRefFromIndexes(rowIndex, columnIndex)]).getTime();

          if (columns[columnIndex].columnType === 'data')
            acc[curr] = Number(dummyTableData[getSparseRefFromIndexes(rowIndex, columnIndex)]);

          return acc;
        }, {} as Record<string, number>);

        return evaluate(expression, scope);
      },
    });
  };

  const cellRenderer = (rowIndex: number, columnIndex: number) => {
    if (columns[columnIndex].columnType === 'calculation') {
      const column = columns[columnIndex];
      const value = column.calculations(rowIndex);
      return <Cell>{String(value)}</Cell>;
    }

    const sparsePosition = getSparseRefFromIndexes(rowIndex, columnIndex);
    const value = dummyTableData[sparsePosition];
    return <Cell>{String(value)}</Cell>;
  };

  const cols = columns.map((column) => (
    <Column
      key={`${column.columnId}`}
      cellRenderer={cellRenderer}
      name={column.columnName}
    />
  ));

  return (
    <div>
      <AggregationsTable numberOfRows={numberOfRows} columns={columns}
                         onSelectColumn={onSelectColumn}
                         selectedColumns={selectedColumns} />

      <Button
        icon="plus"
        text="Add Calculation Column"
        onClick={() => setIsDialogOpen(true)}
      />

      <NewColumnCreationPopUp
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleNewColumnSubmit}
        selectedColumns={selectedColumns}
      />

      <Table2 defaultRowHeight={35} numRows={95} onSelection={onSelectColumn}>
        {cols}
      </Table2>
    </div>

  );
};

export default OpviaTable;
