interface Package {
    name: string,
    parents: Map<string, Package>,
    children: Map<string, Package>
}

class Registry {
    rootPackageName: string;
    graph: Map<string, Package>;

    constructor(data: { [K in string]: string[] }, rootPackageName: string) {
        this.graph = new Map();

        const getOrMakeNewPackage = (name: string): Package => {
            if (!this.graph.has(name)) {
                this.graph.set(name, { name, parents: new Map(), children: new Map() });
            }
            return this.graph.get(name)!;
        }

        for (const [packageName, dependencyNames] of Object.entries(data)) {
            const parent = getOrMakeNewPackage(packageName);
            const dependencies = dependencyNames.map(getOrMakeNewPackage);

            for (const dependency of dependencies) {
                dependency.parents.set(parent.name, parent);
                parent.children.set(dependency.name, dependency);
            }
        }

        if (!this.graph.has(rootPackageName)) {
            throw new Error(`Provided dataset doesn't have root package ${rootPackageName}`);
        }
        this.rootPackageName = rootPackageName;
    }

    get root(): Package {
        return this.graph.get(this.rootPackageName)!;
    }

    getPackage(packageName: string): Package {
        const result = this.graph.get(packageName);
        if (!result) {
            throw new Error(`Unable to find package ${packageName}`);
        }
        return result;
    }
}

export { Package, Registry };
