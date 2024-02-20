export default class Storage {
    private static instance: Storage | null;
    private localStorage = window.localStorage;

    public static get(): Storage {
        if(!Storage.instance) Storage.instance = new Storage();
        return Storage.instance;
    }

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
