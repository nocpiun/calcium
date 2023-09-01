import Token from "./Token";

export default abstract class DynamicToken extends Token<void> {
    protected raw: string[];
    protected variables: Map<string, string>;

    protected constructor(raw: string[], variables: Map<string, string>) {
        super();

        this.raw = raw;
        this.variables = variables;
    }
    
    public abstract evaluate(): number;
}
