import List from "./List";

export default class Queue<T = any> extends List<T> {
    public enqueue(element: T | T[]): void {
        this.add(element);
    }

    public dequeue(): T {
        if(this.isEmpty()) throw new Error("No element in the list to dequeue.");

        const firstElem = this.front();
        this.remove(0);
        return firstElem;
    }

    public front(): T {
        return this.value[0];
    }

    public size(): number {
        return this.length;
    }

    public toString(): string {
        var result = "";
        for(let v of this.value) {
            result += v +" ";
        }
        return result;
    }
}
