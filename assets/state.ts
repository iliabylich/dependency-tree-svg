import { Package, Registry } from "./registry";

class State {
    packageName: string;
    parentsDepth: number;
    childrenDepth: number;
    registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        this.packageName = registry.rootPackageName;
        this.parentsDepth = 1;
        this.childrenDepth = 1;
    }

    get package(): Package {
        return this.registry.getPackage(this.packageName);
    }
}

export { State };
