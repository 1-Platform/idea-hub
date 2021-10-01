import { CSSProperties, useCallback } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';

import {
  Menu,
  MenuList,
  MenuGroup,
  MenuItem,
  Split,
  SplitItem,
  Spinner,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { useQuery } from 'hooks';
import { TagCount } from 'pages/HomePage/types';

interface Props {
  tags: TagCount['data'];
  isLoading?: boolean;
}

export const Categories = ({ tags, isLoading }: Props): JSX.Element => {
  const userInfo = window?.OpAuthHelper?.getUserInfo();

  // url manipulation hooks
  const navigate = useNavigate();
  const query = useQuery();
  const author = query.get('author');
  const category = query.get('category');

  const handleMenuClick = useCallback(
    (key: 'author' | 'category', value: string | null) => {
      const params: Record<string, string> = {};
      if (author) params.author = author;
      if (category) params.category = category;
      if (value) {
        params[key] = value;
      } else {
        delete params[key];
      }
      navigate({
        pathname: '',
        search: '?' + createSearchParams(params),
      });
    },
    [category, author, navigate]
  );

  return (
    <Menu style={{ '--pf-c-menu--BoxShadow': 0 } as CSSProperties}>
      <MenuGroup>
        <MenuList className="pf-u-pt-0">
          <MenuItem
            className={css({ 'pf-u-font-weight-bold': author === userInfo?.rhatUUID })}
            onClick={() => handleMenuClick('author', userInfo?.rhatUUID)}
          >
            My ideas
          </MenuItem>

          <MenuItem
            className={css({ 'pf-u-font-weight-bold': !Boolean(author) })}
            onClick={() => handleMenuClick('author', null)}
          >
            Discover
          </MenuItem>
        </MenuList>
      </MenuGroup>
      <MenuGroup label="Categories">
        {isLoading ? (
          <div className="pf-u-p-md">
            <Spinner size="lg" />
          </div>
        ) : (
          <MenuList>
            {tags.map(({ key, value }) => (
              <MenuItem
                key={key}
                onClick={() => handleMenuClick('category', category === key ? null : key)}
              >
                <Split>
                  <SplitItem
                    className={css({
                      'pf-u-font-weight-bold': category === key,
                      capitalize: true,
                    })}
                  >
                    {key}
                  </SplitItem>
                  <SplitItem isFilled />
                  <SplitItem style={{ opacity: 0.4 }}>{value}</SplitItem>
                </Split>
              </MenuItem>
            ))}
          </MenuList>
        )}
      </MenuGroup>
    </Menu>
  );
};
