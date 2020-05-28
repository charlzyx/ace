import { Group, Space, Tag } from '../db/dao';
import { GroupVO, TagVO } from './vo';
import database from '../db';
import _ from 'lodash';
import * as groups from './group';
import { matcher } from '../utils';

const db = database<Tag>(database.TABLE.TAG);
const dbspace = database<Space>(database.TABLE.SPACE);

const query = (tag: Partial<TagVO>) => {
  const t = db.query((x) => matcher(tag, x, false));
  if (!t) return t;
  const tt = _.cloneDeep(t);
  tt.space_alias = dbspace.query((x) => x.id === t.space_id)!.alias;
  return tt;
};

const list = (tag?: Partial<TagVO>) => {
  const tags = db
    .list((x) => matcher(tag, x, true))
    .map((t) => {
      const tt = _.cloneDeep(t);
      tt.space_alias = dbspace.query((x) => x.id === t.space_id)!.alias;
      return tt;
    });
  return tags;
};

const add = (tag: Omit<TagVO, 'id'>) => {
  const row = { ...new Tag(), ...tag };
  row.alias = tag.alias;
  row.id = ++Tag.id;
  db.add(row);
  const root = new Group() as GroupVO;
  root.alias = tag.alias;
  root.children = [];
  root.is_root = true;

  groups.add(root, {
    tag_id: row.id,
  });
  return row.id;
};

const del = (tag: Partial<TagVO>) => {
  const t = db.query((x) => matcher(tag, x, false));
  if (!t) return;
  groups.list({ tag_id: t.id }).forEach((g) => {
    groups.del({ id: g.id });
  });
  const ret = db.del((x) => x.id === t.id);
  return ret;
};

const update = (tag: Partial<TagVO>) => {
  const match: typeof tag = {};
  if (tag.id) match.id = tag.id;
  if (tag.space_id) match.space_id = tag.space_id;
  db.update(
    (x) => matcher({ id: tag.id }, x, false),
    (old) => {
      return { ...old, ...tag };
    },
  );
  return db.query((x) => x.id === tag.id);
};

export { add, del, update, query, list };
