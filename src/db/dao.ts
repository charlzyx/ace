// [
//   Space[
//     Group(
//       Type
//     )
//   ]
// ]

// Space
// Space X Group
// Group X Type

import db, { TABLE } from './index';
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

export class Type {
  static id = max(TABLE.TYPE);
  id = Type.id;
  alias = '';
  space_id = 0;
  space_alias = '';
}

export class Group {
  static id = max(TABLE.GROUP);
  id = Group.id;
  alias = '';
  path = '';
  is_root = false;
  type_id = -1;
  type_alias = '';
  space_id = -1;
  space_alias = '';
  children: Group[] = [];
}

export class GroupXGroup {
  static id = max(TABLE.GROUPXGROUP);
  id = GroupXGroup.id;
  group_id = -1;
  group_alias = '';
  link_group_id = -1;
  link_group_alias = '';
}

const DAO = {
  Space,
  Type,
  Group,
  GroupXGroup,
};

export default DAO;
