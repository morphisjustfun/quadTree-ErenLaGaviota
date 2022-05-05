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
  const classNameCustom = `${props.leftBorder ? "border-l" : ""} ${
    props.rightBorder ? "border-r" : ""
  } ${props.topBorder ? "border-t" : ""} ${
    props.bottomBorder ? "border-b" : ""
  } text-center`;

  return (
    <div
      className={classNameCustom}
      onClick={props.onClick}
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          height: "30px",
          width: "30px",
          display: "flex",
          justifyContent: "center",
        }}
        className="hover:bg-light-outline"
      >
        {props.value}
      </div>
    </div>
  );
};

export default Cell;
