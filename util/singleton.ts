declare global {
  var singleton_ns:any;
}

export default function singleton<T extends {name:string, new(...args:any[]):any}>(_class: T, args?: ConstructorParameters<T>):InstanceType<T> {
  let __class= global.singleton_ns?.[_class.name];
  if (!(__class instanceof _class)) {
    __class = new _class(args);
    }
    return __class;
};
