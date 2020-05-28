// [
//   Space[
//     Group(
//       Tag
//     )
//   ]
// ]

// Space
// Space X Group
// Group X Tag

import db, { TABLE, TYPE } from './index';
const max = (table: TABLE) => {
  return Math.max(
    0,
    ...db<any>(table)
      .list((x) => true)
      .map((x) => x.id),
  );
};
export class Space {
  static id = max(TABLE.SPACE);
  id = Space.id;
  alias = '';
}

export class Tag {
  static id = max(TABLE.TAG);
  id = Tag.id;
  alias = '';
  space_id = 0;
  type: TYPE = TYPE.USER;
  space_alias = '';
}

export class Group {
  static id = max(TABLE.GROUP);
  id = Group.id;
  alias = '';
  path = '';
  is_root = false;
  tag_id = 0;
  children: Group[] = [];
}

export class GroupXGroup {
  static id = max(TABLE.GROUPXGROUP);
  id = GroupXGroup.id;
  group_id = 0;
  link_group_id = 0;
}

const DAO = {
  Space,
  Tag,
  Group,
  GroupXGroup,
};

export default DAO;
