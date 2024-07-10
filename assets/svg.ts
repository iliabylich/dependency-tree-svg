export function getPageSize(svgRootElement: SVGSVGElement): { width: number, height: number } {
    const width = svgRootElement.width.baseVal.value;
    const height = svgRootElement.height.baseVal.value;
    return { width, height };
}

export function fixViewBox(svgRootElement: SVGSVGElement) {
    const { width, height } = getPageSize(svgRootElement);
    const viewBox = `0 0 ${width} ${height}`;
    svgRootElement.setAttribute("viewBox", viewBox);
}

export function getFontSize(selector: string): { width: number, height: number } {
    const element = document.querySelector(selector);
    if (!element) {
        throw new Error(`Can't find element with selector ${selector}`);
    }
    const text = element.textContent;
    if (!text) {
        throw new Error(`Element with selector ${selector} doesn't have text`);
    }
    const { width, height } = element.getBoundingClientRect();
    return {
        width: width / text.length,
        height: height
    }
}

export function createGElement(options: { id: string }): SVGGElement {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("id", options.id);
    return g;
}

export function createTextElement(options: { text: string, x: number, y: number }): SVGTextElement {
    const el = document.createElementNS("http://www.w3.org/2000/svg", "text");
    el.setAttribute("x", options.x.toString());
    el.setAttribute("y", options.y.toString());
    el.textContent = options.text;
    el.classList.add("package-name");
    return el;
}

export function createRectElement(options: { x: number, y: number }): SVGRectElement {
    const el = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    el.setAttribute("x", options.x.toString());
    el.setAttribute("y", options.y.toString());
    el.classList.add("box");
    return el;
}

export function createLineElement(options: { x1: number, y1: number, x2: number, y2: number }): SVGLineElement {
    const el = document.createElementNS("http://www.w3.org/2000/svg", "line");
    el.setAttribute("x1", options.x1.toString());
    el.setAttribute("y1", options.y1.toString());
    el.setAttribute("x2", options.x2.toString());
    el.setAttribute("y2", options.y2.toString());
    el.classList.add("arrow");
    return el;
}
