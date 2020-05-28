import React, { FC, useContext } from 'react';
import { Link } from '@reach/router';
import Ctx from './ctx';

const menus = {
  name: 'A SPACE ODYSSEY  🛰',
  links: [
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
  ],
};

const Nav: FC = () => {
  const ctx = useContext(Ctx);
  return (
    <div style={{ borderRight: '1px solid #ececec', height: '100%' }}>
      <p style={{ fontWeight: 'bold' }}>{menus.name}</p>
      {ctx
        ? ctx.menus.map((x: any) => {
            return (
              <Link key={x.key} to={x.url}>
                <div style={{ padding: '16px' }}>
                  {x.name.replace('//GROUP', '____').replace('//TAG', '_')}
                </div>
              </Link>
            );
          })
        : null}
    </div>
  );
};

export default Nav;
