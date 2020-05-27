import { Group, Space, Tag } from '../db/dao';
import database from '../db';
import * as group from './group';
import { matcher } from '../utils';

const db = database<Tag>(database.TABLE.TAG);
const dbspace = database<Space>(database.TABLE.SPACE);

const query = (tag: Partial<Tag>) => {
  const t = db.query((x) => matcher(tag, x, false));
  return t;
};

const list = (tag?: Partial<Tag>) => {
  const tags = db.list((x) => matcher(tag, x, true));
  return tags;
};

const add = (tag: Omit<Tag, 'id'>) => {
  const row = { ...new Tag(), ...tag };
  row.space_alias = dbspace.query((x) => x.id === tag.space_id)!.alias;
  row.alias = tag.alias;
  row.id = ++Tag.id;
  db.add(row);
  const root = new Group();
  root.alias = tag.alias;
  root.children = [];
  root.is_root = true;

  group.add(root, {
    space_alias: row.space_alias,
    space_id: row.space_id,
    tag_id: row.id,
    tag_alias: row.alias,
    type: row.type,
  });
  return row.id;
};

const del = (tag: Partial<Tag>) => {
  const t = db.query((x) => matcher(tag, x, false));
  if (!t) return;
  const retg = group.del({ tag_id: t.id });
  const ret = db.del((x) => x.id === t.id);
  return retg && ret;
};

const update = (tag: Partial<Tag>) => {
  const match: typeof tag = {};
  if (tag.id) match.id = tag.id;
  if (tag.space_id) match.space_id = tag.space_id;
  return db.update(
    (x) => matcher({ id: tag.id }, x, false),
    (old) => {
      const neo = { ...old, ...tag };
      group.update({ tag_id: neo.id, type: neo.type, tag_alias: neo.alias });
      return neo;
    },
  );
};

export { add, del, update, query, list };
