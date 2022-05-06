import { ReactElement, useEffect, useRef, useState } from "react";

import dynamic from "next/dynamic";

import Button from "@/components/molecules/Button";
import Card from "@/components/molecules/Card";
import Cell from "@/components/molecules/Cell";
import NavigationDrawer from "@/components/organisms/NavigationDrawer";
import Table from "@/components/organisms/Table";
import QuadTree from "@/core/quadtree/QuadTree";
import QuadTreeNode from "@/core/quadtree/QuadTreeNode";
import { Meta } from "@/layout/Meta";
import { Main } from "@/templates/Main";

const Graphviz = dynamic(() => import("graphviz-react"), { ssr: false });

const Index = () => {
  const quadTree = useRef<QuadTree>(null);
  const [cells, setCells] = useState<ReactElement[]>([]);
  const [dummyIndex, setDummyIndex] = useState(0);
  const sizeRef = useRef<HTMLInputElement>(null);
  const insertValue = useRef(0);

  const [graphWidth, setGraphWidth] = useState(500);
  const [graphHeight, setGraphHeight] = useState(500);

  const graphWidthRef = useRef<HTMLInputElement>(null);
  const graphHeightRef = useRef<HTMLInputElement>(null);

  const representation = quadTree.current?.getDOTRepresentation();

  useEffect(() => {
    if (quadTree.current === null) {
      return;
    }
    const quadtreeCells: JSX.Element[][] = quadTree.current!.grid.map(
      (points, indexPoints) => {
        return points.map((point, indexPoint) => {
          const x = indexPoint;
          const y = indexPoints;
          const borders = quadTree.current!.getBorder({ x, y });
          return (
            <Cell
              bottomBorder={borders.bottomBorder}
              leftBorder={borders.leftBorder}
              rightBorder={borders.rightBorder}
              topBorder={borders.topBorder}
              value={point?.value ?? ""}
              key={`a-${indexPoint}-${indexPoints}`}
              onClick={() => {
                // x - y
                if (point === null) {
                  const node = new QuadTreeNode(
                    insertValue.current.toString(),
                    {
                      x: indexPoint,
                      y: indexPoints,
                    }
                  );
                  insertValue.current++;
                  quadTree.current!.insert(node);
                  setDummyIndex(dummyIndex + 1);
                  return;
                }
                // const x = indexPoint;
                // const y = indexPoints;
                const confirm = window.confirm(
                  `Are you sure you want to delete ${point.value}?`
                );
                if (!confirm) {
                  return;
                }
                quadTree.current!.delete({ x, y });
                setDummyIndex(dummyIndex + 1);
                // alert(`${indexPoint}-${indexPoints}`);
              }}
            />
          );
        });
      }
    );

    // merge quadtreeCells into one array
    const cellsArray = quadtreeCells.reduce(
      (acc, curr) => acc.concat(curr),
      []
    );
    setCells(cellsArray);
    quadTree.current.fixNonLeafsNodes();
  }, [dummyIndex, quadTree]);

  return (
    <Main meta={<Meta title="Quadtree" description="OwO" />}>
      <div className="grid gap-7 m-7">
        <Card title="Manual">
          <div className="grid gap-6">
            <div className="flex justify-center items-center">
              <label className="block mr-4"> Size </label>
              <input
                type="number"
                ref={sizeRef}
                className="block bg-light-on-primary border-light-tertiary border-2 rounded-lg p-2"
              />
            </div>
            <div className="flex justify-center items-center">
              <label className="block mr-4"> Graph Width </label>
              <input
                type="number"
                defaultValue={500}
                ref={graphWidthRef}
                className="block bg-light-on-primary border-light-tertiary border-2 rounded-lg p-2"
              />
            </div>
            <div className="flex justify-center items-center">
              <label className="block mr-4"> Graph Height </label>
              <input
                type="number"
                defaultValue={500}
                ref={graphHeightRef}
                className="block bg-light-on-primary border-light-tertiary border-2 rounded-lg p-2"
              />
            </div>
            <div className="flex justify-center items-center gap-3">
              <Button
                type="FILLED"
                onClick={() => {
                  // @ts-ignore
                  quadTree.current = new QuadTree(
                    Number(sizeRef.current?.value)
                  );
                  setDummyIndex(dummyIndex + 1);
                }}
              >
                Create
              </Button>
              <Button
                type="OUTLINED"
                onClick={() => {
                  setCells([]);
                  // @ts-ignore
                  quadTree.current = null;
                  setDummyIndex(dummyIndex + 1);
                  sizeRef.current!.value = "";
                }}
              >
                Clear
              </Button>
              <Button
                type="OUTLINED"
                onClick={() => {
                  setGraphHeight(Number(graphHeightRef.current?.value));
                  setGraphWidth(Number(graphWidthRef.current?.value));
                }}
              >
                Change graph size
              </Button>
            </div>
          </div>
        </Card>
      </div>
      <div className="grid gap-7 m-7">
        <Card title="Demo">
          <Table gridSize={quadTree.current?.gridSize ?? 8} cells={cells} />
        </Card>
      </div>
      {representation && (
        <div className="flex justify-center">
          <Graphviz
            dot={representation}
            options={{
              height: graphHeight,
              width: graphWidth,
            }}
          />
        </div>
      )}
    </Main>
  );
};

Index.getLayout = (page: ReactElement) => {
  return <NavigationDrawer labelActive="QUADTREE">{page}</NavigationDrawer>;
};

export default Index;
