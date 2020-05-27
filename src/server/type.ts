import { Group, Space, Type } from '../db/dao';
import database from '../db';
import * as group from './group';

const db = database<Type>(database.TABLE.TYPE);
const dbspace = database<Space>(database.TABLE.SPACE);

type TQuery = { id?: number; alias?: string };

const query = (req: TQuery) => {
  if (!req.id && !req.alias) return null;
  return db.query((x) => {
    if (req.id) return x.id === req.id;
    if (req.alias) return x.alias === req.alias;
    return false;
  });
};

const list = (space_id: number, kw?: string) => {
  return db.list((x) => {
    const isSpace = x.space_id === space_id;
    if (!isSpace) return false;
    if (kw) {
      return x.alias.indexOf(kw) > -1;
    }
    return true;
  });
};

const add = (space_id: number, alias: string) => {
  const row = new Type();
  row.space_id = space_id;
  row.space_alias = dbspace.query((x) => x.id === space_id)!.alias;
  row.alias = alias;
  row.id = ++Type.id;
  db.add(row);
  const root = new Group();
  root.space_id = space_id;
  root.type_id = row.id;
  root.alias = alias;
  root.children = [];
  group.add({ group: root });
  return row.id;
};

const del = (req: TQuery) => {
  const t = db.query((x) => {
    if (req.id) return x.id === req.id;
    if (req.alias) return x.alias === req.alias;
    return false;
  });
  if (!t) return;
  const retg = group.del({ type_id: t.id });
  const ret = db.del((x) => x.id === t.id);
  return retg && ret;
};

const update = (req: TQuery, neo: Type) => {
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
