import List from "@/utils/List";

/**
 * A type of list that doesn't include two same items
 */
export default class Collection<T = any> extends List<T> {
    public override add(item: T) {
        this.value.push(item);
    }

    public unshift(item: T) {
        this.value.unshift(item);
    }

    public shift(): T | undefined {
        return this.value.shift();
    }

    public put(index: number, item: T) {
        var temp;

        for(let i = index; i < this.length; i++) {
            if(!temp) {
                temp = this.set(i, item);
                continue;
            }

            temp = this.set(i, temp);

            if(i === this.length - 1) {
                this.add(temp);
            }
        }
    }
}
