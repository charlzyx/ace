import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import _ from 'lodash';
import Ctx, { Menu } from './Nav/ctx';
import { Space as Box, Card } from 'antd';

import { GithubOutlined } from '@ant-design/icons';
import { RouteComponentProps, Router } from '@reach/router';
import Space from './Space';
import Tag from './Tag';
import Group from './Group';
import TABLE from './TABLE';
import * as tags from './server/tag';
import * as spaces from './server/space';

const up = (updater: React.Dispatch<React.SetStateAction<Menu[]>>) => {
  return () => {
    const spacelist: Menu[] = spaces.list().map((x) => {
      return {
        key: x.id.toString(),
        name: `🛸_${x.alias}`,
        url: `/ace/tag/${x.id}`,
      };
    });
    const list: Menu[] = tags.list().map((x) => {
      return {
        key: x.id.toString() + x.space_id + x.id,
        name: `🚀____${x.alias}`,
        url: `/ace/group/${x.space_id}/${x.id}`,
      };
    });
    updater((x) => {
      const menus = x.concat(spacelist).concat(list);
      return _.uniqBy(menus, (x) => x.key);
    });
  };
};

let Home = (props: RouteComponentProps) => (
  <div>
    <Box direction="vertical" style={{ width: '100%' }} size="large">
      <Card title="USER">
        <Card.Grid>&nbsp;USER X DATA</Card.Grid>
        <Card.Grid>&nbsp;USER X ROLE</Card.Grid>
      </Card>
      <Card title="DATA">
        <Card.Grid>&nbsp;DATA X USER</Card.Grid>
      </Card>
      <Card title="RESOURCE">
        <Card.Grid>&nbsp;RESOURCE X ROLE</Card.Grid>
      </Card>
      <Card title="ROLE">
        <Card.Grid>&nbsp;ROLE X USER</Card.Grid>
        <Card.Grid>&nbsp;ROLE X RESOURCE</Card.Grid>
      </Card>
    </Box>
  </div>
);

export const App: React.FunctionComponent = () => {
  const [menus, setMenus] = useState<Menu[]>([
    {
      key: 'HOME',
      name: 'HOME',
      url: '/ace',
    },
    {
      key: 'TABLE',
      name: 'TABLE',
      url: '/ace/table',
    },
    {
      key: 'SPACE',
      name: 'SPACE',
      url: '/ace/space',
    },
  ]);
  useEffect(() => {
    up(setMenus)();
  }, []);

  return (
    <Ctx.Provider value={{ menus, update: up(setMenus) }}>
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '8px',
            boxShadow: '0px 0px 12px #cecece',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h2>
            <span aria-label="fireman" role="img">
              🚒
            </span>
            &nbsp; Access Control Evolved
          </h2>
          <h2>
            <a href="https://github.com/charlzyx/ace">
              <GithubOutlined translate="span" />
            </a>
          </h2>
        </div>
        <div style={{ flex: 1, display: 'flex', padding: '16px' }}>
          <div style={{ width: '200px', height: '100vh' }}>
            <Nav></Nav>
          </div>
          <div style={{ height: '100vh', width: '100%', padding: '0 8px' }}>
            <Router basepath="/ace">
              <Home path="/"></Home>
              <Space path="/space"></Space>
              <Tag path="/tag/:space_id"></Tag>
              <Group path="/group/:space_id/:tag_id"></Group>
              <TABLE path="/table"></TABLE>
            </Router>
          </div>
        </div>
      </div>
    </Ctx.Provider>
  );
};
