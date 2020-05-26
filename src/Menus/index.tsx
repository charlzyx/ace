import * as React from 'react';
import { INavLinkGroup, INavStyles, Nav } from '@fluentui/react';

const navStyles: Partial<INavStyles> = { root: { width: 300 } };

const navLinkGroups: INavLinkGroup[] = [
  {
    name: 'A SPACE ODYSSEY',
    links: [
      {
        key: 'FORM',
        name: 'FORM',
        url: '/form',
      },
      {
        key: 'SPACE',
        name: 'SPACE',
        url: '/space/1',
      },
      {
        key: 'GROUP',
        name: 'GROUP',
        url: '/group/1/1',
      },
    ],
  },
];

export const Menus: React.FunctionComponent = () => {
  return <Nav styles={navStyles} groups={navLinkGroups} />;
};
