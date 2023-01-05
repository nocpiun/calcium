import Utils from "./Utils";

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

    public add(item: T | T[]): void {
        if(item instanceof Array) {
            for(let i = 0; i < item.length; i++) {
                this.add(item[i]);
            }
        } else {
            this.value.push(item);
        }
    }

    public get(index: number): T {
        if(index < 0 || index >= this.length) throw new Error("Cannot find the specified item in the list.");

        return this.value[index];
    }

    public set(index: number, item: T): void {
        this.value[index] = item;
    }

    public remove(index: number): void {
        if(index < 0 || index >= this.length) throw new Error("Cannot find the specified item in the list.");

        var j = index;
        while(j < this.value.length) {
            this.value[j] = this.value[j + 1];
            j++;
        }
        this.value.pop();
    }

    public clear(): void {
        this.forEach((_value, i) => {
            this.remove(i);
        });
    }

    public has(item: T): boolean {
        for(let i = 0; i < this.length; i++) {
            if(Utils.is(this.value[i], item)) return true;
        }
        return false;
    }

    public forEach(
        cb: (value: T, index: number, arr: T[]) => void
    ): void {
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

    public deduplicate(): void {
        for(let i = 0; i < this.length; i++) {
            var current = this.value[i];
            for(let j = 0; j < this.length; j++) {
                if(this.value[j] === current && j !== i) {
                    this.value.splice(j, 1);
                    j--;
                }
            }
        }
    }

    public equals(list: List): boolean {
        return Utils.arrayIs(this.value, list.value);
    }

    public isEmpty(): boolean {
        return this.length === 0;
    }
}
