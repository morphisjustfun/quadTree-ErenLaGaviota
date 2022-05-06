import { FC } from "react";

interface ICellProps {
  leftBorder: boolean;
  rightBorder: boolean;
  topBorder: boolean;
  bottomBorder: boolean;
  value: string;
  onClick: () => void;
}

const Cell: FC<ICellProps> = (props) => {

  return (
    <div
      onClick={props.onClick}
      style={{
        display: "flex",
        justifyContent: "center",
        borderLeft: props.leftBorder ? "1px solid #000" : 0,
        borderRight: props.rightBorder ? "1px solid #000" : 0,
        borderTop: props.topBorder ? "1px solid #000" : 0,
        borderBottom: props.bottomBorder ? "1px solid #000" : 0,
        textAlign: "center",
      }}
      className="hover:bg-light-outline"
    >
      <div
        style={{
          height: "30px",
          width: "30px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {props.value}
      </div>
    </div>
  );
};

export default Cell;
