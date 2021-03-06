export enum TABLE {
  SPACE = 'SPACE',
  TAG = 'TAG',
  GROUP = 'GROUP',
  GROUPXGROUP = 'GROUPXGROUP',
}

export enum TYPE {
  USER = 'USER',
  ROLE = 'ROLE',
  DATA = 'DATA',
  RESOURCE = 'RESOURCE',
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

type Selector<T> = (row: T) => boolean;
type Updater<T> = (row: T) => T;

const list = <T>(name: TABLE, by: Selector<T>) => {
  const t = table(name);
  return t.filter(by) as T[];
};

const query = <T>(name: TABLE, by: Selector<T>) => {
  const t = table(name);
  return t.find((row: T) => {
    if (row) {
      return by(row);
    }
    return false;
  }) as T | undefined;
};

const update = <T>(name: TABLE, at: Selector<T>, updater: Updater<T>) => {
  const t = table(name);
  t.forEach((row: T, idx: number) => {
    if (at(row)) {
      updater(t[idx]);
    }
  });
  return true;
};

const del = <T>(name: TABLE, at: Selector<T>) => {
  let t = table(name);
  t.forEach((row: T, idx: number) => {
    if (at(row)) {
      t.splice(idx, 1);
    }
  });
  return true;
};

const add = <T>(name: TABLE, row: T) => {
  const t = table(name);
  t.push(row);
  return true;
};

const db = <T>(name: TABLE) => {
  return {
    add: (row: T) => add(name, row),
    del: (at: Selector<T>) => del(name, at),
    update: (at: Selector<T>, updater: Updater<T>) => update(name, at, updater),
    query: (by: Selector<T>) => query(name, by),
    list: (by: Selector<T>) => list(name, by),
  };
};
db.TABLE = TABLE;

export default db as typeof db & {
  TABLE: TABLE;
};
