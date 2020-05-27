import { Group, GroupXGroup } from '../db/dao';
import database from '../db';
import _ from 'lodash';
import { matcher } from '../utils';

const db = database<Group>(database.TABLE.GROUP);
const dbx = database<GroupXGroup>(database.TABLE.GROUPXGROUP);
export type LinkedGroup = Group & {
  children: LinkedGroup[];
  links: {
    [tag_alias: string]: Group['path'][];
  };
};

const fillGroupLinks = (group: Group) => {
  const g = group as LinkedGroup;
  const links = dbx
    .list((x) => x.group_id === group.id)
    .map((g) => db.query((gg) => gg.id === g.link_group_id))
    .reduce((o, linked) => {
      const has = o[linked!.tag_alias];
      if (has) {
        has.push(linked!.path);
      } else {
        o[linked!.tag_alias] = [linked!.path];
      }
      return o;
    }, {} as LinkedGroup['links']);
  g.links = links;
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
      // fillGroupAlias(g);
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
  fillGroupLinks(g);
  fillGroupChildren(g);
  return g as LinkedGroup;
};

const list = (group: Partial<Group>) => {
  console.log('group', group);
  const items = db.list((x) => matcher(group, x, false));
  return items.map((g) => {
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
  const links = (row as LinkedGroup).links;
  // @ts-ignore
  delete row.links;
  row.id = ++Group.id;
  row.path = parent.path ? `${parent.path}${row.id}#` : `ROOT${row.id}#`;
  row.space_id = parent.space_id;
  row.space_alias = parent.space_alias;
  row.tag_id = parent.tag_id;
  row.tag_alias = parent.tag_alias;
  row.type = parent.type;
  linking(links, row.id);
  db.add(row);
  return row.id;
};

const linking = (links: LinkedGroup['links'], group_id: number) => {
  if (!links) return;
  const fltten = Object.keys(links).reduce((arr, k) => {
    const ls = (links as any)[k] || [];
    return arr.concat(
      ls.map((path: string) => {
        // path -> id
        return query({ path })?.id;
      }),
    );
  }, []);
  const append = fltten.reduce((o: any, id) => {
    o[id] = 'append';
    return o;
  }, {});
  dbx.query((x) => {
    if (x.group_id === group_id) {
      // 已经存在的
      if (append[x.link_group_id]) {
        delete append[x.link_group_id];
      } else {
        // 不存在了, 双向删除
        dbx.del((i) => {
          return (
            (i.group_id === group_id && i.link_group_id === x.link_group_id) ||
            (i.group_id === x.link_group_id && i.link_group_id === x.group_id)
          );
        });
      }
    }

    return false;
  });
  // 删除不存在的 link
  // 双向表
  Object.keys(append).forEach((aid) => {
    const x = new GroupXGroup();
    x.id = ++GroupXGroup.id;
    x.group_id = group_id;
    x.link_group_id = +aid;
    dbx.add(x);
    const r = new GroupXGroup();
    r.id = ++GroupXGroup.id;
    r.group_id = +aid;
    r.link_group_id = group_id;
    dbx.add(r);
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

const update = (group: Partial<LinkedGroup>) => {
  const match: typeof group = {};
  if (group.id) match.id = group.id;
  if (group.tag_id) match.tag_id = group.tag_id;
  if (group.space_id) match.space_id = group.space_id;
  const neo = db.update(
    (x) => matcher(match, x, false),
    (old) => {
      return { ...old, ...group };
    },
  );
  if (!neo) return;
  const next = query({ id: neo.id });
  if (group.links && !_.isEqual(group.links, next?.links)) {
    linking(group.links, neo.id);
  }
};

export { add, del, update, query, list };
