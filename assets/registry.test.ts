import data from "../data.json";
import { Registry } from "./registry";
import { test, describe } from "node:test";
import assert from "node:assert"

const registry = new Registry(data, "root");

const assertHasChildren = (parent: string, children: string[]) => {
    const expected = [...children].sort();
    const actual = [...registry.getPackage(parent).children.keys()].sort();
    assert.strict.deepEqual(expected, actual);
}
const assertHasParents = (child: string, parents: string[]) => {
    const expected = [...parents].sort();
    const actual = [...registry.getPackage(child).parents.keys()].sort();
    assert.strict.deepEqual(expected, actual);
}

describe("Registry", () => {
    test("#root", () => {
        assert.strictEqual(registry.root.name, "root");
    })

    test("connections", () => {
        assertHasChildren("root", ["1", "2", "3"]);
        assertHasChildren("1", ["10", "11", "12"]);
        assertHasChildren("2", ["12", "13"]);
        assertHasChildren("3", ["14", "11"]);
        assertHasChildren("11", ["100", "101"]);
        assertHasChildren("13", ["101", "102"]);
        assertHasChildren("101", ["1001", "1002"]);

        assertHasParents("1", ["root"]);
        assertHasParents("2", ["root"]);
        assertHasParents("3", ["root"]);
        assertHasParents("1002", ["101"]);
    })
})
