import { Group, Space, Tag } from '../db/dao';

export type SpaceVO = Space;
export type TagVO = Tag & {
  space_alias: Space['alias'];
};
export type GroupVO = Group & {
  children: GroupVO[];
  tag_alias: TagVO['alias'];
  space_id: TagVO['space_id'];
  space_alias: TagVO['space_alias'];
  type: TagVO['type'];
  links: {
    [tag_alias: string]: Group['path'][];
  };
};
