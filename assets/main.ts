import { Registry } from "./registry";
import { State } from "./state";
import data from "../data.json";
import { UI } from "./ui";

const customData = (window as any).data;
if (customData === undefined) {
    console.log("window.data is not defined, using default data...");
}

const registry = new Registry(customData || data, "root");
const state = new State(registry);
state.childrenDepth = 2;
state.parentsDepth = 2;

const ui = new UI(registry, state);
ui.wire();
