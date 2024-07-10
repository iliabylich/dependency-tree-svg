import data from "../data.json";
import { Registry } from "./registry";
import { test, describe } from "node:test";
import assert from "node:assert"
import { State } from "./state";
import { treeToLevels } from "./grid";

const registry = new Registry(data, "root");
const state = new State(registry);

// root
// 1, 2, 3
// 10, 11, 12, 13, 14
// 100, 101, 102
// 1001, 1002

describe("Pre-draw helpers", () => {
    test("treeToLevels", () => {
        assert.strict.deepEqual(
            treeToLevels(state.package, 100, 100).map(level => level.map(node => node.name)),
            [
                ['root'],
                ['1', '2', '3'],
                ['10', '11', '12', '13', '14'],
                ['100', '101', '102'],
                ['1001', '1002']
            ]
        );
    })
})
