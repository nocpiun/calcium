import List from "./List";

/**
 * A type of list that doesn't include two same items
 */
export default class Collection<T = any> extends List<T> {
    public override add(item: T): void {
        this.value.push(item);
        this.deduplicate();
    }

    public unshift(item: T): void {
        this.value.unshift(item);
        this.deduplicate();
    }

    public shift(): T | undefined {
        return this.value.shift();
    }
}
