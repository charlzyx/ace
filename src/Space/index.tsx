import React, { FC, useCallback, useEffect, useState } from 'react';
import { RouteComponentProps, useParams } from '@reach/router';
import { Button, List, Stack, Text, TextField } from '@fluentui/react';
import Api, { TSpace } from '../api';

const Space: FC<RouteComponentProps> = () => {
  const params = useParams();
  const [name, setName] = useState('');
  const [list, setList] = useState<TSpace[]>([]);

  const query = useCallback(() => {
    Api.space.query().then((data) => {
      setList(data);
    });
  }, []);

  useEffect(() => {
    query();
  }, [query]);

  return (
    <div>
      <Text variant="xxLarge">SPACE</Text>
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
              Api.space.append(name).then(() => {
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

export default Space;
