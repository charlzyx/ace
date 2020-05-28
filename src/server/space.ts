import { SpaceVO } from './vo';
import database from '../db';
import { Space } from '../db/dao';
import * as tags from './tag';
import { matcher } from '../utils';

const db = database<SpaceVO>(database.TABLE.SPACE);

const query = (space: Partial<SpaceVO>) => {
  return db.query((x) => matcher(space, x, false));
};

const list = (space?: Partial<SpaceVO>) => {
  return db.list((x) => matcher(space, x, true));
};

const add = (space: Omit<SpaceVO, 'id'>) => {
  const row = { ...new Space(), ...space };
  row.id = ++Space.id;
  db.add(row);
  return row.id;
};

const del = (space: Partial<SpaceVO>) => {
  const d = query(space)!;
  tags.list({ space_id: d.id }).forEach((t) => {
    tags.del({ id: t.id });
  });
  return db.del((x) => matcher(space, x, false));
};

const update = (space: Partial<SpaceVO>) => {
  return db.update(
    (x) => matcher({ id: space.id }, x, false),
    (old) => {
      return { ...old, ...space };
    },
  );
};

export { add, del, update, query, list };
