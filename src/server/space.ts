import { Space } from '../db/dao';
import database from '../db';

const db = database<Space>(database.TABLE.SPACE);

type TQuery = { id?: number; alias?: string };
const query = (req: TQuery) => {
  if (!req.id && !req.alias) return null;
  return db.query((x) => {
    if (req.id) return x.id === req.id;
    if (req.alias) return x.alias === req.alias;
    return false;
  });
};
const list = (kw?: string) => {
  return db.list((x) => {
    if (kw) {
      return x.alias.indexOf(kw) > -1;
    }
    return true;
  });
};

const add = (alias: string) => {
  const row = new Space();
  row.alias = alias;
  row.id = ++Space.id;
  db.add(row);
  return row.id;
};

const del = (req: TQuery) => {
  return db.del((x) => {
    if (req.id) return x.id === req.id;
    if (req.alias) return x.alias === req.alias;
    return false;
  });
};

const update = (req: TQuery, neo: Space) => {
  return db.update(
    (x) => {
      if (req.alias) return x.alias === req.alias;
      if (req.id) return x.id === req.id;
      return false;
    },
    (old) => {
      return { ...old, ...neo };
    },
  );
};

export { add, del, update, query, list };
