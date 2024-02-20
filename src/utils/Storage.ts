import Singleton from "@/utils/Singleton";

@Singleton
export default class Storage {
    private localStorage = window.localStorage;

    public getItem(key: string, defaultValue: string): string {
        var result = this.localStorage.getItem(key);
        if(result) {
            return result;
        } else {
            this.setItem(key, defaultValue);
            return defaultValue;
        }
    }

    public setItem(key: string, value: string) {
        this.localStorage.setItem(key, value);
    }

    public remove(key: string) {
        this.localStorage.removeItem(key);
    }
}
