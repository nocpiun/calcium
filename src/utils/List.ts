import Utils from "@/utils/Utils";
import Logger from "@/utils/Logger";

export default class List<T = any> {
    public value: T[];

    public constructor(array: T[] | List<T> = []) {
        var value: T[];
        if(array instanceof Array) {
            value = array;
        } else {
            value = array.value;
        }

        this.value = value;
    }

    get length(): number {
        return this.value.length;
    }

    public add(item: T | T[]) {
        if(item instanceof Array) {
            for(let i = 0; i < item.length; i++) {
                this.add(item[i]);
            }
        } else {
            this.value.push(item);
        }
    }

    public get(index: number): T {
        if(index < 0 || index >= this.length) Logger.error("Cannot find the specified item in the list.");

        return this.value[index];
    }

    public set(index: number, item: T): T {
        var oldItem = this.value[index];
        this.value[index] = item;
        return oldItem;
    }

    public remove(index: number) {
        if(index < 0 || index >= this.length) Logger.error("Cannot find the specified item in the list.");

        var j = index;
        while(j < this.value.length) {
            this.value[j] = this.value[j + 1];
            j++;
        }
        this.value.pop();
    }

    public clear() {
        this.value = [];
    }

    public has(item: T): boolean {
        for(let i = 0; i < this.length; i++) {
            if(Utils.is(this.value[i], item)) return true;
        }
        return false;
    }

    public forEach(
        cb: (value: T, index: number, arr: T[]) => void
    ) {
        for(let i = 0; i < this.length; i++) {
            cb(this.value[i], i, this.value);
        }
    }

    public index(item: T): number {
        for(let i = 0; i < this.length; i++) {
            if(Utils.is(this.value[i], item)) return i;
        }
        return -1;
    }

    // public deduplicate() {
    //     this.value = [...new Set(this.value)];
    // }

    public equals(list: List): boolean {
        return Utils.arrayIs(this.value, list.value);
    }

    public isEmpty(): boolean {
        return this.length === 0;
    }

    public getLast(): T {
        return this.value[this.length - 1];
    }
}
