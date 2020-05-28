import { Group, GroupXGroup } from '../db/dao';
import { GroupVO } from './vo';
import database from '../db';
import _ from 'lodash';
import { matcher } from '../utils';
import * as tags from './tag';

const db = database<Group>(database.TABLE.GROUP);
const dbx = database<GroupXGroup>(database.TABLE.GROUPXGROUP);

const fillGroupBasic = (group: Group): GroupVO => {
  const g = group as GroupVO;
  const tag = tags.query({ id: g.tag_id });
  if (tag) {
    g.tag_alias = tag.alias;
    g.space_id = tag.space_id;
    g.space_alias = tag.space_alias;
    g.type = tag.type;
  }
  return g as GroupVO;
};

const fillGroupLinks = (group: Group): GroupVO => {
  const g = group as GroupVO;
  const links = dbx
    .list((x) => x.group_id === group.id)
    .map((g) => fillGroupBasic(db.query((gg) => gg.id === g.link_group_id)!))
    .reduce((o, linked) => {
      const has = o[linked.tag_alias];
      if (has) {
        has.push(linked!.path);
      } else {
        o[linked!.tag_alias] = [linked!.path];
      }
      return o;
    }, {} as GroupVO['links']);
  g.links = links;
  return g;
};

const fillGroupChildren = (group: Group): GroupVO => {
  const children = db.list((x) => {
    const notSelf = x.path !== group.path;
    const isMatch = x.path.startsWith(group.path);
    const isMutiple = /#.*#/.test(x.path.replace(group.path, ''));
    return notSelf && isMatch && !isMutiple;
  });
  if (Array.isArray(children)) {
    children.forEach((g) => {
      fillGroupBasic(g);
      fillGroupLinks(g);
      fillGroupChildren(g);
    });
    group.children = children;
  }

  return group as GroupVO;
};

const fillGroup = (group: Group): GroupVO => {
  const g = _.cloneDeep(group);
  fillGroupBasic(g);
  fillGroupLinks(g);
  fillGroupChildren(g);
  return g as GroupVO;
};

const query = (group: Partial<GroupVO>) => {
  const g = db.query((x) => matcher(group, fillGroup(x), false));
  if (!g) return null;
  return fillGroup(g);
};

const list = (group?: Partial<GroupVO>) => {
  const items = db.list((x) => matcher(group, fillGroup(x), true));
  return items.map((g) => {
    return fillGroup(g);
  });
};

const add = (
  group: Partial<GroupVO>,
  parent: {
    path?: Group['path'];
    tag_id: Group['tag_id'];
  },
) => {
  const row = { ...new Group(), ...group, children: [] };
  const links = (row as GroupVO).links;
  // @ts-ignore
  delete row.links;
  row.id = ++Group.id;
  row.path = parent.path ? `${parent.path}${row.id}#` : `ROOT${row.id}#`;
  row.tag_id = parent.tag_id;
  linking(links, row.id);
  db.add(row);
  return row.id;
};

const linking = (links: GroupVO['links'], group_id: number) => {
  if (!links) return;
  const flutten = Object.keys(links).reduce((arr, k) => {
    const ls = (links as any)[k] || [];
    return arr.concat(
      ls.map((path: string) => {
        // path -> id
        return query({ path })?.id;
      }),
    );
  }, []);
  if (flutten.length === 0) {
    return dbx.del((i) => {
      return i.group_id === group_id || i.link_group_id === group_id;
    });
  }
  const append = flutten.reduce((o: any, id) => {
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

const del = (group: Partial<GroupVO>) => {
  const d = db.query((x) => matcher(group, x, false));

  // 事务??

  if (!d) return;
  // 删除关联表
  db.list((x) => x.path.startsWith(d.path)).forEach((son) => {
    dbx.del((x) => x.group_id === son.id || x.link_group_id === son.id);
  });
  // 删除本体和子节点们
  const ret = db.del((x) => !x.is_root && x.path.startsWith(d.path));
  return ret;
};

const update = (group: Partial<GroupVO>) => {
  const match: typeof group = {};
  if (group.id) match.id = group.id;
  if (group.tag_id) match.tag_id = group.tag_id;
  if (group.space_id) match.space_id = group.space_id;
  db.update(
    (x) => matcher(match, x, false),
    (old) => {
      return { ...old, ...group };
    },
  );
  const neo = db.query((x) => x.id === group.id);
  if (!neo) return;
  const next = query({ id: neo.id });
  if (group.links && !_.isEqual(group.links, next?.links)) {
    linking(group.links, neo.id);
  }
};

export { add, del, update, query, list };
