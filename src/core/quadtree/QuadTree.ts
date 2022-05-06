/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
/* eslint-disable @typescript-eslint/no-shadow */
// QuadTree structure - 2d - size = 2^2n

// Left Upper quadrant = 0
// Right Upper quadrant = 1
// Right Lower quadrant = 2
// Left Lower quadrant = 3
import QuadTreeNode, { Point } from "./QuadTreeNode";

interface Border {
  bottomBorder: boolean;
  leftBorder: boolean;
  rightBorder: boolean;
  topBorder: boolean;
}

enum Quadrant {
  LeftUpper = 0, // nw
  RightUpper = 1, // ne
  RightLower = 2, // se
  LeftLower = 3, // sw
  Default = 4,
}

class QuadTree {
  public gridSize: number;

  public root: QuadTreeNode;

  public grid: (QuadTreeNode | null)[][];

  private count: number;

  private nonleafsCount = 1;

  private static getNewCorners(
    currentQuadrant: Quadrant,
    leftUpperPoint: Point,
    rightUpperPoint: Point,
    rightLowerPoint: Point,
    leftLowerPoint: Point
  ): {
    leftUpperPoint: Point;
    rightUpperPoint: Point;
    rightLowerPoint: Point;
    leftLowerPoint: Point;
  } {
    // get new corners for the current quadrant using the old ones
    switch (currentQuadrant) {
      case Quadrant.LeftUpper: {
        const tempRightUpperPoint1 = {
          x: Math.floor((leftUpperPoint.x + rightUpperPoint.x) / 2),
          y: rightUpperPoint.y,
        };
        const tempRightLowerPoint1 = {
          x: Math.floor((leftUpperPoint.x + rightUpperPoint.x) / 2),
          y: Math.floor((leftUpperPoint.y + rightLowerPoint.y) / 2),
        };
        const tempLeftLowerPoint1 = {
          x: leftLowerPoint.x,
          y: Math.floor((leftUpperPoint.y + rightLowerPoint.y) / 2),
        };
        rightUpperPoint = tempRightUpperPoint1;
        rightLowerPoint = tempRightLowerPoint1;
        leftLowerPoint = tempLeftLowerPoint1;
        break;
      }
      case Quadrant.RightUpper: {
        const tempLeftUpperPoint2 = {
          x: Math.ceil((leftUpperPoint.x + rightUpperPoint.x) / 2),
          y: leftUpperPoint.y,
        };
        const tempRightLowerPoint2 = {
          x: rightLowerPoint.x,
          y: Math.floor((leftUpperPoint.y + rightLowerPoint.y) / 2),
        };
        const tempLeftLowerPoint2 = {
          x: Math.ceil((leftUpperPoint.x + rightUpperPoint.x) / 2),
          y: Math.floor((leftUpperPoint.y + rightLowerPoint.y) / 2),
        };
        leftUpperPoint = tempLeftUpperPoint2;
        rightLowerPoint = tempRightLowerPoint2;
        leftLowerPoint = tempLeftLowerPoint2;
        break;
      }
      case Quadrant.RightLower: {
        const tempLeftUpperPoint3 = {
          x: Math.ceil((leftUpperPoint.x + rightUpperPoint.x) / 2),
          y: Math.ceil((leftUpperPoint.y + rightLowerPoint.y) / 2),
        };
        const tempRightUpperPoint3 = {
          x: rightUpperPoint.x,
          y: Math.ceil((leftUpperPoint.y + rightLowerPoint.y) / 2),
        };
        const tempLeftLowerPoint3 = {
          x: Math.ceil((leftUpperPoint.x + rightUpperPoint.x) / 2),
          y: leftLowerPoint.y,
        };
        leftUpperPoint = tempLeftUpperPoint3;
        rightUpperPoint = tempRightUpperPoint3;
        leftLowerPoint = tempLeftLowerPoint3;
        break;
      }
      case Quadrant.LeftLower: {
        const tempLeftUpperPoint4 = {
          x: leftUpperPoint.x,
          y: Math.ceil((leftUpperPoint.y + rightLowerPoint.y) / 2),
        };
        const tempRightUpperPoint4 = {
          x: Math.floor((leftUpperPoint.x + rightUpperPoint.x) / 2),
          y: Math.ceil((leftUpperPoint.y + rightLowerPoint.y) / 2),
        };
        const tempRightLowerPoint4 = {
          x: Math.floor((leftUpperPoint.x + rightUpperPoint.x) / 2),
          y: rightLowerPoint.y,
        };
        leftUpperPoint = tempLeftUpperPoint4;
        rightUpperPoint = tempRightUpperPoint4;
        rightLowerPoint = tempRightLowerPoint4;
        break;
      }
      case Quadrant.Default:
        break;
      default:
        break;
    }
    return {
      leftUpperPoint,
      rightUpperPoint,
      rightLowerPoint,
      leftLowerPoint,
    };
  }

