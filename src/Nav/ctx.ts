import { createContext } from 'react';

export type Menu = {
  key: string;
  name: string;
  url: string;
};

const Ctx = createContext<{
  menus: Menu[];
  update: () => void;
}>({
  menus: [],
  update: () => {},
});

export default Ctx;
