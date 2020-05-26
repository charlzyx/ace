export enum TABLE {
  SPACE,
  GROUP,
}

const storage = window.localStorage;

const table = (name: TABLE) => {
  const getter = () => {
    const t = storage.getItem(TABLE[name]);
    return t ? JSON.parse(t) : [];
  };

  let init = getter();
  const proxy = new Proxy(init, {
    get(target, p) {
      init = getter();
      return Reflect.get(init, p);
    },
    set(target, p, v) {
      Reflect.set(init, p, v);
      storage.setItem(TABLE[name], JSON.stringify(init));
      return true;
    },
  });

  return proxy;
};

type IndexDesc<T> = (row: T) => boolean;
type UpdateDesc<T> = (row: T) => T;

const list = <T>(name: TABLE, by: IndexDesc<T>) => {
  const t = table(name);
  return t.filter(by) as T[];
};

const query = <T>(name: TABLE, by: IndexDesc<T>) => {
  const t = table(name);
  return t.find(by) as T | undefined;
};

const update = <T>(name: TABLE, at: IndexDesc<T>, updater: UpdateDesc<T>) => {
  const t = table(name);
  const idx = t.findIndex(at);
  if (idx > -1) {
    t[idx] = updater(t[idx]);
    return true;
  }
  return false;
};

const del = <T>(name: TABLE, at: IndexDesc<T>) => {
  const t = table(name);
  const idx = t.findIndex(at);
  if (idx > -1) {
    t.splice(idx, 1);
    return true;
  }
  return false;
};

const add = <T>(name: TABLE, row: T) => {
  const t = table(name);
  t.push(row);
  return true;
};

const db = <T>(name: TABLE) => {
  return {
    add: (row: T) => add(name, row),
    del: (at: IndexDesc<T>) => del(name, at),
    update: (at: IndexDesc<T>, updater: UpdateDesc<T>) =>
      update(name, at, updater),
    query: (by: IndexDesc<T>) => query(name, by),
    list: (by: IndexDesc<T>) => list(name, by),
  };
};
db.TABLE = TABLE;

export default db as typeof db & {
  TABLE: TABLE;
};
