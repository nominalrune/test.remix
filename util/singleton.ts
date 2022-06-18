declare global {
  var singleton_ns:any;
}

export default function singleton<T extends {name:string, new(...args:any[]):any}>(_class: T, args?: ConstructorParameters<T>):InstanceType<T> {
  if (!(global.singleton_ns?.[_class.name] instanceof _class)) {
    global.singleton_ns[_class.name] = new _class(args);
    }
    return global.singleton_ns[_class.name];
};
