import { Group, GroupXGroup, Space, Tag } from '../db/dao';
import database from '../db';
import { matcher } from '../utils';

const db = database<Group>(database.TABLE.GROUP);
const dbx = database<GroupXGroup>(database.TABLE.GROUPXGROUP);
const dbtype = database<Tag>(database.TABLE.TAG);
const dbspace = database<Space>(database.TABLE.SPACE);
export type LinkedGroup = Group & {
  children: LinkedGroup[];
  links: {
    [tag_alias: string]: {
      id: Group['id'];
      alias: Group['alias'];
    }[];
  };
};

const fillGroupLinks = (group: Group) => {
  const g = group as LinkedGroup;
  const links = dbx
    // query linked groups
    .list((x) => x.group_id === group.id)
    .map((g) => db.query((gg) => gg.id === g.link_group_id))
    .reduce((o, linked) => {
      const has = o[linked!.tag_alias];
      if (has) {
        has.push({
          id: linked!.id,
          alias: linked!.alias,
        });
      } else {
        o[linked!.tag_alias] = [
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
  group.tag_alias = dbtype.query((x) => x.id === group.tag_id)!.alias;
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

const query = (group: Partial<Group>) => {
  console.log('group', group);
  const g = db.query((x) => matcher(group, x, false));
  if (!g) return null;
  fillGroupAlias(g);
  fillGroupLinks(g);
  fillGroupChildren(g);
  return g;
};

const list = (group: Partial<Group>) => {
  console.log('group', group);
  const items = db.list((x) => matcher(group, x, false));
  return items.map((g) => {
    fillGroupAlias(g);
    fillGroupLinks(g);
    fillGroupChildren(g);
    return g;
  });
};

const add = (
  group: Omit<Group, 'id'>,
  parent: {
    path?: Group['path'];
    space_id: Group['space_id'];
    space_alias: Group['space_alias'];
    tag_id: Group['tag_id'];
    tag_alias: Group['tag_alias'];
    type: Group['type'];
  },
) => {
  const row = { ...new Group(), ...group };
  row.id = ++Group.id;
  row.path = parent.path ? `${parent.path}${row.id}#` : `ROOT${row.id}#`;
  row.space_id = parent.space_id;
  row.space_alias = parent.space_alias;
  row.tag_id = parent.tag_id;
  row.tag_alias = parent.tag_alias;
  row.type = parent.type;
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

const del = (group: Partial<Group>) => {
  const d = db.query((x) => matcher(group, x, false));

  // 事务??

  if (!d) return;
  // 删除关联表
  db.list((x) => x.path.startsWith(d.path)).forEach((son) => {
    dbx.del((x) => x.group_id === son.id || x.link_group_id === son.id);
  });
  // 删除本体
  const ret = db.del((x) => !x.is_root && x.path.startsWith(d.path));
  return ret;
};

const update = (group: Partial<Group>) => {
  const match: typeof group = {};
  if (group.id) match.id = group.id;
  if (group.tag_id) match.tag_id = group.tag_id;
  if (group.space_id) match.space_id = group.space_id;
  return db.update(
    (x) => matcher(match, x, false),
    (old) => {
      return { ...old, ...group };
    },
  );
};

export { add, link, del, update, query, list };
