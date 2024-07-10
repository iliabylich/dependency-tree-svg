import { Package } from "./registry"
import { State } from "./state"

type Coordinates = { x: number, y: number }
type Capture = Coordinates & { text: string }
type Box = Coordinates & { root: boolean, capture: Capture, packageName: string }
type Arrow = { from: Coordinates, to: Coordinates }

interface GridToDraw {
    boxes: Box[],
    arrows: Arrow[]
}

class Grid {
    fontSize: { width: number, height: number }
    boxSize: number
    pageSize: { width: number, height: number }

    constructor(
        options: {
            fontSize: { width: number, height: number },
            boxSize: number,
            pageSize: { width: number, height: number }
        }
    ) {
        this.fontSize = options.fontSize;
        this.boxSize = options.boxSize;
        this.pageSize = options.pageSize
    }

    make(state: State): GridToDraw {
        const levels = treeToLevels(state.package, state.parentsDepth, state.childrenDepth);

        const gridHeight = levels.length;
        const gridWidth = Math.max(...levels.map(level => level.length));

        const packageNameToCoordinates: Map<string, Coordinates> = new Map();
        const boxes: Box[] = [];

        const spaceBetweenY = (this.pageSize.height - gridHeight * this.boxSize) / (gridHeight + 1);
        let y = spaceBetweenY;
        for (const level of levels) {
            const spaceBetweenX = (this.pageSize.width - level.length * this.boxSize) / (level.length + 1);
            let x = spaceBetweenX;
            for (const node of level) {
                const capture = this.makeCapture(x, y, node.name);
                boxes.push({ x, y, root: node.name === state.packageName, capture, packageName: node.name });
                packageNameToCoordinates.set(node.name, { x, y });
                x += this.boxSize + spaceBetweenX;
            }
            y += this.boxSize + spaceBetweenY;
        }

        const edges = treeEdges(state.package, state.parentsDepth, state.childrenDepth);
        const arrows: Arrow[] = [];

        for (const [from, nodes] of edges) {
            for (const to of nodes) {
                const rectFrom = packageNameToCoordinates.get(from);
                if (!rectFrom) {
                    throw new Error(`Can't find coordinates for rect ${from}`);
                }
                const rectTo = packageNameToCoordinates.get(to);
                if (!rectTo) {
                    throw new Error(`Can't find coordinates for rect ${to}`);
                }

                const arrow = {
                    from: {
                        x: rectFrom.x + this.boxSize / 2,
                        y: rectFrom.y + this.boxSize
                    },
                    to: {
                        x: rectTo.x + this.boxSize / 2,
                        y: rectTo.y - 4
                    }
                };

                arrows.push(arrow);
            }
        }


        return {
            boxes,
            arrows
        }
    }

    private makeCapture(x: number, y: number, text: string): Capture {
        const width = this.fontSize.width * text.length;
        const spaceX = (this.boxSize - width) / 2;
        const spaceY = (this.boxSize - this.fontSize.height) / 2;
        return { x: x + spaceX, y: y + spaceY + this.fontSize.height - 4, text };
    }
}

function treeToLevels(root: Package, parentsDepth: number, childrenDepth: number) {
    function addOneMoreLevel(levels: Package[][], property: "children" | "parents") {
        const currentLevel = levels[levels.length - 1];
        const nextLevelMap: Map<string, Package> = new Map();

        for (const currentPackage of currentLevel) {
            for (const [_, nextPackage] of currentPackage[property]) {
                nextLevelMap.set(nextPackage.name, nextPackage);
            }
        }
        const nextLevel = [...nextLevelMap.values()];

        levels.push(nextLevel);
    }

    function walkOverAtMostNLevels(count: number, property: "children" | "parents"): Package[][] {
        const levels = [[root]];
        while (count > 0 && levels[levels.length - 1].length !== 0) {
            addOneMoreLevel(levels, property);
            count -= 1;
        }
        if (levels[levels.length - 1].length === 0) {
            levels.pop();
        }
        return levels.slice(1);
    }

    const parents = walkOverAtMostNLevels(parentsDepth, "parents").reverse();
    const children = walkOverAtMostNLevels(childrenDepth, "children");

    const allLevels = [
        ...parents,
        [root],
        ...children
    ];
    return allLevels;
}

function treeEdges(root: Package, parentsDepth: number, childrenDepth: number): Map<string, Set<string>> {
    const map: Map<string, Set<string>> = new Map();

    function add(from: string, to: string) {
        if (!map.has(from)) {
            map.set(from, new Set());
        }
        map.get(from)!.add(to)
    }

    function visitParents(node: Package, depth: number) {
        if (depth === 0) {
            return;
        }
        for (const [_, parent] of node.parents) {
            add(parent.name, node.name);
            visitParents(parent, depth - 1);
        }
    }

    function visitChildren(node: Package, depth: number) {
        if (depth === 0) {
            return;
        }
        for (const [_, child] of node.children) {
            add(node.name, child.name);
            visitChildren(child, depth - 1);
        }
    }

    visitParents(root, parentsDepth);
    visitChildren(root, childrenDepth);

    return map;
}

export { Grid, treeToLevels, Box, Capture, Arrow }
