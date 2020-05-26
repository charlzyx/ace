import React, { FC, useCallback, useEffect, useState } from 'react';
import { RouteComponentProps, useParams } from '@reach/router';
import { Button, List, Stack, Text, TextField } from '@fluentui/react';
import Api, { TGroup } from '../api';

const Group: FC<RouteComponentProps> = () => {
  const params = useParams();
  // location.search
  const [name, setName] = useState('');
  const [list, setList] = useState<TGroup[]>([]);

  const query = useCallback(() => {
    Api.group.query(params.gid).then((data) => {
      setList(data);
    });
  }, [params.gid]);

  useEffect(() => {
    query();
  }, [query]);

  return (
    <div>
      <Text variant="xxLarge">Group</Text>
      <Stack horizontal>
        <Stack>
          <Button>新增</Button>
          <List
            items={list}
            onRenderCell={(props) => {
              return (
                <div>
                  ID: {props?.id} | NAME: {props?.name}
                </div>
              );
            }}
          />
        </Stack>
        <Stack>
          <TextField
            label="NAME:"
            value={name}
            onChange={(e) => setName((e.target as any).value)}
          ></TextField>
          <Button
            onClick={() => {
              Api.group.append(params.gid, name, 'user').then(() => {
                query();
              });
            }}
          >
            保存
          </Button>
        </Stack>
      </Stack>

      <div>
        <pre>{JSON.stringify(params, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Group;
