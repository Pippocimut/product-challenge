import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  FormGroup,
  InputGroup,
  Intent,
  Classes
} from "@blueprintjs/core";

type NewAggregationColumnProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (column: { columnName: string, expression: string, selectedColumns: string[] }) => void;
  selectedColumns: string[];
}

export const NewColumnCreationPopUp = ({ isOpen, onClose, onSubmit, selectedColumns }: NewAggregationColumnProps) => {
  const [columnName, setColumnName] = useState("New Column");
  const [expression, setExpression] = useState(selectedColumns.join(" + ") || "");
  const [nameError, setNameError] = useState("");
  const [expressionError, setExpressionError] = useState("");

  useEffect(() => {
    if(isOpen) {
      setExpression(selectedColumns.join(" + ") || "");
      setColumnName("New Column");
    }

  }, [isOpen])

  const handleSubmit = () => {
    let hasError = false;

    if (!columnName.trim()) {
      setNameError("Column name is required");
      hasError = true;
    } else {
      setNameError("");
    }

    if (!expression.trim()) {
      setExpressionError("Math expression is required");
      hasError = true;
    } else {
      setExpressionError("");
    }

    if (!hasError) {
      onSubmit({ columnName, expression, selectedColumns });
      setColumnName("New Column");
      setExpression("");
      onClose();
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Calculation Column"
      className={Classes.DIALOG}
    >
      <div className={Classes.DIALOG_BODY}>
        <div>
          Please enter the name and math expression for the new column.
        </div>
        <div style={{ paddingTop: 10 }}>
          <strong>Note:</strong> List of selected columns:
          columns:
          <ul>
            {selectedColumns.map((column, index) => (
              <li key={index}><strong>{column}</strong></li>
            ))}
          </ul>
        </div>
        <div style={{ paddingTop: 10 }}>
          <strong>Example:</strong> column_1 * column_2 + 10
        </div>
        <FormGroup
          label="Column Name"
          labelFor="column-name-input"
          helperText={nameError}
          intent={nameError ? Intent.DANGER : Intent.NONE}
        >
          <InputGroup
            id="column-name-input"
            placeholder="Enter column name"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            intent={nameError ? Intent.DANGER : Intent.NONE}
          />
        </FormGroup>

        <FormGroup
          label="Math Expression"
          labelFor="expression-input"
          helperText={expressionError || "Example: column_1 * column_2 + 10"}
          intent={expressionError ? Intent.DANGER : Intent.NONE}
        >
          <InputGroup
            id="expression-input"
            placeholder="Enter math expression"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            intent={expressionError ? Intent.DANGER : Intent.NONE}
          />
        </FormGroup>
      </div>

      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            intent={Intent.PRIMARY}
            onClick={handleSubmit}
          >
            Create Column
          </Button>
        </div>
      </div>
    </Dialog>
  );
};