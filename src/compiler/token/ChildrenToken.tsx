import PowerableToken from "./PowerableToken";
import Token from "./Token";

export default abstract class ChildrenToken extends PowerableToken<Token[]> {
    public getChild<T extends Token = Token>(index: number): T {
        return this.value[index] as T;
    }

    public getLastChild<T extends Token = Token>(): T {
        return this.getChild(this.getLength() - 1) as T;
    }

    public getLength(): number {
        return this.value.length;
    }

    public add(item: Token): void {
        this.value.push(item);
    }
}
