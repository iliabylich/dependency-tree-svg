import data from "../data.json";
import { Registry } from "./registry";
import { test, describe } from "node:test";
import assert from "node:assert"
import { State } from "./state";

const registry = new Registry(data, "root");

describe("State", () => {
    test("initial", () => {
        const state = new State(registry);

        assert.strict.equal(state.registry, registry);
        assert.strict.equal(state.packageName, "root");
        assert.strict.equal(state.parentsDepth, 1);
        assert.strict.equal(state.childrenDepth, 1);
    })

    test("get package", () => {
        const state = new State(registry);

        assert.strict.deepEqual(state.package.name, "root");
    })
})
