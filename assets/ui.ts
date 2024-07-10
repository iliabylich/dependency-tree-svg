import { Arrow, Box, Capture, Grid } from "./grid";
import { Registry } from "./registry";
import { State } from "./state";
import { createGElement, createLineElement, createRectElement, createTextElement, fixViewBox, getFontSize, getPageSize } from "./svg";

const CONTAINER_ID = "tree";
const BOX_SIZE = 100;

class UI {
    registry: Registry;
    state: State;
    svg: SVGSVGElement;
    treeElement: SVGGElement;
    grid: Grid

    constructor(registry: Registry, state: State) {
        this.svg = document.querySelector("svg")!;
        fixViewBox(this.svg);

        const pageSize = getPageSize(this.svg);
        const fontSize = getFontSize("#one-line-text-sample");

        this.registry = registry;
        this.state = state;
        this.treeElement = document.getElementById("tree")! as unknown as SVGGElement;

        this.grid = new Grid({ fontSize, boxSize: BOX_SIZE, pageSize });
    }

    wire() {
        this.draw();
        window.addEventListener('click', (e) => {
            const el = e.target as unknown as HTMLElement;
            const packageName = el.dataset.package;
            if (packageName && packageName !== this.state.packageName) {
                this.state.packageName = packageName;
                this.redraw();
            }
        })
        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'f') {
                console.log("search");
            }
        })
    }

    private redraw() {
        this.clear();
        this.draw();
    }

    private clear() {
        const newTreeElement = createGElement({ id: CONTAINER_ID });
        this.treeElement.remove();
        this.svg.appendChild(newTreeElement);
        this.treeElement = newTreeElement;
    }

    private draw() {
        const { boxes, arrows } = this.grid.make(this.state);

        boxes.forEach(box => this.drawBox(box));
        arrows.forEach(arrow => this.drawArrow(arrow));
    }

    private drawBox(box: Box) {
        const rect = createRectElement({ x: box.x, y: box.y });
        rect.dataset.package = box.packageName;
        const className = box.root ? "blue-box" : "green-box";
        rect.classList.add(className);
        this.treeElement.appendChild(rect);

        const text = createTextElement({ x: box.capture.x, y: box.capture.y, text: box.capture.text });
        text.dataset.package = box.packageName;
        this.treeElement.appendChild(text);
    }

    private drawArrow(arrow: Arrow) {
        const line = createLineElement({
            x1: arrow.from.x,
            y1: arrow.from.y,
            x2: arrow.to.x,
            y2: arrow.to.y
        });
        this.treeElement.appendChild(line)
    }
}

export { UI }
