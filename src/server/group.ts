import { Group, GroupXGroup, Space, Type } from '../db/dao';
import database from '../db';

const db = database<Group>(database.TABLE.GROUP);
const dbx = database<GroupXGroup>(database.TABLE.GROUPXGROUP);
const dbtype = database<Type>(database.TABLE.TYPE);
const dbspace = database<Space>(database.TABLE.SPACE);
export type LinkedGroup = Group & {
  children: LinkedGroup[];
  links: {
    [type_alias: string]: {
      id: Group['id'];
      alias: Group['alias'];
    }[];
  };
};

type TQuery = {
  id?: number;
  type_id?: number;
  alias?: string;
};

const fillGroupLinks = (group: Group) => {
  const g = group as LinkedGroup;
  const links = dbx
    // query linked groups
    .list((x) => x.group_id === group.id)
    .map((g) => db.query((gg) => gg.id === g.link_group_id))
    .reduce((o, linked) => {
      const has = o[linked!.type_alias];
      if (has) {
        has.push({
          id: linked!.id,
          alias: linked!.alias,
        });
      } else {
        o[linked!.type_alias] = [
          {
            id: linked!.id,
            alias: linked!.alias,
          },
        ];
      }
      return o;
    }, {} as LinkedGroup['links']);
  g.links = links;
};
const fillGroupAlias = (group: Group) => {
  group.space_alias = dbspace.query((x) => x.id === group.space_id)!.alias;
  group.type_alias = dbtype.query((x) => x.id === group.type_id)!.alias;
};

const fillGroupChildren = (group: Group) => {
  const children = db.list((x) => {
    const notSelf = x.path !== group.path;
    const isMatch = x.path.startsWith(group.path);
    const isMutiple = /#.*#/.test(x.path.replace(group.path, ''));
    return notSelf && isMatch && !isMutiple;
  });
  if (Array.isArray(children)) {
    children.forEach((g) => {
      fillGroupAlias(g);
      fillGroupLinks(g);
      fillGroupChildren(g);
    });
    group.children = children;
  }
};

const query = (req: TQuery) => {
  if (!req.id && !req.alias) return null;
  const group = db.query((x) => {
    if (req.id) return x.id === req.id;
    if (req.alias) return x.alias === req.alias;
    return false;
  });
  if (!group) return null;
  fillGroupAlias(group);
  fillGroupLinks(group);
  fillGroupChildren(group);
};

const root = (req: { type_id: number; space_id: number; kw?: string }) => {
  return db
    .list((x) => {
      const isSpace = req.space_id === x.space_id;
      if (!isSpace) return false;
      const isType = req.type_id === x.type_id;
      if (!isType) return false;
      const isRoot = x.is_root;
      if (!isRoot) return false;
      const isMatch = req.kw ? x.alias.indexOf(req.kw) > -1 : true;
      return isMatch;
    })
    .map((g) => {
      fillGroupAlias(g);
      fillGroupLinks(g);
      fillGroupChildren(g);
      return g;
    }) as LinkedGroup[];
};

const add = (req: { group: Partial<Group>; parentPath?: string }) => {
  const row = { ...new Group(), ...req.group };
  row.id = ++Group.id;
  row.is_root = !req.parentPath;
  row.path = req.parentPath ? `${req.parentPath}${row.id}#` : `ROOT${row.id}#`;
  row.space_alias = dbspace.query((x) => x.id === req.group.space_id)!.alias;
  row.type_alias = dbtype.query((x) => x.id === req.group.type_id)!.alias;
  db.add(row);
  return row.id;
};

const link = (req: { links: number[]; group_id: number }) => {
  const map = req.links.reduce((o: any, c) => {
    o[c] = 'append';
    return o;
  }, {});
  dbx.del((x) => {
    const exist = map[x.link_group_id];
    if (exist) {
      delete map[x.link_group_id];
    }
    return x.group_id === req.group_id && exist;
  });
  Object.keys(map).forEach((append) => {
    const x = new GroupXGroup();
    x.id = ++GroupXGroup.id;
    x.group_id = req.group_id;
    x.link_group_id = +append;
    x.group_alias = db.query((x) => x.id === req.group_id)!.alias;
    x.link_group_alias = db.query((x) => x.id === +append)!.alias;
    dbx.add(x);
  });
};

const del = (req: TQuery) => {
  const toDel = db.query((x) => {
    if (req.id) return x.id === req.id;
    if (req.type_id) return x.type_id === req.id;
    if (req.alias) return x.alias === req.alias;
    return false;
  });
  // 事务

  if (!toDel) return;
  // 删除关联表
  db.list((x) => x.path.startsWith(toDel.path)).forEach((son) => {
    dbx.del((x) => x.group_id === son.id || x.link_group_id === son.id);
  });
  // 删除本体
  const ret = db.del((x) => !x.is_root && x.path.startsWith(toDel.path));
  return ret;
};

const update = (req: TQuery, neo: Group) => {
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

export { add, link, del, update, query, root };