  public constructor(gridSize: number) {
    // check if its a power of 2
    // eslint-disable-next-line no-bitwise
    if (gridSize & (gridSize - 1)) {
      throw new Error("Grid size must be a power of 2");
    }

    if (gridSize <= 2) {
      throw new Error("Grid size must be greater than 2");
    }

    this.gridSize = gridSize;

    // initialize grid
    this.grid = Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill(null));

    // create root node
    this.root = new QuadTreeNode(
      "root",
      {
        x: 0,
        y: 0,
      },
      false
    );
    // initialize count of nodes
    this.count = 0;
  }

  public validNode(node: QuadTreeNode): boolean {
    // check if node is in grid
    return !(
      node.point.x < 0 ||
      node.point.x >= this.gridSize ||
      node.point.y < 0 ||
      node.point.y >= this.gridSize
    );
  }

  public search(node: QuadTreeNode): boolean {
    // search for node in grid
    return this.grid[node.point.y]![node.point.x] !== null;
  }

  public getQuadrant(
    node: QuadTreeNode,
    leftUpper: Point,
    rightUpper: Point,
    _rightLower: Point,
    leftLower: Point
  ): Quadrant {
    // get quadrant of node according to its position and the four corners of the current grid
    if (node.point.x <= (leftUpper.x + rightUpper.x) / 2) {
      if (
        node.point.y >= leftUpper.y &&
        node.point.y <= (leftUpper.y + leftLower.y) / 2
      ) {
        return Quadrant.LeftUpper;
      }
      return Quadrant.LeftLower;
    }
    if (node.point.y <= (leftUpper.y + leftLower.y) / 2) {
      return Quadrant.RightUpper;
    }
    return Quadrant.RightLower;
  }

  public fixNonLeafsNodes() {
    // use dfs to traverse the tree and fix non-leaf nodes (assign a dummy unique value)
    const stack: QuadTreeNode[] = [];
    stack.push(this.root);
    while (stack.length > 0) {
      const currentNode = stack.pop()!;
      if (currentNode.isLeaf) {
        // eslint-disable-next-line no-continue
        continue;
      }
      for (let i = 0; i < 4; i++) {
        if (currentNode.children[i] !== null) {
          stack.push(currentNode.children[i]!);
        }
      }
      // assign a dummy unique value
      currentNode.value = `nonleaf-${this.nonleafsCount}`;
      this.nonleafsCount++;
    }
  }

  private initializeCorners(): {
    leftUpperPoint: { x: number; y: number };
    rightUpperPoint: { x: number; y: number };
    rightLowerPoint: { x: number; y: number };
    leftLowerPoint: { x: number; y: number };
  } {
    // initialize corners of the initial grid (main root)
    return {
      leftUpperPoint: {
        x: 0,
        y: 0,
      },

      rightUpperPoint: {
        x: this.gridSize - 1,
        y: 0,
      },

      rightLowerPoint: {
        x: this.gridSize - 1,
        y: this.gridSize - 1,
      },

      leftLowerPoint: {
        x: 0,
        y: this.gridSize - 1,
      },
    };
  }

  public insert(node: QuadTreeNode): void {
    // check if node is valid
    if (!this.validNode(node)) {
      console.log("Invalid position");
      return;
    }
    // check if node is already in tree
    if (this.search(node)) {
      console.log("Node already in tree");
      return;
    }
    this.count++;
    // update grid
    node.isLeaf = true;
    this.grid[node.point.y]![node.point.x] = node;

    // set tempNode and initialize corners
    let tempNode = this.root;
    let { leftUpperPoint, rightUpperPoint, rightLowerPoint, leftLowerPoint } =
      this.initializeCorners();

    // quadrant of the node to be inserted in the most upper level
    let quadrant = this.getQuadrant(
      node,
      leftUpperPoint,
      rightUpperPoint,
      rightLowerPoint,
      leftLowerPoint
    );

    // while a node with the same quadrant is not found
    while (tempNode.children[quadrant] !== null) {
      // update tempNode downwards
      tempNode = tempNode.children[quadrant]!;

      // get new corners
      const newCorners = QuadTree.getNewCorners(
        quadrant,
        leftUpperPoint,
        rightUpperPoint,
        rightLowerPoint,
        leftLowerPoint
      );

      leftUpperPoint = newCorners.leftUpperPoint;
      rightUpperPoint = newCorners.rightUpperPoint;
      rightLowerPoint = newCorners.rightLowerPoint;
      leftLowerPoint = newCorners.leftLowerPoint;

      // get new quadrant
      quadrant = this.getQuadrant(
        node,
        leftUpperPoint,
        rightUpperPoint,
        rightLowerPoint,
        leftLowerPoint
      );
    }

    // once a node is found check if it's a leaf
    if (tempNode.isLeaf) {
      // if its leaf iterate until the quadrants are not the same creating direction nodes (no value)

      let currentQuadrantOld = this.getQuadrant(
        tempNode,
        leftUpperPoint,
        rightUpperPoint,
        rightLowerPoint,
        leftLowerPoint
      );
      let currentQuadrantNew = this.getQuadrant(
        node,
        leftUpperPoint,
        rightUpperPoint,
        rightLowerPoint,
        leftLowerPoint
      );

      while (currentQuadrantOld === currentQuadrantNew) {
        // create a dummy direction node with the same position as the parent node
        const directionNode = new QuadTreeNode(
          tempNode.value,
          tempNode.point,
          false
        );

        // set the parent node as not a leaf
        tempNode.isLeaf = false;
        // set the direction node as a leaf
        tempNode.children[currentQuadrantOld] = directionNode;

        // update the temp node to be the direction node
        tempNode = directionNode;

        // calculate new corners
        const newCorners = QuadTree.getNewCorners(
          currentQuadrantNew,
          leftUpperPoint,
          rightUpperPoint,
          rightLowerPoint,
          leftLowerPoint
        );
        leftUpperPoint = newCorners.leftUpperPoint;
        rightUpperPoint = newCorners.rightUpperPoint;
        rightLowerPoint = newCorners.rightLowerPoint;
        leftLowerPoint = newCorners.leftLowerPoint;

        // get new quadrants for the tempNode (the one which is being traversed)
        currentQuadrantOld = this.getQuadrant(
          tempNode,
          leftUpperPoint,
          rightUpperPoint,
          rightLowerPoint,
          leftLowerPoint
        );
        // get new quadrants for the node (the one which is being inserted)
        currentQuadrantNew = this.getQuadrant(
          node,
          leftUpperPoint,
          rightUpperPoint,
          rightLowerPoint,
          leftLowerPoint
        );
      }

      // once quadrants are different insert the node which is being traversed in its corresponding quadrant (different from new node)
      tempNode.children[currentQuadrantOld] = new QuadTreeNode(
        tempNode.value,
        tempNode.point
      );

      tempNode.children[currentQuadrantNew] = node;

      // update the node to keep the reference of previous node
      const fixNode = tempNode.children[currentQuadrantOld];
      const { x, y } = fixNode!.point;
      this.grid[y]![x] = fixNode as QuadTreeNode;

      // update the node leaf status
      tempNode.isLeaf = false;

      return;
    }

    // if the node is not a leaf then just assign the corresponding quadrant
    tempNode.children[quadrant] = node;
  }

  private findParentInternal(node: QuadTreeNode) {
    // traverse every node to find the node without quadrant
    const stack: QuadTreeNode[] = [];
    stack.push(this.root);
    while (stack.length > 0) {
      const currentNode = stack.pop()!;
      if (currentNode.isLeaf) {
        continue;
      }
      for (let i = 0; i < 4; i++) {
        if (currentNode.children[i] !== null) {
          stack.push(currentNode.children[i]!);
        }
      }

      for (let i = 0; i < 4; i++) {
        if (currentNode.children[i] === node) {
          return { parent: currentNode, quadrant: i };
        }
      }
    }
    throw new Error("Node not found");
  }

  public delete(pos: { x: number; y: number }): void {
    // get the node
    const node = this.grid[pos.y]![pos.x]!;

    // get parent node
    const { parent, quadrant } = this.findParentInternal(node);

    // check if parent has siblings apart from the node to be deleted
    const numberOfSiblings = parent.children.filter(
      (child) => child !== null && child !== node
    ).length;

    // if it has siblings then just delete the node to be deleted
    if (numberOfSiblings > 1) {
      parent.children[quadrant] = null;
      this.grid[pos.y]![pos.x] = null;
      return;
    }

    // if the parent is the root then just delete the node to be deleted
    if (parent === this.root) {
      parent.children[quadrant] = null;
      this.grid[pos.y]![pos.x] = null;
      return;
    }

    // only one sibling
    const sibling = parent.children.find(
      (child) => child !== null && child !== node
    )!;

    // if the sibling is not leaf then it contains children and can't be merged
    if (!sibling!.isLeaf) {
      parent.children[quadrant] = null;
      this.grid[pos.y]![pos.x] = null;
      return;
    }

    // if the sibling is leaf then merge the parent with the sibling and continue upwards
    let tempNode = parent;
    let tempQuadrant = -1;
    // remove
    tempNode.children[quadrant] = null;

    // while the parent is not the root and the parent has only one sibling
    // namely - stop when the parent has more than one sibling
    while (
      tempNode !== this.root &&
      tempNode.children.filter((child) => child !== null).length === 1
    ) {
      // find the parent
      const findResult = this.findParentInternal(tempNode);

      // assign
      tempQuadrant = findResult.quadrant;
      const parentTemp = findResult.parent;

      // remove sibling of the parentTemp
      parent.children[tempQuadrant] = null;
      tempNode = parentTemp;
    }
    // at the end just assign the sibling to the tempNode
    tempNode.children[tempQuadrant] = sibling;
    // remove the node
    this.grid[pos.y]![pos.x] = null;
  }

  public getBorder(point: Point): Border {
    // get the borders of a point using its position in the grid and its corners
    let { leftUpperPoint, rightUpperPoint, rightLowerPoint, leftLowerPoint } =
      this.initializeCorners();

    // lambda function to get the border of a point using corners
    const getIndividualBorder = (point: Point): Border => {
      if (point.x === leftUpperPoint.x) {
        if (point.y === leftUpperPoint.y) {
          return {
            leftBorder: true,
            rightBorder: false,
            topBorder: true,
            bottomBorder: false,
          };
        }
        if (point.y === leftLowerPoint.y) {
          return {
            leftBorder: true,
            rightBorder: false,
            topBorder: false,
            bottomBorder: true,
          };
        }
        return {
          leftBorder: true,
          rightBorder: false,
          topBorder: false,
          bottomBorder: false,
        };
      }
      if (point.x === rightUpperPoint.x) {
        if (point.y === rightUpperPoint.y) {
          return {
            leftBorder: false,
            rightBorder: true,
            topBorder: true,
            bottomBorder: false,
          };
        }
        if (point.y === rightLowerPoint.y) {
          return {
            leftBorder: false,
            rightBorder: true,
            topBorder: false,
            bottomBorder: true,
          };
        }
        return {
          leftBorder: false,
          rightBorder: true,
          topBorder: false,
          bottomBorder: false,
        };
      }

      if (point.y === leftUpperPoint.y) {
        return {
          leftBorder: false,
          rightBorder: false,
          topBorder: true,
          bottomBorder: false,
        };
      }
      if (point.y === leftLowerPoint.y) {
        return {
          leftBorder: false,
          rightBorder: false,
          topBorder: false,
          bottomBorder: true,
        };
      }

      return {
        leftBorder: false,
        rightBorder: false,
        topBorder: false,
        bottomBorder: false,
      };
    };

    // if root is empty then just return the borders of the point using global corners
    if (this.root!.children.every((child) => child === null)) {
      return getIndividualBorder(point);
    }

    // create a dummy node using requested position and dummy info
    const dummyNode = new QuadTreeNode("dummy", point, false);

    // get current quadrant
    let currentQuadrant = this.getQuadrant(
      dummyNode,
      leftUpperPoint,
      rightUpperPoint,
      rightLowerPoint,
      leftLowerPoint
    );

    // traverse downwars
    let tempNode = this.root;

    // until temp is null or tempNode is leaf
    while (tempNode !== null && !tempNode.isLeaf) {
      currentQuadrant = this.getQuadrant(
        dummyNode,
        leftUpperPoint,
        rightUpperPoint,
        rightLowerPoint,
        leftLowerPoint
      );

      tempNode = tempNode.children[currentQuadrant]!;

      const newCorners = QuadTree.getNewCorners(
        currentQuadrant,
        leftUpperPoint,
        rightUpperPoint,
        rightLowerPoint,
        leftLowerPoint
      );
      leftUpperPoint = newCorners.leftUpperPoint;
      rightUpperPoint = newCorners.rightUpperPoint;
      rightLowerPoint = newCorners.rightLowerPoint;
      leftLowerPoint = newCorners.leftLowerPoint;
    }

    // check if four points are the same then return all borders true
    if (
      leftUpperPoint.x === rightUpperPoint.x &&
      leftUpperPoint.x === rightLowerPoint.x &&
      leftUpperPoint.x === leftLowerPoint.x &&
      leftUpperPoint.y === rightUpperPoint.y &&
      leftUpperPoint.y === rightLowerPoint.y &&
      leftUpperPoint.y === leftLowerPoint.y
    ) {
      return {
        leftBorder: true,
        rightBorder: true,
        topBorder: true,
        bottomBorder: true,
      };
    }

    return getIndividualBorder(point);
  }

  public getDOTRepresentation(): string {
    // get the DOT representation for the entire tree

    // if there is no nodes or every children of root are null then return graph with root node (sentinel)
    if (
      this.count === 0 ||
      this.root.children.every((child) => child === null)
    ) {
      return `
graph {
  "";
}
      `;
    }

    // return the DOT representation of the tree using internal nodes
    return `
graph {
  ${this.root.getDOT()}
}
    `;
  }
}

export default QuadTree;
