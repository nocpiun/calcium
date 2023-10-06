import Token from "@/compiler/token/Token";

export default abstract class PowerableToken<T = any> extends Token<T> {
    public exponential?: number;
}
