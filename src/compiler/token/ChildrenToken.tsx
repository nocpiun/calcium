import PowerableToken from "./PowerableToken";
import Token from "./Token";

export default abstract class ChildrenToken extends PowerableToken<Token[]> {
    public getChild(index: number): Token {
        return this.value[index];
    }

    public getLength(): number {
        return this.value.length;
    }

    public add(item: Token): void {
        this.value.push(item);
    }
}
