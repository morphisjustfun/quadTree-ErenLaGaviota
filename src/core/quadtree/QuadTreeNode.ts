/* eslint-disable no-plusplus */
export interface Point {
  x: number;
  y: number;
}

const directionLabels = ["nw", "ne", "se", "sw"];

class QuadTreeNode {
  public children: (QuadTreeNode | null)[];

  public value: string;

  public point: Point;

  // to be used for empty nodes as id
  public static emptyNodeIndex = 0;

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

  public getDOT(): string {
    let result = "";
    if (this.isLeaf) {
      result += `"${this.value}" [label="${this.value}"];`;
    } else {
      result += `"${this.value}" [label=""];`;
      for (let i = 0; i < 4; i++) {
        if (this.children[i] !== null) {
          result += `"${this.value}" -- "${this.children[i]!.value}" [label="${
            directionLabels[i]
          }"];`;
          result += this.children[i]!.getDOT();
        } else {
          // if the child doesn't exist then assign it an empty node
          result += `"${QuadTreeNode.emptyNodeIndex}" [label=""];`;
          result += `"${this.value}" -- "${QuadTreeNode.emptyNodeIndex}" [label="${directionLabels[i]}"];`;
        }
        QuadTreeNode.emptyNodeIndex++;
      }
    }
    return result;
  }
}

export default QuadTreeNode;
