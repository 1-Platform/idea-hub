import { CSSProperties } from 'react';

import { Menu, MenuList, MenuGroup, MenuItem, Split, SplitItem } from '@patternfly/react-core';

const stats = [
  {
    title: 'Apps',
    count: 20,
  },
  {
    title: 'Developer Tools',
    count: 18,
  },
  {
    title: 'Business',
    count: 25,
  },
  {
    title: 'Enterprise Cloud',
    count: 30,
  },
  {
    title: 'Analytics',
    count: 50,
  },
];

export const Categories = (): JSX.Element => {
  return (
    <Menu style={{ '--pf-c-menu--BoxShadow': 0 } as CSSProperties}>
      <MenuGroup>
        <MenuList>
          <MenuItem>My ideas</MenuItem>
          <MenuItem className="text-bold">Discover</MenuItem>
        </MenuList>
      </MenuGroup>
      <MenuGroup label="Categories">
        <MenuList>
          {stats.map(({ count, title }) => (
            <MenuItem key={title}>
              <Split>
                <SplitItem>{title}</SplitItem>
                <SplitItem isFilled />
                <SplitItem style={{ opacity: 0.4 }}>{count}</SplitItem>
              </Split>
            </MenuItem>
          ))}
        </MenuList>
      </MenuGroup>
    </Menu>
  );
};
