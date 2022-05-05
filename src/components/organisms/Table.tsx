import React, { ReactElement } from "react";

interface ITableProps {
  gridSize: number;
  cells: ReactElement[];
}

const Table: React.FC<ITableProps> = (props) => {
  // cell is a component
  return (
    <div
      // className={`grid grid-cols-[${props.gridSize}]`}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${props.gridSize}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${props.gridSize}, minmax(0, 1fr))`,
      }}
    >
      {props.cells.map((cell, index) => {
        return React.cloneElement(cell, { key: index });
      })}
    </div>
  );
};

export default Table;
