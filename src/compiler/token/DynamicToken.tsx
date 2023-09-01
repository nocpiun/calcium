import Token from "./Token";

export default abstract class DynamicToken extends Token<void> {
    protected raw: string[];

    protected constructor(raw: string[]) {
        super();

        this.raw = raw;
    }
    
    public abstract evaluate(variables: Map<string, string>): number;
}
