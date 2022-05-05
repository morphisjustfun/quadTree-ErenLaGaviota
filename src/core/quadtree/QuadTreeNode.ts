export interface Point {
  x: number;
  y: number;
}

class QuadTreeNode {
  public children: (QuadTreeNode | null)[];

  public value: string;

  public point: Point;

  public isLeaf: boolean;

  public constructor(value: string, point: Point, isLeaf = true) {
    if (value === "") {
      throw new Error("Cant create empty node");
    }
    this.value = value;
    this.children = new Array(4).fill(null);
    this.point = point;
    this.isLeaf = isLeaf;
  }

  public isEqual(node: QuadTreeNode): boolean {
    return (
      this.point.x === node.point.x &&
      this.point.y === node.point.y &&
      this.isLeaf === node.isLeaf
    );
  }
}

export default QuadTreeNode;
