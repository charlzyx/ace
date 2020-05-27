import React, { FC } from 'react';
import { Link } from '@reach/router';

const menus = {
  name: 'A SPACE ODYSSEY',
  links: [
    {
      key: 'HOME',
      name: 'HOME',
      url: '/',
    },
    {
      key: 'SPACE',
      name: 'SPACE',
      url: '/space',
    },
  ],
};

const Nav: FC = () => {
  return (
    <div style={{ borderRight: '1px solid #ececec', height: '100%' }}>
      <p style={{ fontWeight: 'bold' }}>{menus.name}</p>
      {menus.links.map((x) => {
        return (
          <Link key={x.key} to={x.url}>
            <div style={{ padding: '16px' }}>{x.name}</div>
          </Link>
        );
      })}
    </div>
  );
};

export default Nav;
