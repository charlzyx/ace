import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import _ from 'lodash';
import Ctx, { Menu } from './Nav/ctx';
import { RouteComponentProps, Router } from '@reach/router';
import Space from './Space';
import Tag from './Tag';
import Group from './Group';
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

let Home = (props: RouteComponentProps) => <div>Home</div>;

export const App: React.FunctionComponent = () => {
  const [menus, setMenus] = useState<Menu[]>([
    {
      key: 'HOME',
      name: 'HOME',
      url: '/ace',
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
          }}
        >
          <h2>🚒 Access Control Evolved</h2>
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
            </Router>
          </div>
        </div>
      </div>
    </Ctx.Provider>
  );
};
