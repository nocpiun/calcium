export default function Singleton<C extends { new(): any }>(baseClass: C) {
    var instance: C;

    return class {
        public constructor() {
            if(!instance) instance = new baseClass();
            return instance;
        }
    } as C;
}
