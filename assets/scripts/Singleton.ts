export default function Singleton() {
    class SingletonT {
    
        protected constructor() { }
    
        private static _inst: SingletonT = null;
    
        public static get Inst(): T {
    
            if (SingletonT._inst === null) {
    
                SingletonT._inst = new this();
    
            }
    
            return SingletonT._inst as T;
    
        }
    
    }
    
    return SingletonT;
    }