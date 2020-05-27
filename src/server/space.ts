import { Space } from '../db/dao';
import database from '../db';
import { matcher } from '../utils';

const db = database<Space>(database.TABLE.SPACE);

const query = (space: Partial<Space>) => {
  return db.query((x) => matcher(space, x, false));
};

const list = (space?: Partial<Space>) => {
  return db.list((x) => matcher(space, x, true));
};

const add = (space: Omit<Space, 'id'>) => {
  const row = { ...new Space(), ...space };
  row.id = ++Space.id;
  db.add(row);
  return row.id;
};

const del = (space: Partial<Space>) => {
  return db.del((x) => matcher(space, x, false));
};

const update = (space: Partial<Space>) => {
  return db.update(
    (x) => matcher({ id: space.id }, x, false),
    (old) => {
      return { ...old, ...space };
    },
  );
};

export { add, del, update, query, list };
