import db from '../db';

export const api = {};

export type TSpace = {
  id: number;
  name: string;
  desc?: string;
};

export type TGroup = {
  id: number;
  sid: number;
  type: 'user' | 'role' | 'dept' | 'area';
  // parentId,id,sonId,
  path?: string;
  name: string;
  links: {
    [type: string]: {
      list: number[];
      map: {
        [id: string]: boolean;
      };
    };
  };
};

const SpaceDB = db<TSpace>(db.TABLE.SPACE);
const GroupDB = db<TGroup>(db.TABLE.GROUP);

let usid = Math.max(0, ...SpaceDB.list((x) => true).map((s) => s.id));
let ugid = Math.max(0, ...GroupDB.list((x) => true).map((s) => s.id));

const space = {
  append(name: string, desc?: string) {
    const neo = {
      id: ++usid,
      name,
      desc,
    };
    SpaceDB.add(neo);
    return Promise.resolve(neo);
  },
  update(id: number, neo: TSpace) {
    return Promise.resolve(() => {
      return SpaceDB.update(
        (x) => x.id === id,
        (v) => ({ ...v, ...neo }),
      );
    });
  },
  del(id: number) {
    const ret = SpaceDB.del((x) => x.id === id);
    return Promise.resolve(ret);
  },
  query(kw?: string) {
    return Promise.resolve(
      SpaceDB.list((x) => (kw ? x.name.indexOf(kw) > -1 : true)),
    );
  },
};

const group = {
  append(sid: number, name: string, type: TGroup['type'], prefix?: string) {
    const neo: TGroup = {
      id: ++ugid,
      sid,
      links: {},
      name,
      type,
    };
    neo.path = `${prefix}#${neo.id}`;
    GroupDB.add(neo);
    return Promise.resolve(neo);
  },
  update(id: number, neo: TGroup) {
    return Promise.resolve(() => {
      return GroupDB.update(
        (x) => x.id === id,
        (v) => ({ ...v, ...neo }),
      );
    });
  },
  del(id: number) {
    const ret = GroupDB.del((x) => x.id === id);
    return Promise.resolve(ret);
  },
  query(sid: number, kw?: string) {
    return Promise.resolve(
      GroupDB.list((x) => {
        const isSpace = x.sid === sid;
        if (!isSpace) return false;
        const isMatch = kw ? x.name.indexOf(kw) > -1 : true;
        return isMatch;
      }),
    );
  },
};

export default {
  space,
  group,
};
