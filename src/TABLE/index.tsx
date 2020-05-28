import { RouteComponentProps } from '@reach/router';
import { Table } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import database from '../db';
import * as spaces from '../server/space';
import * as tags from '../server/tag';
import * as groups from '../server/group';

const List: FC<RouteComponentProps> = () => {
  const [spaceList, setSpaceList] = useState<any[]>([]);
  const [tagList, setTagList] = useState<any[]>([]);
  const [groupList, setGroupList] = useState<any[]>([]);
  const [xList, setXList] = useState<any[]>([]);
  useEffect(() => {
    setSpaceList(spaces.list());
    setTagList(tags.list());
    setGroupList(groups.list().map((x: any) => ({ ...x, children: null })));
    setXList(database(database.TABLE.GROUPXGROUP).list(() => true));
  }, []);
  return (
    <div>
      <h2>SPACE</h2>
      <Table
        rowKey="id"
        dataSource={spaceList}
        columns={[
          { key: 'id', dataIndex: 'id', title: 'ID' },
          { key: 'alias', dataIndex: 'alias', title: 'ALIAS' },
        ]}
      ></Table>
      <h2>TAG</h2>
      <Table
        rowKey="id"
        dataSource={tagList}
        columns={[
          { key: 'id', dataIndex: 'id', title: 'ID' },
          { key: 'alias', dataIndex: 'alias', title: 'ALIAS' },
          { key: 'type', dataIndex: 'type', title: 'TYPE' },
          {
            key: 'space_id',
            dataIndex: 'space_id',
            title: 'SPACE_ID',
          },
          {
            key: 'space_alias',
            dataIndex: 'space_alias',
            title: 'SPACE_ALIAS',
          },
        ]}
      ></Table>
      <h2>GROUP</h2>
      <Table
        rowKey="id"
        dataSource={groupList}
        columns={[
          { key: 'id', dataIndex: 'id', title: 'ID' },
          { key: 'alias', dataIndex: 'alias', title: 'ALIAS' },
          { key: 'type', dataIndex: 'type', title: 'TYPE' },
          { key: 'tag_id', dataIndex: 'tag_id', title: 'TAG_ID' },
          { key: 'tag_alias', dataIndex: 'tag_alias', title: 'TAG_ALIAS' },
          {
            key: 'space_id',
            dataIndex: 'space_id',
            title: 'SPACE_ID',
          },
          {
            key: 'space_alias',
            dataIndex: 'space_alias',
            title: 'SPACE_ALIAS',
          },
        ]}
      ></Table>
      <h2>GROUP X GROUP</h2>
      <Table
        rowKey="id"
        dataSource={xList}
        columns={[
          { key: 'id', dataIndex: 'id', title: 'ID' },
          { key: 'group_id', dataIndex: 'group_id', title: 'GROUP_ID' },
          {
            key: 'link_group_id',
            dataIndex: 'link_group_id',
            title: 'LINK_GROUP_ID',
          },
        ]}
      ></Table>
    </div>
  );
};

export default List;
