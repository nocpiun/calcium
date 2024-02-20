import Token from "@/compiler/token/Token";

export default abstract class DynamicToken extends Token<void> {
    protected constructor(
        protected raw: string[],
        protected variables: Map<string, string>
    ) {
        super();
    }
    
    public abstract evaluate(): number;
}
