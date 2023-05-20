const resetStyle = "";
const boldStyle = "font-weight: bold;";

export default class Logger {
    static info(message: string, ...options: any): void {
        console.log("%cLog%c [%cInfo%c] "+ message, boldStyle +"color: #43b6ce", resetStyle, boldStyle, resetStyle, ...options);
    }

    static warn(message: string, ...options: any): void {
        console.log("%cLog%c [%cWarning%c] "+ message, boldStyle +"color: #43b6ce", resetStyle, boldStyle +"color: #f7a95d", resetStyle, ...options);
    }

    static error(message: string, ...options: any): void {
        console.log("%cLog%c [%cError%c] "+ message, boldStyle +"color: #43b6ce", resetStyle, boldStyle +"color: #e78057", resetStyle, ...options);
    }
}
